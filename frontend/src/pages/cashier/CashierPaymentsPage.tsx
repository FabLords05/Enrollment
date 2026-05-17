/**
 * CashierPaymentsPage.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/pages/cashier/CashierPaymentsPage.tsx
 */

import React, { useState } from 'react';

const pendingPayments = [
  { id: 1, studentId: '2023-00121', name: 'Maria Santos',    course: 'BSCS',  balance: 11450, due: 'Jul 30' },
  { id: 2, studentId: '2023-00145', name: 'Jose Reyes',      course: 'BSEE',  balance: 9800,  due: 'Jul 30' },
  { id: 3, studentId: '2023-00089', name: 'Ana Cruz',        course: 'BSME',  balance: 13200, due: 'Jul 30' },
  { id: 4, studentId: '2023-00200', name: 'Mark Tan',        course: 'BSCS',  balance: 6750,  due: 'Jul 30' },
  { id: 5, studentId: '2022-00311', name: 'Liza Flores',     course: 'BSBA',  balance: 8400,  due: 'Jul 30' },
  { id: 6, studentId: '2022-00298', name: 'Carlo Mendez',    course: 'BSCE',  balance: 12000, due: 'Jul 30' },
];

function fmt(n: number) { return '₱' + n.toLocaleString(); }

export default function CashierPaymentsPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');

  const filtered = pendingPayments.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.studentId.includes(search)
  );

  const handlePost = () => {
    alert(`✅ Payment of ${fmt(Number(amount))} posted for student ID ${selected} via ${method}.`);
    setSelected(null);
    setAmount('');
  };

  return (
    <div className="space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ustpDarkBlue">Pending Payments</h3>
          <p className="text-[12px] text-gray-400">{filtered.length} students with outstanding balance</p>
        </div>
        <input
          type="text"
          placeholder="Search name or ID…"
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
                  <th className="px-5 py-3">Student ID</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className={`border-t border-gray-100 transition-colors ${selected === p.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-5 py-3 font-mono text-[12px] text-ustpBlue">{p.studentId}</td>
                    <td className="px-5 py-3 text-gray-700 font-medium">{p.name}</td>
                    <td className="px-5 py-3 text-gray-500">{p.course}</td>
                    <td className="px-5 py-3 text-right font-bold text-red-500">{fmt(p.balance)}</td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => { setSelected(p.id); setAmount(String(p.balance)); }}
                        className="text-[11px] bg-ustpDarkBlue text-white px-3 py-1 rounded-lg hover:bg-ustpBlue transition-colors font-semibold"
                      >
                        Post Payment
                      </button>
                    </td>
                  </tr>
                ))}
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
                  {pendingPayments.find(p => p.id === selected)?.name}
                </div>
                <div className="text-[11px] text-gray-400">
                  Balance: <span className="text-red-500 font-bold">{fmt(pendingPayments.find(p => p.id === selected)?.balance ?? 0)}</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Amount (₱)</label>
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
