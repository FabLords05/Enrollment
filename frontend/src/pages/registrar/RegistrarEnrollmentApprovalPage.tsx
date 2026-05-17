/**
 * RegistrarEnrollmentApprovalPage.tsx  ─  BACKEND CONNECTED
 * Drop into: frontend/src/pages/registrar/RegistrarEnrollmentApprovalPage.tsx
 */

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';

interface ChangeRequest {
  id: number;
  student: number;
  student_name: string; // From our backend SerializerMethodField
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function RegistrarEnrollmentApprovalPage() {
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [filter, setFilter] = useState<'all'|'pending'|'approved'|'rejected'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get<ChangeRequest[]>('requests/');
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: number, newStatus: 'approved' | 'rejected') => {
    try {
      await api.patch(`requests/${id}/`, { status: newStatus });
      fetchRequests(); // Refresh list after update
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update request.");
    }
  };

  const filtered = requests.filter(r => filter === 'all' || r.status === filter);

  if (loading) return <div className="p-10 text-center text-gray-400 font-medium animate-pulse">Loading Requests...</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-ustpDarkBlue">Change Requests / Approvals</h3>
          <p className="text-[12px] text-gray-400">
            {requests.filter(r => r.status === 'pending').length} pending · {requests.filter(r => r.status === 'approved').length} approved
          </p>
        </div>
        <div className="flex gap-1.5">
          {(['all','pending','approved','rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold capitalize transition-colors ${
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
                  <span className="font-mono text-[11px] text-ustpBlue bg-blue-50 px-2 py-0.5 rounded">REQ-{r.id}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                    r.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                    r.status === 'rejected' ? 'bg-red-50 text-red-500' :
                    'bg-orange-50 text-orange-500'
                  }`}>{r.status}</span>
                </div>
                <div className="text-[14px] font-bold text-gray-800">{r.student_name}</div>
                <div className="text-[12px] text-gray-500 mt-1 whitespace-pre-wrap">📝 {r.message}</div>
                <div className="text-[11px] text-gray-400 mt-2">Submitted: {new Date(r.created_at).toLocaleString()}</div>
              </div>
              {r.status === 'pending' && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => updateRequestStatus(r.id, 'approved')}
                    className="bg-emerald-500 text-white text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => updateRequestStatus(r.id, 'rejected')}
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