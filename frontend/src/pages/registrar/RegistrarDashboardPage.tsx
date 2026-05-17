/**
 * RegistrarDashboardPage.tsx  ─  BACKEND ALIGNED
 * Drop into: frontend/src/pages/registrar/RegistrarDashboardPage.tsx
 */

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';
import StatCard from '../../components/ui/StatCard';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_status: string;
  section: number | null;
}

// 1. 🟢 UPDATED INTERFACE TO EXPECT 'name' FROM DJANGO
interface Section {
  id: number;
  name: string; // Aligned with your Django model field
  nm?: string;  // Fallback support
}

export default function RegistrarDashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from Django on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, sectionsRes] = await Promise.all([
        api.get<Student[]>('students/'),
        api.get<Section[]>('sections/')
      ]);
      setStudents(studentsRes.data);
      setSections(sectionsRes.data);
    } catch (error) {
      console.error("Error fetching registrar data:", error);
    } finally {
      setLoading(false);
    }
  };

  // The function to push a student to the Cashier
  const assessStudent = async (studentId: number, sectionId: number | null) => {
    if (!sectionId) {
      alert("Please assign the student to a section first (via Student Records) before approving!");
      return;
    }
    try {
      await api.patch(`students/${studentId}/`, { enrollment_status: 'ASSESSED' });
      alert("Student officially assessed. Sent to Cashier.");
      fetchData(); // Refresh the queue
    } catch (error) {
      console.error("Failed to assess", error);
      alert("Failed to update student status.");
    }
  };

  // Filter lists based on real database status
  const pendingStudents = students.filter(s => s.enrollment_status === 'ADVISING');
  const enrolledStudents = students.filter(s => s.enrollment_status === 'ENROLLED');

  if (loading) return <div className="p-10 text-center text-gray-400 font-medium animate-pulse">Loading Registrar Terminal...</div>;

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

      {/* Live Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Enrollments"
          value={pendingStudents.length.toString()}
          icon="doc"
          sub="Awaiting approval"
          iconColor="text-orange-500"
          iconBg="bg-orange-50"
          trend={pendingStudents.length > 0 ? "down" : "neutral"}
          trendLabel={pendingStudents.length > 0 ? "Review needed" : "All cleared"}
        />
        <StatCard
          label="Total Students"
          value={students.length.toString()}
          icon="users"
          sub="Registered in system"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Active Sections"
          value={sections.length.toString()}
          icon="grid"
          sub="Across all programs"
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          label="Officially Enrolled"
          value={enrolledStudents.length.toString()}
          icon="check"
          sub="Cleared by Cashier"
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Live Approval Queue */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-ustpDarkBlue">Approval Queue (Needs Assessment)</h3>
          <span className="text-[11px] bg-orange-50 text-orange-500 px-2.5 py-1 rounded-full font-semibold">
            {pendingStudents.length} pending
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Student ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Section Assigned</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingStudents.map((s) => {
                const currentSec = sections.find(sec => sec.id === s.section);
                return (
                  <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-[12px] text-ustpBlue">{s.id}</td>
                    <td className="px-5 py-3 text-gray-700 font-medium">{s.last_name}, {s.first_name}</td>
                    <td className="px-5 py-3 text-gray-500">
                        {currentSec ? (
                            /* 2. 🟢 FIXED REFERENCE TO READ 'name' PROPERLY WITH FALLBACKS */
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                              {currentSec.name || currentSec.nm || `Section #${currentSec.id}`}
                            </span>
                        ) : (
                            <span className="text-red-500 italic text-xs">Unassigned</span>
                        )}
                    </td>
                    <td className="px-5 py-3 text-gray-400">{s.email}</td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => assessStudent(s.id, s.section)}
                            className="text-[11px] bg-emerald-500 text-white px-3 py-1 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
                        >
                          ✓ Assess
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pendingStudents.length === 0 && (
                  <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-gray-400 italic">
                          No students waiting for assessment!
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}