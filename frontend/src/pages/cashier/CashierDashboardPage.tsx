/**
 * CashierDashboardPage.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/pages/cashier/CashierDashboardPage.tsx
 */

import React from 'react';
import StatCard from '../../components/ui/StatCard';

const recentTx = [
  { ref: 'OR-20250617-011', student: 'Maria Santos',    amount: 8400,  type: 'Tuition',       time: '9:15 AM', status: 'Completed' },
  { ref: 'OR-20250617-010', student: 'Jose Reyes',      amount: 1500,  type: 'Miscellaneous', time: '8:52 AM', status: 'Completed' },
  { ref: 'OR-20250617-009', student: 'Ana Cruz',        amount: 12450, type: 'Full Payment',  time: '8:30 AM', status: 'Completed' },
  { ref: 'OR-20250617-008', student: 'Mark Tan',        amount: 3500,  type: 'Partial',       time: '8:10 AM', status: 'Completed' },
];

function fmt(n: number) { return '₱' + n.toLocaleString(); }

export default function CashierDashboardPage() {
  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-ustpDarkBlue to-ustpBlue rounded-xl p-6 text-white flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">Finance Office</div>
          <h2 className="text-xl font-extrabold">Cashier Dashboard 💵</h2>
          <p className="text-sm text-white/60 mt-1">Today · SY 2025–2026 · 1st Semester</p>
        </div>
        <div className="hidden sm:block text-6xl opacity-20">🏦</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Daily Collections"
          value="₱89,450"
          icon="doc"
          sub="17 transactions today"
          iconColor="text-green-600"
          iconBg="bg-green-50"
          trend="up"
          trendLabel="+12% vs yesterday"
        />
        <StatCard
          label="Pending Payments"
          value="43"
          icon="users"
          sub="Students with balance"
          iconColor="text-yellow-600"
          iconBg="bg-yellow-50"
        />
        <StatCard
          label="Completed Transactions"
          value="17"
          icon="check"
          sub="Since 8:00 AM"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          trend="up"
          trendLabel="On track"
        />
        <StatCard
          label="Active Payments"
          value="3"
          icon="grid"
          sub="Currently processing"
          iconColor="text-orange-500"
          iconBg="bg-orange-50"
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-ustpDarkBlue">Today's Transactions</h3>
          <span className="text-[11px] bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-semibold">Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((t, i) => (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-[11px] text-ustpBlue">{t.ref}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium">{t.student}</td>
                  <td className="px-5 py-3 text-gray-500">{t.type}</td>
                  <td className="px-5 py-3 text-right font-bold text-emerald-600">{fmt(t.amount)}</td>
                  <td className="px-5 py-3 text-gray-400">{t.time}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-[11px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
