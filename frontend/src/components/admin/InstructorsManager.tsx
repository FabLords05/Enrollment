import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api/axiosSetup';
import Icon from '../ui/Icon';
import Modal from '../ui/Modal';

// 1. Defined TypeScript model for Instructor
interface Instructor {
    id: number;
    nm: string;    // Full Name
    email: string;
    dept: string | null;
    spec: string | null;
}

export default function InstructorsManager() {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    // Initialized form properties cleanly to avoid uncontrolled component state alerts
    const [form, setForm] = useState({
        id: null as number | null,
        nm: '',
        email: '',
        dept: '',
        spec: ''
    });

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const response = await api.get('instructors/');
            setInstructors(response.data);
        } catch (err) {
            console.error("Failed to fetch instructors list", err);
        }
    };

    const openNew = () => {
        setForm({ id: null, nm: '', email: '', dept: '', spec: '' });
        setModalOpen(true);
    };

    const openEdit = (instructor: Instructor) => {
        setForm({
            id: instructor.id,
            nm: instructor.nm,
            email: instructor.email,
            dept: instructor.dept || '',
            spec: instructor.spec || ''
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.nm || !form.email) {
            alert("Instructor Name and Email are required fields.");
            return;
        }

        try {
            const payload = {
                nm: form.nm,
                email: form.email,
                dept: form.dept === '' ? null : form.dept,
                spec: form.spec === '' ? null : form.spec
            };

            if (form.id) {
                // Using partial PATCH mutations for smooth database writes
                await api.patch(`instructors/${form.id}/`, payload);
            } else {
                await api.post('instructors/', payload);
            }
            
            setModalOpen(false);
            fetchInstructors();
        } catch (error) {
            console.error("Error saving instructor record", error);
            if (axios.isAxiosError(error) && error.response) {
                console.error("Django engine validation payload:", error.response.data);
                alert(`Backend Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Failed to update instructor record.");
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`instructors/${id}/`);
            setConfirmDeleteId(null);
            fetchInstructors();
        } catch (err) {
            console.error("Error deleting instructor record", err);
        }
    };

    const filteredInstructors = instructors.filter(i => 
        `${i.nm || ''} ${i.email || ''} ${i.dept || ''}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {/* Delete Confirmation Modal */}
            {confirmDeleteId && (
                <Modal title="Confirm Deletion" onClose={() => setConfirmDeleteId(null)} footer={
                    <>
                        <button className="px-4 py-2 border rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50 transition" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition" onClick={() => handleDelete(confirmDeleteId)}>Delete</button>
                    </>
                }>
                    <p className="text-gray-600 text-sm">Permanently remove this instructor from the registry? This layout step is final.</p>
                </Modal>
            )}

            {/* Main Form Modal */}
            {modalOpen && (
                <Modal title={form.id ? 'Modify Instructor Profile' : 'Register Instructor'} onClose={() => setModalOpen(false)} footer={
                    <>
                        <button className="px-4 py-2 border rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50 transition" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="px-4 py-2 bg-ustpBlue text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition" onClick={handleSave}>Save Profile</button>
                    </>
                }>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">FULL NAME</label>
                            <input className="w-full border p-2 rounded-md text-sm outline-none focus:border-ustpBlue" value={form.nm} onChange={e => setForm({...form, nm: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">EMAIL ADDRESS</label>
                            <input className="w-full border p-2 rounded-md text-sm outline-none focus:border-ustpBlue" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">DEPARTMENT</label>
                                <input className="w-full border p-2 rounded-md text-sm outline-none focus:border-ustpBlue" placeholder="e.g. CITC" value={form.dept} onChange={e => setForm({...form, dept: e.target.value})}/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">SPECIALIZATION</label>
                                <input className="w-full border p-2 rounded-md text-sm outline-none focus:border-ustpBlue" placeholder="e.g. Data Science" value={form.spec} onChange={e => setForm({...form, spec: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Action Header Panel */}
            <div className="flex gap-4 mb-4 items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                        {/* Fixed Icon explicit prop names assignment */}
                        <Icon name="search" size={14}/>
                    </span>
                    <input className="w-full pl-9 pr-4 py-2 border rounded-md bg-white text-sm outline-none focus:border-ustpBlue" placeholder="Search instructors..." value={search} onChange={e => setSearch(e.target.value)}/>
                </div>
                <button className="flex items-center gap-2 bg-ustpBlue text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition" onClick={openNew}>
                    {/* Fixed Icon explicit prop names assignment */}
                    <Icon name="plus" size={14}/> Add Instructor
                </button>
            </div>

            {/* Registry Presentation Table */}
            <div className="bg-white rounded-xl shadow-sm border border-g200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-g50 text-gray-500 text-xs font-bold border-b border-g200">
                            <th className="p-4">INSTRUCTOR</th>
                            <th className="p-4">EMAIL</th>
                            <th className="p-4">DEPARTMENT</th>
                            <th className="p-4">SPECIALIZATION</th>
                            <th className="p-4 text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInstructors.map(i => (
                            <tr key={i.id} className="border-b border-g100 hover:bg-g50 transition text-sm">
                                <td className="p-4 font-semibold text-gray-800">{i.nm}</td>
                                <td className="p-4 text-gray-600">{i.email}</td>
                                <td className="p-4">
                                    {i.dept ? <span className="px-2 py-1 bg-g100 text-gray-700 rounded text-xs font-bold">{i.dept}</span> : <span className="text-gray-400 italic">None</span>}
                                </td>
                                <td className="p-4 text-gray-600">{i.spec || '—'}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button className="p-1 border rounded hover:bg-g100 text-gray-600" onClick={() => openEdit(i)}>
                                        {/* Fixed Icon explicit prop names assignment */}
                                        <Icon name="edit" size={14}/>
                                    </button>
                                    <button className="p-1 border rounded hover:bg-red-50 text-red-600 border-red-200" onClick={() => setConfirmDeleteId(i.id)}>
                                        {/* Fixed Icon explicit prop names assignment */}
                                        <Icon name="trash" size={14}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}