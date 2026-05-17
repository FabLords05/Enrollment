/**
 * CashierTransactionsPage.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/pages/cashier/CashierTransactionsPage.tsx
 */

import React, { useState } from 'react';

const txData = [
  { ref:'OR-20250617-011', student:'Maria Santos',   amount:8400,  type:'Tuition',       method:'Cash',          date:'Jun 17, 2025', time:'9:15 AM' },
  { ref:'OR-20250617-010', student:'Jose Reyes',     amount:1500,  type:'Miscellaneous', method:'GCash',         date:'Jun 17, 2025', time:'8:52 AM' },
  { ref:'OR-20250617-009', student:'Ana Cruz',       amount:12450, type:'Full Payment',  method:'Bank Transfer',  date:'Jun 17, 2025', time:'8:30 AM' },
  { ref:'OR-20250617-008', student:'Mark Tan',       amount:3500,  type:'Partial',       method:'Cash',          date:'Jun 17, 2025', time:'8:10 AM' },
  { ref:'OR-20250616-022', student:'Liza Flores',    amount:8400,  type:'Tuition',       method:'Cash',          date:'Jun 16, 2025', time:'4:10 PM' },
  { ref:'OR-20250616-021', student:'Carlo Mendez',   amount:11450, type:'Full Payment',  method:'GCash',         date:'Jun 16, 2025', time:'3:45 PM' },
  { ref:'OR-20250616-020', student:'Rachel Go',      amount:5000,  type:'Partial',       method:'Cash',          date:'Jun 16, 2025', time:'2:00 PM' },
  { ref:'OR-20250616-019', student:'Daniel Ocampo',  amount:12450, type:'Full Payment',  method:'Bank Transfer',  date:'Jun 16, 2025', time:'11:20 AM' },
];

function fmt(n: number) { return '₱' + n.toLocaleString(); }

export default function CashierTransactionsPage() {
  const [dateFilter, setDateFilter] = useState('');

  const filtered = txData.filter(t => !dateFilter || t.date.includes(dateFilter));
  const total    = filtered.reduce((a, t) => a + t.amount, 0);

  return (
    <div className="space-y-5">

      {/* Header + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ustpDarkBlue">Transaction Log</h3>
          <p className="text-[12px] text-gray-400">All official receipts · {filtered.length} records</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter by date (e.g. Jun 17)"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ustpBlue/30"
          />
          <button
            onClick={() => alert('Export to CSV (connect to backend)')}
            className="bg-ustpDarkBlue text-white text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-ustpBlue transition-colors whitespace-nowrap"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Records Shown</div>
          <div className="text-xl font-extrabold text-ustpDarkBlue">{filtered.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-4 text-center">
          <div className="text-[11px] text-green-500 font-semibold uppercase tracking-wider mb-1">Total Amount</div>
          <div className="text-xl font-extrabold text-green-600">{fmt(total)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Avg. Per Transaction</div>
          <div className="text-xl font-extrabold text-ustpDarkBlue">
            {filtered.length ? fmt(Math.round(total / filtered.length)) : '—'}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Reference No.</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-[11px] text-ustpBlue">{t.ref}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium">{t.student}</td>
                  <td className="px-5 py-3 text-gray-500">{t.type}</td>
                  <td className="px-5 py-3 text-right font-bold text-emerald-600">{fmt(t.amount)}</td>
                  <td className="px-5 py-3 text-gray-500">{t.method}</td>
                  <td className="px-5 py-3 text-gray-500">{t.date}</td>
                  <td className="px-5 py-3 text-gray-400">{t.time}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-300 text-sm">No transactions match your filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
