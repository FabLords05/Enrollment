/**
 * RegistrarSectionsPage.tsx  ─  BACKEND CONNECTED
 * Drop into: frontend/src/pages/registrar/RegistrarSectionsPage.tsx
 */

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';
import Modal from '../../components/ui/Modal';

interface Section {
  id: number;
  name: string; // or 'nm' depending on your Django model
  capacity?: number;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_status: string;
  section: number | null;
}

export default function RegistrarSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSectionCardClick = (section: Section) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  // The Django 'name' field usually holds "BSCS 1-A", so we filter on that
  const filtered = sections.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-gray-400 font-medium animate-pulse">Loading Sections...</div>;

  return (
    <>
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
            <div 
              key={s.id} 
              onClick={() => handleSectionCardClick(s)}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all"
            >
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

      {isModalOpen && selectedSection && (
        <>
        {(() => {
          const enrolledCount = students.filter(stu => stu.section === selectedSection.id).length;
          const capacity = selectedSection.capacity || 40;
          const pct = Math.min(Math.round((enrolledCount / capacity) * 100), 100);
          
          return (
            <Modal 
              title={`${selectedSection.name} - Details`}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedSection(null);
              }}
              footer={
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedSection(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              }
            >
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Section ID</label>
                  <p className="text-[15px] font-medium text-gray-700 mt-1">{selectedSection.id}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Section Name</label>
                  <p className="text-[15px] font-medium text-gray-700 mt-1">{selectedSection.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Capacity</label>
                  <p className="text-[15px] font-medium text-gray-700 mt-1">{capacity} students</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Enrollment</label>
                  <p className="text-[15px] font-medium text-gray-700 mt-1">{enrolledCount} students enrolled</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Enrollment Fill Rate</label>
                  <div className="mt-2">
                    <div className="flex justify-between text-[12px] text-gray-600 mb-1">
                      <span>Fill Rate</span>
                      <span className="font-bold">{pct}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          pct >= 95 ? 'bg-red-400' : pct >= 75 ? 'bg-yellow-400' : 'bg-emerald-400'
                        }`} 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Enrolled Students Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Enrolled Students ({enrolledCount})
                  </h4>
                  
                  {(() => {
                    const enrolledStudents = students.filter(s => s.section === selectedSection.id);
                    
                    if (enrolledStudents.length === 0) {
                      return (
                        <div className="p-6 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
                          <p className="text-sm text-gray-400 font-medium">
                            No students are currently assigned to this section.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-200">
                              <th className="px-4 py-2">Name</th>
                              <th className="px-4 py-2">Email</th>
                              <th className="px-4 py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {enrolledStudents.map((student) => (
                              <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-2 text-gray-700 font-medium">
                                  {student.last_name}, {student.first_name}
                                </td>
                                <td className="px-4 py-2 text-gray-500 text-[13px]">{student.email}</td>
                                <td className="px-4 py-2">
                                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                                    student.enrollment_status === 'ENROLLED' ? 'bg-emerald-50 text-emerald-600' :
                                    student.enrollment_status === 'ASSESSED' ? 'bg-purple-50 text-purple-600' :
                                    'bg-yellow-50 text-yellow-600'
                                  }`}>
                                    {student.enrollment_status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </Modal>
          );
        })()}
        </>
      )}
    </div>
    </>
  );
}