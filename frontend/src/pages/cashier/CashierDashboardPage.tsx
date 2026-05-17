/**
 * CashierDashboardPage.tsx  ─  BACKEND CONNECTED
 * Drop into: frontend/src/pages/cashier/CashierDashboardPage.tsx
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

interface Subject {
  id: number;
  secId: number;
  units: number;
}

export default function CashierDashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch real data from Django on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, subjectsRes] = await Promise.all([
        api.get<Student[]>('students/'),
        api.get<Subject[]>('subjects/')
      ]);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Error fetching cashier data:", error);
    } finally {
      setLoading(false);
    }
  };

  // The function to push the official payment to Django
  const processPayment = async (studentId: number) => {
    if (!window.confirm("Confirm payment received? This will officially enroll the student.")) return;
    
    try {
      // Update the student's status to ENROLLED
      await api.patch(`students/${studentId}/`, { enrollment_status: 'ENROLLED' });
      alert("Payment processed successfully!");
      fetchData(); // Refresh the list to remove them from the queue
    } catch (error) {
      console.error("Payment failed", error);
      alert("Failed to process payment.");
    }
  };

  // Helper to calculate exact balance based on section subjects
  const calculateBalance = (sectionId: number | null) => {
    if (!sectionId) return 0;
    const enrolledSubjects = subjects.filter(sub => sub.secId === sectionId);
    const units = enrolledSubjects.reduce((sum, sub) => sum + sub.units, 0);
    const tuition = units * 400; // ₱400 per unit
    const fixedFees = 1500 + 1200 + 350 + 500 + 500; // Misc, Lab, NSTP, Fund, Reg
    return tuition + fixedFees;
  };

  // Format currency
  const fmt = (n: number) => '₱' + n.toLocaleString();

  // Filter the live data
  const pendingStudents = students.filter(s => 
    s.enrollment_status === 'ASSESSED' && 
    `${s.first_name || ''} ${s.last_name || ''} ${s.email || ''}`.toLowerCase().includes(search.toLowerCase())
  );
  
  const enrolledCount = students.filter(s => s.enrollment_status === 'ENROLLED').length;

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium animate-pulse">Loading Cashier Terminal...</div>;

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-xl p-6 text-white flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">Finance Office</div>
          <h2 className="text-xl font-extrabold">Cashier Terminal 💵</h2>
          <p className="text-sm text-white/60 mt-1">Process student payments and finalize enrollments.</p>
        </div>
        <div className="hidden sm:block text-6xl opacity-20">🏦</div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Pending Payments"
          value={students.filter(s => s.enrollment_status === 'ASSESSED').length.toString()}
          icon="users"
          sub="Students awaiting clearance"
          iconColor="text-yellow-600"
          iconBg="bg-yellow-50"
        />
        <StatCard
          label="Officially Enrolled"
          value={enrolledCount.toString()}
          icon="check"
          sub="Payments cleared today"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Active Term"
          value="1st Sem"
          icon="grid"
          sub="SY 2025-2026"
          iconColor="text-orange-500"
          iconBg="bg-orange-50"
        />
      </div>

      {/* Live Pending Queue */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-ustpDarkBlue">Pending Payments Queue</h3>
          <input 
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-500/30" 
            placeholder="Search by name or email..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Email Address</th>
                <th className="px-5 py-3 text-right">Total Due</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingStudents.map(s => {
                const balance = calculateBalance(s.section);
                return (
                  <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{s.last_name || 'N/A'}, {s.first_name || 'N/A'}</td>
                    <td className="px-5 py-3 text-gray-500">{s.email}</td>
                    <td className="px-5 py-3 text-right font-bold text-red-600">{fmt(balance)}</td>
                    <td className="px-5 py-3 text-center">
                      <button 
                        onClick={() => processPayment(s.id)}
                        className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                      >
                        Receive Payment
                      </button>
                    </td>
                  </tr>
                );
              })}
              {pendingStudents.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-gray-400 italic">
                        No students are currently waiting for payment clearance.
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