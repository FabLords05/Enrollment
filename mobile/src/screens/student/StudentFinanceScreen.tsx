import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosSetup';
import { COLORS } from '../../constants/colors';
import { useFocusEffect } from '@react-navigation/native';

export default function StudentFinanceScreen() {
  const auth = useAuth();
  const [state, setState] = useState({ loading: true, status: 'ADVISING', units: 0, balance: 0, notFound: false });
  const [assessment, setAssessment] = useState<any | null>(null);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [student, setStudent] = useState<any | null>(null);

  const getTimeFrom = (obj: any) => {
    const candidates = [
      'created_at', 'created', 'timestamp', 'date', 'posted_at', 'created_on', 'createdAt', 'createdOn', 'date_created', 'datetime', 'time', 'created_date'
    ];
    let raw: any = null;
    for (const k of candidates) {
      if (obj?.[k]) {
        raw = obj[k];
        break;
      }
    }
    // try nested possible locations
    if (!raw && obj?.meta?.created_at) raw = obj.meta.created_at;
    if (!raw && obj?.attributes?.created_at) raw = obj.attributes.created_at;
    if (!raw && obj?.date_paid) raw = obj.date_paid;
    if (!raw) return 0;
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d.getTime();
    const n = Number(raw);
    if (!Number.isNaN(n)) return new Date(n).getTime();
    return 0;
  };

  const formatDateSafe = (obj: any) => {
    const candidates = [
      'created_at', 'created', 'timestamp', 'date', 'posted_at', 'created_on', 'createdAt', 'createdOn', 'date_created', 'datetime', 'time', 'created_date', 'date_paid'
    ];
    let raw: any = null;
    for (const k of candidates) {
      if (obj?.[k]) {
        raw = obj[k];
        break;
      }
    }
    if (!raw && obj?.meta?.created_at) raw = obj.meta.created_at;
    if (!raw && obj?.attributes?.created_at) raw = obj.attributes.created_at;
    if (!raw) {
      // fallback to receipt_number or id as a last resort displayed string
      return obj?.receipt_number || obj?.id ? String(obj.receipt_number || obj.id) : 'Unknown date';
    }
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d.toLocaleString();
    const n = Number(raw);
    if (!Number.isNaN(n)) {
      const d2 = new Date(n);
      if (!isNaN(d2.getTime())) return d2.toLocaleString();
    }
    return String(raw);
  };

  const fetchFinanceData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      const [stu, sub, assessmentRes] = await Promise.all([
        api.get('students/'),
        api.get('subjects/'),
        api.get('assessments/'),
      ]);

      const userEmail = auth?.user?.email?.toLowerCase();
      const active = stu.data.find((s: any) => {
        const studentEmail = (s.email || s.user?.email)?.toLowerCase?.();
        return studentEmail === userEmail;
      });

      if (!active) {
        console.warn('Student profile not found in API response');
        setState(prev => ({ ...prev, loading: false, notFound: true }));
        setAssessment(null);
        return;
      }

      const filtered = sub.data.filter((s: any) => s.secId === active.section);
      const unitsCount = filtered.reduce((sum: number, s: any) => sum + s.units, 0);
      const activeAssessment = assessmentRes.data.find((a: any) => a.student_id === active.id) || null;

      const balance = activeAssessment
        ? Number(activeAssessment.balance_due)
        : active.enrollment_status === 'ASSESSED'
        ? unitsCount * 400 + 3550
        : 0;

      setAssessment(activeAssessment);
      setStudent(active);

      // Fetch payments for this assessment
      try {
        const paymentsRes = await api.get('payments/');
        const paymentsData = paymentsRes.data?.results || paymentsRes.data || [];
        const filtered = (paymentsData as any[]).filter((p: any) => activeAssessment && p.assessment === activeAssessment.id);
        const sorted = filtered.sort((a: any, b: any) => {
          const da = getTimeFrom(a);
          const db = getTimeFrom(b);
          return db - da;
        });
        setPayments(sorted);
      } catch (pe) {
        console.warn('Could not load payments', pe);
        setPayments([]);
      }

      setState({
        loading: false,
        status: active.enrollment_status,
        units: unitsCount,
        balance,
        notFound: false,
      });
    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFinanceData();
    }, [auth?.user])
  );

  const handlePayment = async () => {
    const amountNumber = Number(paymentAmount);

    if (!assessment) {
      Alert.alert('Payment Error', 'Unable to find your assessment record. Please try again later.');
      return;
    }

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount greater than 0.');
      return;
    }

    // Prevent overpayment
    const amountToPay = parseFloat(paymentAmount);
    const balanceDue = Number(assessment?.balance_due ?? 0);
    if (!Number.isNaN(amountToPay) && amountToPay > balanceDue) {
      Alert.alert('Invalid Amount', `You cannot pay more than your outstanding balance of ₱${balanceDue.toLocaleString()}.`);
      return;
    }

    setIsProcessing(true);

    try {
      const receipt_number = `REC-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
      await api.post('payments/', {
        assessment: assessment.id,
        amount_paid: amountNumber,
        receipt_number,
      });

      setPaymentModalVisible(false);
      setPaymentAmount('');
      Alert.alert('Success', 'Payment posted!');
      fetchFinanceData();
    } catch (error: any) {
      console.error('Payment error', error);
      const backendMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.receipt_number?.[0] ||
        error?.response?.data?.amount_paid?.[0] ||
        error?.message ||
        'Unable to complete the payment. Please try again.';
      Alert.alert('Payment Failed', String(backendMessage));
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.notFound) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.centerTitle}>Student Profile Not Found</Text>
        <Text style={styles.centerDesc}>We could not locate your student account. Please verify your login credentials and contact the Registrar for assistance.</Text>
      </View>
    );
  }

  if (state.status === 'ADVISING') {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.centerTitle}>Assessment Pending ⏳</Text>
        <Text style={styles.centerDesc}>Your course loads are undergoing verification checks by the Registrar. Fee breakdowns will appear here upon authorization approval windows.</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={{ padding: 14, backgroundColor: '#F9FAFB' }}>
        <View style={styles.invoiceCard}>
          <Text style={styles.invoiceLabel}>Outstanding Balance Statement</Text>
          <Text style={styles.invoiceAmount}>₱{state.balance.toLocaleString()}</Text>
          <Text style={styles.invoiceSub}>Clearance Status: {state.status}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fee Breakdown Checklist</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>Tuition Credit Fees ({state.units} u × ₱400)</Text>
            <Text style={styles.itemVal}>₱{(state.units * 400).toLocaleString()}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>Miscellaneous Registration Fees</Text>
            <Text style={styles.itemVal}>₱1,500</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>Laboratory Access Costs</Text>
            <Text style={styles.itemVal}>₱1,200</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>Student Welfare Funds</Text>
            <Text style={styles.itemVal}>₱850</Text>
          </View>
        </View>

        {assessment && Number(assessment?.balance_due) > 0 ? (
          <TouchableOpacity style={styles.paymentTrigger} onPress={() => setPaymentModalVisible(true)}>
            <Text style={styles.paymentTriggerText}>Make a Payment</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.paidBanner}>
            <Text style={styles.paidBannerText}>🎉 Balance Fully Paid</Text>
          </View>
        )}

        <View style={{ marginTop: 18 }}>
          <Text style={styles.historyTitle}>Transaction History</Text>
          {payments.length === 0 ? (
            <Text style={styles.emptyHistory}>No recent transactions.</Text>
          ) : (
            payments.map((p) => {
              const dateStr = (typeof formatDateSafe === 'function') ? formatDateSafe(p) : new Date(p.created_at || p.timestamp || p.date || p.posted_at || Date.now()).toLocaleString();
              const amount = Number(p.amount_paid || p.amount || 0);
              return (
                <View key={p.id || `${p.receipt_number}-${p.amount_paid}-${p.assessment}`} style={styles.txnCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.txnDate}>{dateStr}</Text>
                    <Text style={styles.txnAmount}>₱{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                  </View>
                  <TouchableOpacity style={styles.viewReceiptBtn} onPress={() => setSelectedReceipt(p)}>
                    <Text style={styles.viewReceiptText}>View Receipt</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isPaymentModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Make a Payment</Text>
            <TextInput
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              placeholder="Enter amount"
              placeholderTextColor="#718096"
              keyboardType="numeric"
              style={styles.input}
              editable={!isProcessing}
            />

            <TouchableOpacity
              style={[styles.gcashButton, isProcessing && styles.disabledButton]}
              onPress={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.gcashButtonText}>Pay via GCash</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setPaymentModalVisible(false);
                setPaymentAmount('');
              }}
              disabled={isProcessing}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        visible={selectedReceipt !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedReceipt(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.receiptModalCard]}>
            <View style={styles.dashedBorder}>
              <Text style={styles.receiptHeader}>UNIVERSITY OF SAMPLE</Text>
              <Text style={{ textAlign: 'center', color: COLORS.textMuted, marginBottom: 12 }}>Digital Payment Receipt</Text>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptField}>Reference:</Text>
                <Text style={styles.receiptField}>{selectedReceipt?.receipt_number || selectedReceipt?.id}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptField}>Date/Time:</Text>
                <Text style={styles.receiptField}>{selectedReceipt ? formatDateSafe(selectedReceipt) : ''}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptField}>Amount:</Text>
                <Text style={styles.receiptField}>₱{Number(selectedReceipt?.amount_paid || selectedReceipt?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptField}>Method:</Text>
                <Text style={styles.receiptField}>{selectedReceipt?.payment_method || selectedReceipt?.method || 'GCash'}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptField}>Student:</Text>
                <Text style={styles.receiptField}>{student ? `${student.first_name} ${student.last_name} (${student.id})` : ''}</Text>
              </View>

              <TouchableOpacity style={[styles.cancelButton, styles.receiptCloseButton]} onPress={() => setSelectedReceipt(null)}>
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: COLORS.blueBg, margin: 20, borderRadius: 12 },
  centerTitle: { fontSize: 16, fontWeight: '800', color: '#2B6CB0', marginBottom: 6 },
  centerDesc: { fontSize: 12, color: '#4A5568', textAlign: 'center', lineHeight: 18 },
  invoiceCard: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 20, alignItems: 'center', marginBottom: 14 },
  invoiceLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  invoiceAmount: { fontSize: 26, fontWeight: '900', color: COLORS.red, marginVertical: 4 },
  invoiceSub: { fontSize: 11, fontWeight: '700', color: COLORS.purple },
  card: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  cardTitle: { fontSize: 13, fontWeight: '800', color: COLORS.ustpDarkBlue, marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  itemName: { fontSize: 12, color: COLORS.textMain },
  itemVal: { fontSize: 12, fontWeight: '700', color: COLORS.textMain },
  paymentTrigger: { marginTop: 20, backgroundColor: '#0078D4', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  paymentTriggerText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 24, elevation: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.ustpDarkBlue, marginBottom: 18 },
  input: { backgroundColor: '#F7FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#1A202C', marginBottom: 16 },
  gcashButton: { backgroundColor: '#1A73E8', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  gcashButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  cancelButton: { backgroundColor: '#EDF2F7', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelButtonText: { color: '#4A5568', fontSize: 15, fontWeight: '700' },
  disabledButton: { opacity: 0.6 },
  paidBanner: { marginTop: 20, backgroundColor: '#ECFDF5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#D1FAE5' },
  paidBannerText: { color: '#10B981', fontSize: 15, fontWeight: '800' },
  historyTitle: { fontSize: 15, fontWeight: '800', color: COLORS.ustpDarkBlue, marginBottom: 10 },
  emptyHistory: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', paddingVertical: 12 },
  txnCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  txnDate: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4 },
  txnAmount: { fontSize: 14, fontWeight: '800', color: COLORS.ustpDarkBlue },
  viewReceiptBtn: { backgroundColor: COLORS.ustpDarkBlue, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginLeft: 12 },
  viewReceiptText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  receiptModalCard: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  dashedBorder: { borderWidth: 1, borderStyle: 'dashed', borderColor: COLORS.border, padding: 16, borderRadius: 12, backgroundColor: '#FFF' },
  receiptHeader: { fontSize: 16, fontWeight: '900', textAlign: 'center', marginBottom: 6, color: COLORS.ustpDarkBlue },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  receiptField: { fontSize: 13, color: COLORS.textMain },
  receiptCloseButton: { marginTop: 14 },
});