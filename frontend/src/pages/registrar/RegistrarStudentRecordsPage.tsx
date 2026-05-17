/**
 * RegistrarStudentRecordsPage.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/pages/registrar/RegistrarStudentRecordsPage.tsx
 */

import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';

const students = [
  { id: '2023-00121', name: 'Maria Santos',   course: 'BSCS', year: 2, section: 'A', status: 'Regular',   gwa: '1.75' },
  { id: '2023-00145', name: 'Jose Reyes',     course: 'BSEE', year: 1, section: 'B', status: 'Regular',   gwa: '2.00' },
  { id: '2023-00089', name: 'Ana Cruz',       course: 'BSME', year: 3, section: 'A', status: 'Irregular', gwa: '2.25' },
  { id: '2023-00200', name: 'Mark Tan',       course: 'BSCS', year: 1, section: 'A', status: 'Regular',   gwa: '1.50' },
  { id: '2022-00311', name: 'Liza Flores',    course: 'BSBA', year: 4, section: 'B', status: 'Irregular', gwa: '2.50' },
  { id: '2022-00298', name: 'Carlo Mendez',   course: 'BSCE', year: 2, section: 'A', status: 'Regular',   gwa: '1.75' },
  { id: '2024-00019', name: 'Rachel Go',      course: 'BSCS', year: 1, section: 'C', status: 'Regular',   gwa: '—'    },
  { id: '2021-00411', name: 'Daniel Ocampo',  course: 'BSIT', year: 4, section: 'A', status: 'Regular',   gwa: '1.90' },
];

export default function RegistrarStudentRecordsPage() {
  const [query, setQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');

  const courses = ['All', ...Array.from(new Set(students.map(s => s.course)))];
  const filtered = students.filter(s => {
    const matchQ = s.name.toLowerCase().includes(query.toLowerCase()) || s.id.includes(query);
    const matchC = courseFilter === 'All' || s.course === courseFilter;
    return matchQ && matchC;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ustpDarkBlue">Student Records</h3>
          <p className="text-[12px] text-gray-400">{filtered.length} of {students.length} students</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <Icon name="search" size={14} />
            </div>
            <input
              type="text"
              placeholder="Search…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ustpBlue/30 w-44"
            />
          </div>
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ustpBlue/30"
          >
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Year</th>
                <th className="px-5 py-3">Section</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">GWA</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-[12px] text-ustpBlue">{s.id}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium">{s.name}</td>
                  <td className="px-5 py-3 text-gray-500">{s.course}</td>
                  <td className="px-5 py-3 text-gray-500">{s.year}</td>
                  <td className="px-5 py-3 text-gray-500">{s.section}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      s.status === 'Regular' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3 text-center font-bold text-gray-600">{s.gwa}</td>
                  <td className="px-5 py-3 text-center">
                    <button className="text-[11px] bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-300">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
