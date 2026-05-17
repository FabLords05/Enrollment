import React, { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';
import Modal from '../ui/Modal';

interface Instructor {
    id: number | null;
    nm: string;
    email: string;
    dept: string;
    spec: string;
}

export default function InstructorsManager() {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<Partial<Instructor>>({});

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const response = await api.get('instructors/');
            setInstructors(response.data);
        } catch (err) {
            console.error("Failed to query instructors payload", err);
        }
    };

    const handleSave = async () => {
        if (!form.nm || !form.email) return;
        try {
            if (form.id) {
                await api.put(`instructors/${form.id}/`, form);
            } else {
                await api.post('instructors/', form);
            }
            setModalOpen(false);
            fetchInstructors();
        } catch (err) {
            console.error("Error running server mutation on profile roster", err);
        }
    };

    return (
        <>
            {modalOpen && (
                <Modal title={form.id ? "Edit Instructor Details" : "Register New Faculty"} onClose={() => setModalOpen(false)} footer={
                    <>
                        <button className="px-4 py-2 border rounded-md" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="px-4 py-2 bg-ustp-blue text-white rounded-md" onClick={handleSave}>Save Record</button>
                    </>
                }>
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1">FACULTY FULL NAME *</label>
                        <input className="w-full border p-2 rounded-md" placeholder="e.g. Prof. Jane Doe" value={form.nm || ''} onChange={e => setForm({...form, nm: e.target.value})}/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1">EMAIL ADDRESS *</label>
                        <input className="w-full border p-2 rounded-md" type="email" placeholder="username@ustp.edu" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">COLLEGE / DEPARTMENT</label>
                            <input className="w-full border p-2 rounded-md" placeholder="e.g. CCS" value={form.dept || ''} onChange={e => setForm({...form, dept: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">CORE SPECIALIZATION</label>
                            <input className="w-full border p-2 rounded-md" placeholder="e.g. Data Analytics" value={form.spec || ''} onChange={e => setForm({...form, spec: e.target.value})}/>
                        </div>
                    </div>
                </Modal>
            )}

            <div className="flex justify-end mb-6">
                <button className="flex items-center gap-2 bg-ustp-blue text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm" onClick={() => { setForm({}); setModalOpen(true); }}>
                    <Icon n="plus" s={14}/> Add Faculty
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructors.map(inst => {
                    const initials = inst.nm.replace("Prof. ", "").split(' ').map(n => n[0]).join('').toUpperCase();
                    return (
                        <div key={inst.id} className="bg-white border border-g200 rounded-xl p-5 shadow-sm relative flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex gap-4 items-start mb-3">
                                    <Avatar init={initials || 'FI'} size={44}/>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-gray-800 truncate text-base">{inst.nm}</h4>
                                        <p className="text-xs text-gray-400 truncate">{inst.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mb-4">
                                    {inst.dept && <span className="px-2 py-0.5 bg-ustp-blue-light text-ustp-blue rounded text-xs font-bold uppercase">{inst.dept}</span>}
                                    {inst.spec && <span className="px-2 py-0.5 bg-g100 text-gray-600 rounded text-xs font-bold">{inst.spec}</span>}
                                </div>
                            </div>
                            <div className="pt-3 border-t border-g100 flex gap-2">
                                <button className="flex-1 py-1.5 border text-gray-700 text-xs font-medium rounded-md hover:bg-g50 transition flex items-center justify-center gap-1" onClick={() => { setForm(inst); setModalOpen(true); }}>
                                    <Icon n="edit" s={12}/> Modify
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}