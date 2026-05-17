import React, { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';

// Match these to your Django models
interface Subject {
  id: number;
  nm: string;
  secId: number;
  units: number;
  days: string;
  st: string;
  et: string;
  instId: number | null;
  room: string;
}

interface Instructor {
  id: number;
  nm: string;
}

export default function StudentSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch both subjects and instructors simultaneously
      const [subRes, instRes] = await Promise.all([
        api.get('subjects/'), 
        api.get('instructors/')
      ]);
      
      // Note: If 'subjects/' returns the entire school's catalog, 
      // you may need to update your Django ViewSet to filter by the logged-in student's section,
      // or filter it here using: subRes.data.filter(s => s.secId === mySectionId)
      setSubjects(subRes.data);
      setInstructors(instRes.data);
    } catch (err) {
      console.error("Failed to fetch data from Django", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = subjects.filter(s =>
    s.nm.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnits = subjects.reduce((a, s) => a + s.units, 0);

  if (loading) {
    return <div className="p-10 text-center text-gray-400 font-medium animate-pulse">Loading schedule from database...</div>;
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ustpDarkBlue">My Enrolled Subjects</h3>
          <p className="text-[12px] text-gray-400">SY 2025–2026 · 1st Semester · {totalUnits} total units</p>
        </div>
        <input
          type="text"
          placeholder="Search subject…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-ustpBlue/30"
        />
      </div>

      {/* Subject cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s) => {
          // Find the instructor's real name based on the instId foreign key
          const instructorName = instructors.find(i => i.id === s.instId)?.nm || 'TBA';
          
          // Split "CS 101 - Introduction to Computing" into code and name for styling
          const nameParts = s.nm.split(' - ');
          const code = nameParts.length > 1 ? nameParts[0] : 'SUBJ';
          const title = nameParts.length > 1 ? nameParts[1] : s.nm;

          return (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="font-mono text-[12px] font-bold text-ustpBlue bg-blue-50 px-2 py-0.5 rounded inline-block">{code}</div>
                  <div className="text-[14px] font-bold text-gray-800 mt-1 leading-tight">{title}</div>
                </div>
                <span className="text-[11px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">Enrolled</span>
              </div>
              <div className="grid grid-cols-2 gap-y-1 text-[12px] text-gray-500">
                <span>👤 {instructorName}</span>
                <span>📚 {s.units} units</span>
                <span>📅 {s.days}</span>
                <span>🕐 {s.st} – {s.et}</span>
                <span>🏫 {s.room}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
          No subjects found in the database matching your criteria.
        </div>
      )}
    </div>
  );
}