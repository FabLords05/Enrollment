/**
 * CashierTransactionsPage.tsx  ─  BACKEND CONNECTED
 * Drop into: frontend/src/pages/cashier/CashierTransactionsPage.tsx
 */

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';

interface Payment {
  id: number;
  reference_no: string;
  student_name: string;
  amount: string; // Decimals come as strings from Django
  method: string;
  date_paid: string;
}

export default function CashierTransactionsPage() {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get<Payment[]>('payments/');
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and calculate totals
  const filtered = transactions.filter(t => {
    if (!dateFilter) return true;
    const tDate = new Date(t.date_paid).toLocaleDateString();
    return tDate.includes(dateFilter);
  });
  
  const total = filtered.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const fmt = (n: number) => '₱' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading) return <div className="p-10 text-center text-gray-400 font-medium animate-pulse">Loading Transaction Logs...</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ustpDarkBlue">Transaction Log</h3>
          <p className="text-[12px] text-gray-400">All official receipts · {filtered.length} records</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter by date (e.g. 6/17/2025)"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ustpBlue/30"
          />
        </div>
      </div>

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
            {filtered.length ? fmt(total / filtered.length) : '—'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Reference No.</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const dateObj = new Date(t.date_paid);
                return (
                  <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-[11px] text-ustpBlue">{t.reference_no}</td>
                    <td className="px-5 py-3 text-gray-700 font-medium">{t.student_name}</td>
                    <td className="px-5 py-3 text-right font-bold text-emerald-600">{fmt(parseFloat(t.amount))}</td>
                    <td className="px-5 py-3 text-gray-500">{t.method}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {dateObj.toLocaleDateString()} <span className="text-gray-400 text-[11px]">{dateObj.toLocaleTimeString()}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-300 text-sm">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}