/**
 * CashierPaymentsPage.tsx  ─  BACKEND CONNECTED
 * Drop into: frontend/src/pages/cashier/CashierPaymentsPage.tsx
 */

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_status: string;
  section: number | null;
  program_enrolled: string;
}

interface Subject {
  id: number;
  secId: number;
  units: number;
}

export default function CashierPaymentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState('');
  
  // Form State
  const [selected, setSelected] = useState<Student | null>(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, subjectsRes] = await Promise.all([
        api.get<Student[]>('students/'),
        api.get<Subject[]>('subjects/')
      ]);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBalance = (sectionId: number | null) => {
    if (!sectionId) return 0;
    const enrolledSubjects = subjects.filter(sub => sub.secId === sectionId);
    const units = enrolledSubjects.reduce((sum, sub) => sum + sub.units, 0);
    return (units * 400) + 3550; // Tuition + Fixed Fees
  };

  const handlePost = async () => {
    if (!selected) return;
    
    try {
      await api.patch(`students/${selected.id}/`, { enrollment_status: 'ENROLLED' });
      alert(`✅ Payment of ₱${Number(amount).toLocaleString()} posted for ${selected.first_name} via ${method}.`);
      setSelected(null);
      setAmount('');
      fetchData(); // Refresh list to remove from queue
    } catch (error) {
      console.error("Failed to post payment", error);
      alert("Failed to process payment. Check connection.");
    }
  };

  const pendingPayments = students.filter(s => s.enrollment_status === 'ASSESSED');
  const filtered = pendingPayments.filter(p =>
    `${p.first_name} ${p.last_name} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (n: number) => '₱' + n.toLocaleString();

  if (loading) return <div className="p-10 text-center text-gray-400 font-medium animate-pulse">Loading Payments System...</div>;

  return (
    <div className="space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ustpDarkBlue">Pending Payments</h3>
          <p className="text-[12px] text-gray-400">{filtered.length} students awaiting payment</p>
        </div>
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-ustpBlue/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Program</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const balance = calculateBalance(p.section);
                  return (
                    <tr key={p.id} className={`border-t border-gray-100 transition-colors ${selected?.id === p.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <td className="px-5 py-3 text-gray-700 font-medium">{p.last_name}, {p.first_name}</td>
                      <td className="px-5 py-3 text-gray-500">{p.program_enrolled || 'N/A'}</td>
                      <td className="px-5 py-3 text-right font-bold text-red-500">{fmt(balance)}</td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => { setSelected(p); setAmount(String(balance)); }}
                          className="text-[11px] bg-ustpDarkBlue text-white px-3 py-1 rounded-lg hover:bg-ustpBlue transition-colors font-semibold"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                    <tr>
                        <td colSpan={4} className="px-5 py-10 text-center text-gray-400">No pending assessments.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h4 className="text-[13px] font-bold text-ustpDarkBlue mb-4">Post Payment</h4>
          {selected ? (
            <div className="space-y-4">
              <div>
                <div className="text-[11px] text-gray-400 font-semibold mb-1">Student</div>
                <div className="text-[13px] font-bold text-gray-800">
                  {selected.first_name} {selected.last_name}
                </div>
                <div className="text-[11px] text-gray-400">
                  Total Due: <span className="text-red-500 font-bold">{fmt(calculateBalance(selected.section))}</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Amount to Pay (₱)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ustpBlue/30"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ustpBlue/30"
                >
                  <option>Cash</option>
                  <option>GCash</option>
                  <option>Bank Transfer</option>
                  <option>Check</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handlePost}
                  className="flex-1 bg-ustpDarkBlue text-white text-[12px] font-bold py-2 rounded-lg hover:bg-ustpBlue transition-colors"
                >
                  ✓ Confirm
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 bg-gray-100 text-gray-600 text-[12px] font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-300 py-10 text-[13px]">
              Select a student from the list to post a payment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}