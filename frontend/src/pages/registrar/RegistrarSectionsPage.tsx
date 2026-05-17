/**
 * RegistrarSectionsPage.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/pages/registrar/RegistrarSectionsPage.tsx
 */

import React, { useState } from 'react';

const sections = [
  { code: 'BSCS 1-A', course: 'BS Computer Science',  year: 1, capacity: 40, enrolled: 38, adviser: 'Prof. Santos'  },
  { code: 'BSCS 1-B', course: 'BS Computer Science',  year: 1, capacity: 40, enrolled: 35, adviser: 'Prof. Reyes'   },
  { code: 'BSCS 1-C', course: 'BS Computer Science',  year: 1, capacity: 40, enrolled: 22, adviser: 'Prof. Cruz'    },
  { code: 'BSCS 2-A', course: 'BS Computer Science',  year: 2, capacity: 40, enrolled: 40, adviser: 'Prof. Tan'     },
  { code: 'BSEE 1-A', course: 'BS Electrical Eng.',   year: 1, capacity: 35, enrolled: 30, adviser: 'Prof. Lim'     },
  { code: 'BSME 1-A', course: 'BS Mechanical Eng.',   year: 1, capacity: 35, enrolled: 29, adviser: 'Prof. Garcia'  },
  { code: 'BSBA 1-B', course: 'BS Business Admin.',   year: 1, capacity: 45, enrolled: 43, adviser: 'Prof. Torres'  },
  { code: 'BSCE 2-A', course: 'BS Civil Engineering', year: 2, capacity: 35, enrolled: 34, adviser: 'Prof. Dela Cruz'},
];

export default function RegistrarSectionsPage() {
  const [search, setSearch] = useState('');
  const filtered = sections.filter(s =>
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ustpDarkBlue">Active Sections</h3>
          <p className="text-[12px] text-gray-400">{sections.length} sections · SY 2025–2026</p>
        </div>
        <input
          type="text"
          placeholder="Search section…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ustpBlue/30 w-full sm:w-52"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s, i) => {
          const pct = Math.round((s.enrolled / s.capacity) * 100);
          const barColor = pct >= 95 ? 'bg-red-400' : pct >= 75 ? 'bg-yellow-400' : 'bg-emerald-400';
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-[15px] text-ustpDarkBlue">{s.code}</div>
                  <div className="text-[12px] text-gray-400">{s.course}</div>
                </div>
                <span className="text-[11px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-semibold">
                  Year {s.year}
                </span>
              </div>
              <div className="text-[12px] text-gray-500 mb-3">👤 {s.adviser}</div>
              {/* Capacity bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Enrollment</span>
                  <span className="font-bold text-gray-600">{s.enrolled} / {s.capacity}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-right text-[10px] text-gray-300">{pct}% full</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
