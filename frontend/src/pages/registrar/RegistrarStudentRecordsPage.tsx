/**
 * RegistrarStudentRecordsPage.tsx  ─  BACKEND ALIGNED
 * Drop into: frontend/src/pages/registrar/RegistrarStudentRecordsPage.tsx
 */

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  program_enrolled: string;
  year_level: number;
  enrollment_status: string;
  section: number | null;
}

// 1. 🟢 UPDATED INTERFACE TO EXPECT 'name' FROM DJANGO
interface Section {
  id: number;
  name: string; // Changed from nm to name to match Django model structure
  nm?: string;  // Temporary fallback during data migrations
}

export default function RegistrarStudentRecordsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);

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
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentSection = async (studentId: number, newSectionId: string) => {
    const sectionVal = newSectionId === "" ? null : Number(newSectionId);
    try {
      await api.patch(`students/${studentId}/`, { section: sectionVal });
      alert("Student section updated successfully.");
      fetchData(); // Refresh to show changes
    } catch (error) {
      console.error("Failed to update section", error);
      alert("Failed to update section.");
    }
  };

  const handleStudentRowClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleAssessStudent = async () => {
    if (!selectedStudent) return;
    setIsAssessing(true);
    try {
      await api.patch(`students/${selectedStudent.id}/`, { enrollment_status: 'ASSESSED' });
      alert("Student assessed successfully.");
      setIsModalOpen(false);
      setSelectedStudent(null);
      fetchData(); // Refresh to show changes
    } catch (error) {
      console.error("Failed to assess student", error);
      alert("Failed to assess student.");
    } finally {
      setIsAssessing(false);
    }
  };

  const getSectionName = (sectionId: number | null): string => {
    if (!sectionId) return "Unassigned";
    const section = sections.find(s => s.id === sectionId);
    return section ? (section.name || section.nm || `Section #${sectionId}`) : `Section #${sectionId}`;
  };

  const filtered = students.filter(s => {
    const searchString = `${s.first_name || ''} ${s.last_name || ''} ${s.email || ''}`.toLowerCase();
    return searchString.includes(query.toLowerCase());
  });

  if (loading) return <div className="p-10 text-center text-gray-400 font-medium animate-pulse">Loading Student Records...</div>;

  return (
    <>
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ustpDarkBlue">Student Masterlist</h3>
          <p className="text-[12px] text-gray-400">{filtered.length} total students in system</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <Icon name="search" size={14} />
            </div>
            <input
              type="text"
              placeholder="Search by name/email…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ustpBlue/30 w-56"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Program / Yr</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Assign Section</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr 
                  key={s.id} 
                  onClick={() => handleStudentRowClick(s)}
                  className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3 text-gray-700 font-medium">{s.last_name || 'N/A'}, {s.first_name || 'N/A'}</td>
                  <td className="px-5 py-3 text-gray-500">{s.email}</td>
                  <td className="px-5 py-3 text-gray-500">{s.program_enrolled || 'N/A'} (Yr {s.year_level})</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      s.enrollment_status === 'ENROLLED' ? 'bg-emerald-50 text-emerald-600' :
                      s.enrollment_status === 'ASSESSED' ? 'bg-purple-50 text-purple-600' :
                      'bg-yellow-50 text-yellow-600'
                    }`}>{s.enrollment_status}</span>
                  </td>
                  <td className="px-5 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={s.section || ""}
                      onChange={(e) => updateStudentSection(s.id, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ustpBlue/30 bg-white"
                    >
                      <option value="">Unassigned</option>
                      {sections.map(sec => (
                        <option key={sec.id} value={sec.id}>
                          {/* 2. 🟢 UPDATED VALUE EXTRACTION TO SECURE MULTIPLE PROPERTIES */}
                          {sec.name || sec.nm || `Section #${sec.id}`}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-300">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {isModalOpen && selectedStudent && (
      <Modal 
        title={`${selectedStudent.first_name} ${selectedStudent.last_name} - Details`}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedStudent(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleAssessStudent}
              disabled={isAssessing || selectedStudent.enrollment_status === 'ENROLLED'}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedStudent.enrollment_status === 'ENROLLED'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-ustpBlue text-white hover:bg-ustpBlue/90 disabled:opacity-50'
              }`}
            >
              {isAssessing ? 'Assessing...' : selectedStudent.enrollment_status === 'ENROLLED' ? 'Already Enrolled' : 'Assess Student'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Student ID</label>
            <p className="text-[15px] font-medium text-gray-700 mt-1">{selectedStudent.id}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
            <p className="text-[15px] font-medium text-gray-700 mt-1">{selectedStudent.first_name} {selectedStudent.last_name}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
            <p className="text-[15px] font-medium text-gray-700 mt-1">{selectedStudent.email}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Program / Course</label>
            <p className="text-[15px] font-medium text-gray-700 mt-1">{selectedStudent.program_enrolled || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Year Level</label>
            <p className="text-[15px] font-medium text-gray-700 mt-1">Year {selectedStudent.year_level}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Section</label>
            <p className="text-[15px] font-medium text-gray-700 mt-1">{getSectionName(selectedStudent.section)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Enrollment Status</label>
            <p className="text-[15px] font-medium mt-1">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                selectedStudent.enrollment_status === 'ENROLLED' ? 'bg-emerald-50 text-emerald-600' :
                selectedStudent.enrollment_status === 'ASSESSED' ? 'bg-purple-50 text-purple-600' :
                'bg-yellow-50 text-yellow-600'
              }`}>{selectedStudent.enrollment_status}</span>
            </p>
          </div>
        </div>
      </Modal>
    )}
    </>
  );
}