/**
 * RegistrarDashboardPage.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/pages/registrar/RegistrarDashboardPage.tsx
 */

import React from 'react';
import StatCard from '../../components/ui/StatCard';

const queue = [
  { id: '2024-00019', name: 'Rachel Go',      course: 'BSCS 1-C', submitted: '2 hrs ago', status: 'Pending' },
  { id: '2024-00031', name: 'Ben Uy',         course: 'BSEE 1-A', submitted: '3 hrs ago', status: 'Pending' },
  { id: '2024-00044', name: 'Claire Tan',     course: 'BSBA 1-B', submitted: '5 hrs ago', status: 'Pending' },
  { id: '2024-00055', name: 'Edward Go',      course: 'BSME 1-A', submitted: '6 hrs ago', status: 'Pending' },
];

export default function RegistrarDashboardPage() {
  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-ustpDarkBlue to-purple-800 rounded-xl p-6 text-white flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">Registrar Office</div>
          <h2 className="text-xl font-extrabold">Registrar Dashboard 📋</h2>
          <p className="text-sm text-white/60 mt-1">SY 2025–2026 · 1st Semester</p>
        </div>
        <div className="hidden sm:block text-6xl opacity-20">🏛️</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Enrollments"
          value="4"
          icon="doc"
          sub="Awaiting approval"
          iconColor="text-orange-500"
          iconBg="bg-orange-50"
          trend="down"
          trendLabel="Review needed"
        />
        <StatCard
          label="Total Students"
          value="1,284"
          icon="users"
          sub="Currently enrolled"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          trend="up"
          trendLabel="+47 this semester"
        />
        <StatCard
          label="Active Sections"
          value="38"
          icon="grid"
          sub="Across all programs"
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          label="Approval Queue"
          value="4"
          icon="check"
          sub="Pending action"
          iconColor="text-red-500"
          iconBg="bg-red-50"
          trend="down"
          trendLabel="Needs attention"
        />
      </div>

      {/* Approval queue preview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-ustpDarkBlue">Approval Queue</h3>
          <span className="text-[11px] bg-orange-50 text-orange-500 px-2.5 py-1 rounded-full font-semibold">4 pending</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Student ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Course / Section</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((q, i) => (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-[12px] text-ustpBlue">{q.id}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium">{q.name}</td>
                  <td className="px-5 py-3 text-gray-500">{q.course}</td>
                  <td className="px-5 py-3 text-gray-400">{q.submitted}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-[11px] bg-emerald-500 text-white px-3 py-1 rounded-lg hover:bg-emerald-600 transition-colors font-semibold">
                        ✓ Approve
                      </button>
                      <button className="text-[11px] bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors font-semibold">
                        ✕ Reject
                      </button>
                    </div>
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
