import { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';

// Note: Adjust these fields based on what your Django Serializer returns
interface ChangeRequest {
    id: number;
    student_id: number;
    student_name: string;
    message: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export default function RequestsManager() {
    const [requests, setRequests] = useState<ChangeRequest[]>([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            // Assuming you have a Django endpoint for change requests
            const response = await api.get('requests/');
            setRequests(response.data);
        } catch (error) {
            console.error("Failed to fetch change requests:", error);
            
            // Temporary Mock Data just so you can see the UI while backend is being built
            if (requests.length === 0) {
                setRequests([
                    { id: 1, student_id: 101, student_name: "Juan Dela Cruz", message: "Please update my middle name. My phone number should be 09171234567.", status: 'pending', created_at: "May 17, 2026" },
                    { id: 2, student_id: 102, student_name: "Maria Santos", message: "Requesting correction on my birthdate from 2004 to 2003.", status: 'approved', created_at: "May 15, 2026" }
                ]);
            }
        }
    };

    const handleAction = async (id: number, newStatus: 'approved' | 'rejected') => {
        try {
            // Update the status in your Django database
            await api.put(`requests/${id}/`, { status: newStatus });
            
            // Update local UI state
            setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
        } catch (error) {
            console.error(`Failed to mark request as ${newStatus}:`, error);
            // Fallback for mock UI testing
            setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
        }
    };

    const pending = requests.filter(r => r.status === 'pending');
    const past = requests.filter(r => r.status !== 'pending').slice().reverse();

    return (
        <div className="max-w-5xl">
            {pending.length === 0 && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-start gap-3 mb-6">
                    <Icon name="check" size={18} className="mt-0.5" />
                    <span>No pending change requests at this time. You're all caught up!</span>
                </div>
            )}

            {pending.length > 0 && (
                <>
                    <div className="font-bold text-ustpDarkBlue mb-3 text-lg">Pending Requests ({pending.length})</div>
                    <div className="bg-white rounded-xl shadow-sm border border-g200 p-2 mb-8">
                        {pending.map(req => {
                            const initials = req.student_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                            
                            return (
                                <div key={req.id} className="p-4 border-b border-g100 last:border-0 flex gap-4 items-start">
                                    <Avatar init={initials} size={40} />
                                    
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-gray-900">{req.student_name}</div>
                                        <div className="text-sm text-gray-600 mt-1 leading-relaxed">{req.message}</div>
                                        <div className="text-xs text-gray-400 mt-2">{req.created_at}</div>
                                    </div>
                                    
                                    <div className="flex gap-2 shrink-0">
                                        <button 
                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition text-xs font-bold"
                                            onClick={() => handleAction(req.id, 'approved')}
                                        >
                                            <Icon name="check" size={12} /> Approve
                                        </button>
                                        <button 
                                            className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 transition text-xs font-bold"
                                            onClick={() => handleAction(req.id, 'rejected')}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {past.length > 0 && (
                <>
                    <div className="font-bold text-gray-600 mb-3 text-sm">Past Requests ({past.length})</div>
                    <div className="bg-white rounded-xl shadow-sm border border-g200 p-2">
                        {past.map(req => (
                            <div key={req.id} className="p-3 border-b border-g100 last:border-0 flex gap-3 items-center">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                    req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {req.status}
                                </span>
                                
                                <div className="flex-1 flex items-center">
                                    <span className="font-semibold text-sm text-gray-800 w-40 truncate">{req.student_name}</span>
                                    <span className="text-sm text-gray-500 ml-2 truncate max-w-lg">{req.message}</span>
                                </div>
                                
                                <span className="text-xs text-gray-400 whitespace-nowrap">{req.created_at}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}