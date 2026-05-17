/**
 * RegistrarReportsPage.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/pages/registrar/RegistrarReportsPage.tsx
 */

import React from 'react';

const reports = [
  { title: 'Enrollment Summary Report',   desc: 'Total enrolled per course, year level, and section.',   icon: '📊', tag: 'Enrollment' },
  { title: 'Student Masterlist',          desc: 'Complete list of all enrolled students with details.',   icon: '📋', tag: 'Records'    },
  { title: 'Section Load Report',         desc: 'Instructor teaching load per section and subject.',      icon: '📚', tag: 'Academic'   },
  { title: 'Pending Approvals Report',    desc: 'All unprocessed enrollment and change requests.',        icon: '⏳', tag: 'Approval'   },
  { title: 'GWA Distribution Report',    desc: 'Grade-weighted average distribution across programs.',   icon: '📈', tag: 'Academic'   },
  { title: 'Irregular Students Report',  desc: 'List of students with irregular enrollment status.',     icon: '⚠️', tag: 'Status'     },
];

export default function RegistrarReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-[15px] font-bold text-ustpDarkBlue">Reports</h3>
        <p className="text-[12px] text-gray-400">Generate and export registrar reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="text-3xl w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl shrink-0">
              {r.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="text-[14px] font-bold text-gray-800">{r.title}</div>
                <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  {r.tag}
                </span>
              </div>
              <div className="text-[12px] text-gray-500 mb-3">{r.desc}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Generating: ${r.title}`)}
                  className="text-[11px] bg-ustpDarkBlue text-white px-3 py-1.5 rounded-lg hover:bg-ustpBlue transition-colors font-semibold"
                >
                  Generate
                </button>
                <button
                  onClick={() => alert(`Exporting: ${r.title}`)}
                  className="text-[11px] bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
