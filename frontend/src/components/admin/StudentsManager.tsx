import React, { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';
import Modal from '../ui/Modal';

interface Student {
    id: number | null;
    email: string;
    first_name: string; // aligned with standard Django User fields
    last_name: string;
    middle_initial?: string;
    suffix?: string;
    birth_date?: string;
    address?: string;
    phone?: string;
    section?: number | null;
    app_completed: boolean;
}

interface Section {
    id: number;
    nm: string;
}

export default function StudentsManager() {
    const [students, setStudents] = useState<Student[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    // Form State
    const [form, setForm] = useState<Partial<Student>>({});
    const [password, setPassword] = useState(''); // Only for new accounts

    useEffect(() => {
        fetchStudents();
        fetchSections();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('students/');
            setStudents(response.data);
        } catch (err) {
            console.error("Failed to fetch students", err);
        }
    };

    const fetchSections = async () => {
        try {
            const response = await api.get('sections/');
            setSections(response.data);
        } catch (err) {
            console.error("Failed to fetch sections", err);
        }
    };

    const openNew = () => {
        setForm({ id: null, email: '', first_name: '', last_name: '', app_completed: false });
        setPassword('');
        setModalOpen(true);
    };

    const openEdit = (student: Student) => {
        setForm(student);
        setModalOpen(true);
    };

    const saveStudent = async () => {
        if (!form.first_name || !form.last_name || !form.email) return;
        try {
            if (form.id) {
                await api.put(`students/${form.id}/`, form);
            } else {
                await api.post('students/', { ...form, password: password || 'student123' });
            }
            setModalOpen(false);
            fetchStudents();
        } catch (err) {
            console.error("Error saving student", err);
        }
    };

    const deleteStudent = async (id: number) => {
        try {
            await api.delete(`students/${id}/`);
            setConfirmDeleteId(null);
            fetchStudents();
        } catch (err) {
            console.error("Error deleting student", err);
        }
    };

    const filteredStudents = students.filter(s => 
        `${s.first_name || ''} ${s.last_name || ''} ${s.email || ''}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {/* Delete Confirmation Modal */}
            {confirmDeleteId && (
                <Modal title="Confirm Deletion" onClose={() => setConfirmDeleteId(null)} footer={
                    <>
                        <button className="px-4 py-2 border rounded-md" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-md" onClick={() => deleteStudent(confirmDeleteId)}>Delete</button>
                    </>
                }>
                    <p className="text-gray-600">Permanently delete this student record? This action cannot be reversed.</p>
                </Modal>
            )}

            {/* Main Form Modal */}
            {modalOpen && (
                <Modal title={form.id ? 'Edit Student' : 'Add New Student'} onClose={() => setModalOpen(false)} footer={
                    <>
                        <button className="px-4 py-2 border rounded-md" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="px-4 py-2 bg-ustp-blue text-white rounded-md" onClick={saveStudent}>Save</button>
                    </>
                }>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">FIRST NAME</label>
                            <input className="w-full border p-2 rounded-md" value={form.first_name || ''} onChange={e => setForm({...form, first_name: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">LAST NAME</label>
                            <input className="w-full border p-2 rounded-md" value={form.last_name || ''} onChange={e => setForm({...form, last_name: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">M.I.</label>
                            <input className="w-full border p-2 rounded-md" maxLength={1} value={form.middle_initial || ''} onChange={e => setForm({...form, middle_initial: e.target.value})}/>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1">EMAIL ADDRESS</label>
                        <input className="w-full border p-2 rounded-md" type="email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ASSIGNED SECTION</label>
                            <select className="w-full border p-2 rounded-md bg-white" value={form.section || ''} onChange={e => setForm({...form, section: e.target.value ? Number(e.target.value) : null})}>
                                <option value="">None</option>
                                {sections.map(sec => <option key={sec.id} value={sec.id}>{sec.nm}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ENROLLMENT STATUS</label>
                            <select className="w-full border p-2 rounded-md bg-white" value={form.app_completed ? '1' : '0'} onChange={e => setForm({...form, app_completed: e.target.value === '1'})}>
                                <option value="0">Pending Application</option>
                                <option value="1">Fully Enrolled</option>
                            </select>
                        </div>
                    </div>
                    {!form.id && (
                        <div className="mb-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">PASSWORD</label>
                            <input className="w-full border p-2 rounded-md" type="password" placeholder="Default Account Password" value={password} onChange={e => setPassword(e.target.value)}/>
                        </div>
                    )}
                </Modal>
            )}

            {/* Layout Wrapper Elements */}
            <div className="flex gap-4 mb-4 items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                    <span className="absolute left-3 top-3 text-gray-400"><Icon name="search" size={14}/></span>
                    <input className="w-full pl-9 pr-4 py-2 border rounded-md bg-white outline-none" placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)}/>
                </div>
                <button className="flex items-center gap-2 bg-ustp-blue text-white px-4 py-2 rounded-md font-medium" onClick={openNew}>
                    <Icon name="plus" size={14}/> Add Student
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-g200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-g50 text-gray-500 text-xs font-bold border-b border-g200">
                            <th className="p-4">STUDENT</th>
                            <th className="p-4">CONTACT</th>
                            <th className="p-4">SECTION</th>
                            <th className="p-4">STATUS</th>
                            <th className="p-4 text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(s => {
                            const currentSec = sections.find(x => x.id === s.section);
                            const initials = `${s.first_name?.[0] || ''}${s.last_name?.[0] || ''}` || '?';
                            
                            return (
                                <tr key={s.id} className="border-b border-g100 hover:bg-g50 transition">
                                    <td className="p-4 flex items-center gap-3">
                                        <Avatar init={initials} size={32}/>
                                        <div>
                                            <div className="font-semibold text-gray-800">{s.last_name || 'N/A'}, {s.first_name || 'N/A'}</div>
                                            <div className="text-xs text-gray-400">ID: {s.id}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{s.email}</td>
                                    <td className="p-4">
                                        {currentSec ? <span className="px-2 py-1 bg-ustp-blue-light text-ustp-blue rounded text-xs font-bold">{currentSec.nm}</span> : <span className="text-gray-400 text-xs">Unassigned</span>}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${s.app_completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {s.app_completed ? 'Enrolled' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button className="p-1 border rounded hover:bg-g100 text-gray-600" onClick={() => openEdit(s)}><Icon name="edit" size={14}/></button>
                                        <button className="p-1 border rounded hover:bg-red-50 text-red-600 border-red-200" onClick={() => setConfirmDeleteId(s.id!)}><Icon name="trash" size={14}/></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}