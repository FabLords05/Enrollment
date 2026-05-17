/**
 * RegistrarEnrollmentApprovalPage.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/pages/registrar/RegistrarEnrollmentApprovalPage.tsx
 */

import React, { useState } from 'react';

interface Request {
  id: string;
  studentId: string;
  name: string;
  course: string;
  section: string;
  type: 'New Enrollment' | 'Add/Drop' | 'Shifting';
  submitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes: string;
}

const initial: Request[] = [
  { id: 'REQ-001', studentId: '2024-00019', name: 'Rachel Go',    course: 'BSCS', section: '1-C', type: 'New Enrollment', submitted: 'Jun 17, 9:00 AM',  status: 'Pending',  notes: 'Complete requirements submitted.' },
  { id: 'REQ-002', studentId: '2024-00031', name: 'Ben Uy',       course: 'BSEE', section: '1-A', type: 'New Enrollment', submitted: 'Jun 17, 8:15 AM',  status: 'Pending',  notes: 'Awaiting medical clearance.' },
  { id: 'REQ-003', studentId: '2024-00044', name: 'Claire Tan',   course: 'BSBA', section: '1-B', type: 'Shifting',       submitted: 'Jun 16, 3:00 PM',  status: 'Pending',  notes: 'Shifting from BSCS.' },
  { id: 'REQ-004', studentId: '2024-00055', name: 'Edward Go',    course: 'BSME', section: '1-A', type: 'Add/Drop',       submitted: 'Jun 16, 1:00 PM',  status: 'Pending',  notes: 'Dropping CS 102, Adding ME 101.' },
  { id: 'REQ-005', studentId: '2023-00121', name: 'Maria Santos', course: 'BSCS', section: '2-A', type: 'Add/Drop',       submitted: 'Jun 15, 10:00 AM', status: 'Approved', notes: 'Approved by registrar.' },
  { id: 'REQ-006', studentId: '2023-00145', name: 'Jose Reyes',   course: 'BSEE', section: '1-B', type: 'New Enrollment', submitted: 'Jun 15, 9:00 AM',  status: 'Rejected', notes: 'Missing Form 137.' },
];

export default function RegistrarEnrollmentApprovalPage() {
  const [requests, setRequests] = useState<Request[]>(initial);
  const [filter, setFilter]     = useState<'All'|'Pending'|'Approved'|'Rejected'>('All');

  const filtered = requests.filter(r => filter === 'All' || r.status === filter);

  const update = (id: string, status: 'Approved' | 'Rejected') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="space-y-5">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ustpDarkBlue">Enrollment Approval</h3>
          <p className="text-[12px] text-gray-400">
            {requests.filter(r => r.status === 'Pending').length} pending · {requests.filter(r => r.status === 'Approved').length} approved · {requests.filter(r => r.status === 'Rejected').length} rejected
          </p>
        </div>
        <div className="flex gap-1.5">
          {(['All','Pending','Approved','Rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                filter === f ? 'bg-ustpDarkBlue text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-[11px] text-ustpBlue bg-blue-50 px-2 py-0.5 rounded">{r.id}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    r.type === 'New Enrollment' ? 'bg-blue-50 text-blue-600' :
                    r.type === 'Add/Drop'       ? 'bg-purple-50 text-purple-600' :
                                                  'bg-orange-50 text-orange-500'
                  }`}>{r.type}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    r.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                    r.status === 'Rejected' ? 'bg-red-50 text-red-500' :
                                              'bg-yellow-50 text-yellow-600'
                  }`}>{r.status}</span>
                </div>
                <div className="text-[14px] font-bold text-gray-800">{r.name}</div>
                <div className="text-[12px] text-gray-400">{r.studentId} · {r.course} {r.section}</div>
                <div className="text-[12px] text-gray-500 mt-1">📝 {r.notes}</div>
                <div className="text-[11px] text-gray-300 mt-0.5">Submitted: {r.submitted}</div>
              </div>
              {r.status === 'Pending' && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => update(r.id, 'Approved')}
                    className="bg-emerald-500 text-white text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => update(r.id, 'Rejected')}
                    className="bg-red-50 text-red-500 text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-300">
            No requests match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
