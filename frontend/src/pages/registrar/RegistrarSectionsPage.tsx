/**
 * RegistrarSectionsPage.tsx  ─  BACKEND CONNECTED
 * Drop into: frontend/src/pages/registrar/RegistrarSectionsPage.tsx
 */

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';

interface Section {
  id: number;
  name: string; // or 'nm' depending on your Django model
  capacity?: number;
}

interface Student {
  id: number;
  section: number | null;
}

export default function RegistrarSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [secRes, stuRes] = await Promise.all([
        api.get<Section[]>('sections/'),
        api.get<Student[]>('students/')
      ]);
      setSections(secRes.data);
      setStudents(stuRes.data);
    } catch (error) {
      console.error("Error fetching sections data:", error);
    } finally {
      setLoading(false);
    }
  };

  // The Django 'name' field usually holds "BSCS 1-A", so we filter on that
  const filtered = sections.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-gray-400 font-medium animate-pulse">Loading Sections...</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ustpDarkBlue">Active Sections</h3>
          <p className="text-[12px] text-gray-400">{sections.length} total sections created</p>
        </div>
        <input
          type="text"
          placeholder="Search section (e.g. BSIT-1A)…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ustpBlue/30 w-full sm:w-52"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s) => {
          // Calculate enrolled students by counting how many students have this section ID
          const enrolledCount = students.filter(stu => stu.section === s.id).length;
          const capacity = s.capacity || 40; // Fallback to 40 if not set in DB
          const pct = Math.min(Math.round((enrolledCount / capacity) * 100), 100);
          
          const barColor = pct >= 95 ? 'bg-red-400' : pct >= 75 ? 'bg-yellow-400' : 'bg-emerald-400';
          
          return (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-[15px] text-ustpDarkBlue">{s.name}</div>
                  <div className="text-[12px] text-gray-400">Block Section</div>
                </div>
                <span className="text-[11px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-semibold">
                  Active
                </span>
              </div>
              <div className="text-[12px] text-gray-500 mb-3">ID: {s.id}</div>
              
              {/* Live Capacity bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Enrollment Fill</span>
                  <span className="font-bold text-gray-600">{enrolledCount} / {capacity}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-right text-[10px] text-gray-300">{pct}% full</div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-1 md:col-span-2 p-10 text-center text-gray-400 border border-dashed rounded-xl">
            No sections found. Create one in the Django Admin!
          </div>
        )}
      </div>
    </div>
  );
}