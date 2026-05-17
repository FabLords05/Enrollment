/**
 * StudentFinancePage.tsx  ─  BACKEND CONNECTED
 * Drop into: frontend/src/pages/student/StudentFinancePage.tsx
 */

import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axiosSetup';
import { AuthContext } from '../../context/AuthContext';

interface StudentProfile {
  id: number;
  email: string;
  enrollment_status: string;
  section?: number | null;
}

interface Subject {
  id: number;
  secId: number;
  units: number;
}

interface FeeItem {
  description: string;
  amount: number;
  status: 'Paid' | 'Unpaid';
}

function fmt(n: number) { return '₱' + n.toLocaleString(); }

export default function StudentFinancePage() {
  const { user } = useContext(AuthContext) || {};
  const [loading, setLoading] = useState(true);
  
  const [status, setStatus] = useState<string>('ADVISING');
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (user?.email) {
      fetchFinancialData();
    }
  }, [user]);

  const fetchFinancialData = async () => {
    try {
      // 1. Fetch data from backend
      const [studentsRes, subjectsRes] = await Promise.all([
        api.get<StudentProfile[]>('students/'),
        api.get<Subject[]>('subjects/')
      ]);

      // 2. Find the logged-in student
      const myProfile = studentsRes.data.find(s => s.email === user?.email);
      
      if (!myProfile) {
        setLoading(false);
        return;
      }

      const currentStatus = myProfile.enrollment_status || 'ADVISING';
      setStatus(currentStatus);

      // 3. If they are Assessed, Paid, or Enrolled, calculate their bill dynamically
      if (['ASSESSED', 'PAID', 'ENROLLED'].includes(currentStatus)) {
        // Calculate units based on their section's subjects
        const mySubjects = subjectsRes.data.filter(sub => sub.secId === myProfile.section);
        const totalUnits = mySubjects.reduce((sum, sub) => sum + sub.units, 0);
        
        // Define standard rates
        const tuitionRate = 400;
        const tuitionTotal = totalUnits * tuitionRate;
        
        // If PAID or ENROLLED, everything is Paid. If ASSESSED, everything is Unpaid.
        const feeStatus = ['PAID', 'ENROLLED'].includes(currentStatus) ? 'Paid' : 'Unpaid';

        const generatedFees: FeeItem[] = [
          { description: `Tuition Fee (${totalUnits} units × ₱${tuitionRate})`, amount: tuitionTotal, status: feeStatus },
          { description: 'Miscellaneous Fee', amount: 1500, status: feeStatus },
          { description: 'Laboratory Fee',    amount: 1200, status: feeStatus },
          { description: 'NSTP Fee',          amount: 350,  status: feeStatus },
          { description: 'Student Fund',      amount: 500,  status: feeStatus },
          { description: 'Registration Fee',  amount: 500,  status: feeStatus },
        ];
        
        setFees(generatedFees);

        // Generate a mock payment record if they have already paid
        if (feeStatus === 'Paid') {
          const totalAmount = generatedFees.reduce((a, f) => a + f.amount, 0);
          setPayments([
            { ref: `OR-2025-${myProfile.id}A`, desc: 'Full Semester Assessment', amount: totalAmount, date: new Date().toLocaleDateString(), method: 'Cashier' }
          ]);
        }
      }

    } catch (err) {
      console.error("Failed to load financial data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-400 font-medium animate-pulse">Loading financial assessment...</div>;
  }

  // If the student is still in ADVISING, hide the bill
  if (status === 'ADVISING') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center text-blue-800">
        <h2 className="text-lg font-bold mb-2">Assessment Pending</h2>
        <p className="text-sm opacity-80">Your subjects are currently being reviewed by the Registrar. Once you are officially <strong>ASSESSED</strong>, your tuition breakdown will appear here.</p>
      </div>
    );
  }

  const totalDue  = fees.filter(f => f.status === 'Unpaid').reduce((a, f) => a + f.amount, 0);
  const totalPaid = fees.filter(f => f.status === 'Paid').reduce((a, f) => a + f.amount, 0);

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Assessment</div>
          <div className="text-2xl font-extrabold text-ustpDarkBlue">{fmt(totalDue + totalPaid)}</div>
          <div className="text-[12px] text-gray-400 mt-0.5">Current semester</div>
        </div>
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-5">
          <div className="text-[11px] text-red-400 font-semibold uppercase tracking-wider mb-1">Outstanding Balance</div>
          <div className="text-2xl font-extrabold text-red-500">{fmt(totalDue)}</div>
          <div className="text-[12px] text-gray-400 mt-0.5">Due: July 30, 2025</div>
        </div>
        <div className="bg-white rounded-xl border border-green-200 shadow-sm p-5">
          <div className="text-[11px] text-green-500 font-semibold uppercase tracking-wider mb-1">Total Paid</div>
          <div className="text-2xl font-extrabold text-green-600">{fmt(totalPaid)}</div>
          <div className="text-[12px] text-gray-400 mt-0.5">Confirmed payments</div>
        </div>
      </div>

      {/* Fee breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-[14px] font-bold text-ustpDarkBlue">Fee Assessment Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f, i) => (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-700">{f.description}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-800">{fmt(f.amount)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                      f.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-500'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="border-t-2 border-gray-200 bg-gray-50">
                <td className="px-5 py-3 font-bold text-ustpDarkBlue">Total Outstanding</td>
                <td className="px-5 py-3 text-right font-extrabold text-red-500">{fmt(totalDue)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-[14px] font-bold text-ustpDarkBlue">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Reference No.</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Method</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((p, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-[12px] text-ustpBlue">{p.ref}</td>
                    <td className="px-5 py-3 text-gray-700">{p.desc}</td>
                    <td className="px-5 py-3 text-right font-semibold text-emerald-600">{fmt(p.amount)}</td>
                    <td className="px-5 py-3 text-gray-500">{p.date}</td>
                    <td className="px-5 py-3 text-gray-500">{p.method}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-gray-400">No payments recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice */}
      {status === 'ASSESSED' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-[12px] text-blue-700">
          💳 To pay your outstanding balance, please visit the <strong>Cashier's Office</strong> (Admin Bldg, Room 102) during office hours (Mon–Fri, 8 AM–5 PM). Provide your Student ID to the teller.
        </div>
      )}
    </div>
  );
}