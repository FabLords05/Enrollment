/**
 * CashierStudentSearchPage.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/pages/cashier/CashierStudentSearchPage.tsx
 */

import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';

const allStudents = [
  { id: '2023-00121', name: 'Maria Santos',    course: 'BSCS 2-A', balance: 11450, status: 'Unpaid'  },
  { id: '2023-00145', name: 'Jose Reyes',      course: 'BSEE 1-B', balance: 0,     status: 'Paid'    },
  { id: '2023-00089', name: 'Ana Cruz',        course: 'BSME 3-A', balance: 13200, status: 'Unpaid'  },
  { id: '2023-00200', name: 'Mark Tan',        course: 'BSCS 1-A', balance: 6750,  status: 'Partial' },
  { id: '2022-00311', name: 'Liza Flores',     course: 'BSBA 4-B', balance: 8400,  status: 'Unpaid'  },
  { id: '2022-00298', name: 'Carlo Mendez',    course: 'BSCE 2-A', balance: 0,     status: 'Paid'    },
  { id: '2024-00019', name: 'Rachel Go',       course: 'BSCS 1-C', balance: 12450, status: 'Unpaid'  },
  { id: '2021-00411', name: 'Daniel Ocampo',   course: 'BSIT 4-A', balance: 0,     status: 'Paid'    },
];

function fmt(n: number) { return n === 0 ? '—' : '₱' + n.toLocaleString(); }

export default function CashierStudentSearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All'|'Paid'|'Unpaid'|'Partial'>('All');

  const results = allStudents.filter(s => {
    const matchQ = s.name.toLowerCase().includes(query.toLowerCase()) || s.id.includes(query);
    const matchF = filter === 'All' || s.status === filter;
    return matchQ && matchF;
  });

  return (
    <div className="space-y-5">

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-[15px] font-bold text-ustpDarkBlue mb-3">Student Search</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <Icon name="search" size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by name or student ID…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ustpBlue/30"
            />
          </div>
          <div className="flex gap-1.5">
            {(['All','Paid','Unpaid','Partial'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors ${
                  filter === f
                    ? 'bg-ustpDarkBlue text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 text-[12px] text-gray-400">
          {results.length} result{results.length !== 1 && 's'} found
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Student ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Course/Section</th>
                <th className="px-5 py-3 text-right">Balance</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map(s => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-[12px] text-ustpBlue">{s.id}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium">{s.name}</td>
                  <td className="px-5 py-3 text-gray-500">{s.course}</td>
                  <td className={`px-5 py-3 text-right font-bold ${s.balance > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {fmt(s.balance)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                      s.status === 'Paid'    ? 'bg-emerald-50 text-emerald-600' :
                      s.status === 'Partial' ? 'bg-yellow-50 text-yellow-600'  :
                                               'bg-red-50 text-red-500'
                    }`}>{s.status}</span>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-300 text-sm">No students match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
