import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api/axiosSetup';
import Icon from '../ui/Icon';
import Modal from '../ui/Modal';

// 1. Hardened Domain Definitions
interface Subject {
    id: number;
    nm: string;
    secId: number;
    units: number;
    days: string;
    st: string;
    et: string;
    instId: number | null;
    room: string;
}

interface Section { id: number; name: string; } // Aligned with your updated Sections table schema
interface Instructor { id: number; nm: string; }

export default function SubjectsManager() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [filterSection, setFilterSection] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);
    
    // Initialized with clear default structures to eliminate uncontrolled input crashes
    const [form, setForm] = useState({
        id: null as number | null,
        nm: '',
        secId: '' as number | '',
        units: 3,
        days: '',
        st: '',
        et: '',
        instId: '' as number | null | '',
        room: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subRes, secRes, instRes] = await Promise.all([
                api.get('subjects/'),
                api.get('sections/'),
                api.get('instructors/')
            ]);
            setSubjects(subRes.data);
            setSections(secRes.data);
            setInstructors(instRes.data);
        } catch (err) {
            console.error("Failed to fetch subject catalogs", err);
        }
    };

    const handleSave = async () => {
        if (!form.nm || !form.secId) {
            alert("Subject Title and Target Section are required fields.");
            return;
        }

        try {
            const payload = {
                ...form,
                instId: form.instId === '' ? null : form.instId
            };

            if (form.id) {
                // Shifted to partial PATCH mutation handling
                await api.patch(`subjects/${form.id}/`, payload);
            } else {
                await api.post('subjects/', payload);
            }
            setModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error updates on subject catalogs", error);
            if (axios.isAxiosError(error) && error.response) {
                console.error("Django verification rejection payload:", error.response.data);
                alert(`Backend Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Failed to modify catalog record.");
            }
        }
    };

    const filteredSubjects = filterSection 
        ? subjects.filter(s => s.secId === Number(filterSection))
        : subjects;

    return (
        <>
            {modalOpen && (
                <Modal 
                    title={form.id ? "Modify Subject" : "Register Subject"} 
                    onClose={() => setModalOpen(false)} 
                    footer={
                        <>
                            <button className="px-4 py-2 border rounded-md text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="px-4 py-2 bg-ustpBlue text-white rounded-md text-[13px] font-semibold hover:bg-blue-700 transition" onClick={handleSave}>Confirm</button>
                        </>
                    }
                >
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1">SUBJECT TITLE</label>
                        <input className="w-full border p-2 rounded-md text-sm outline-none focus:border-ustpBlue" value={form.nm} onChange={e => setForm({...form, nm: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">TARGET SECTION</label>
                            <select className="w-full border p-2 rounded-md bg-white text-sm outline-none focus:border-ustpBlue" value={form.secId} onChange={e => setForm({...form, secId: Number(e.target.value) || ''})}>
                                <option value="">Select Section</option>
                                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">UNITS LOAD</label>
                            <input type="number" className="w-full border p-2 rounded-md text-sm outline-none focus:border-ustpBlue" value={form.units} onChange={e => setForm({...form, units: Number(e.target.value)})}/>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1">WEEKDAYS SCHED</label>
                        <input className="w-full border p-2 rounded-md text-sm outline-none focus:border-ustpBlue" placeholder="Mon & Wed" value={form.days} onChange={e => setForm({...form, days: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">START TIME</label>
                            <input className="w-full border p-2 rounded-md text-sm outline-none focus:border-ustpBlue" placeholder="08:00 AM" value={form.st} onChange={e => setForm({...form, st: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">END TIME</label>
                            <input className="w-full border p-2 rounded-md text-sm outline-none focus:border-ustpBlue" placeholder="10:00 AM" value={form.et} onChange={e => setForm({...form, et: e.target.value})}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">INSTRUCTOR ASSIGNED</label>
                            <select className="w-full border p-2 rounded-md bg-white text-sm outline-none focus:border-ustpBlue" value={form.instId ?? ''} onChange={e => setForm({...form, instId: e.target.value ? Number(e.target.value) : null})}>
                                <option value="">TBA</option>
                                {instructors.map(i => <option key={i.id} value={i.id}>{i.nm}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ROOM LOCATION</label>
                            <input className="w-full border p-2 rounded-md text-sm outline-none focus:border-ustpBlue" placeholder="Room 101" value={form.room} onChange={e => setForm({...form, room: e.target.value})}/>
                        </div>
                    </div>
                </Modal>
            )}

            <div className="flex gap-4 mb-4 items-center justify-between">
                <select className="border p-2 rounded-md bg-white text-sm outline-none w-48 focus:border-ustpBlue" value={filterSection} onChange={e => setFilterSection(e.target.value)}>
                    <option value="">All Academic Sections</option>
                    {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button className="flex items-center gap-2 bg-ustpBlue text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition" onClick={() => { setForm({ id: null, nm: '', secId: '', units: 3, days: '', st: '', et: '', instId: '', room: '' }); setModalOpen(true); }}>
                    {/* Fixed Icon parameter properties mapping context */}
                    <Icon name="plus" size={14}/> Add Subject
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-g200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-g50 text-gray-500 text-xs font-bold border-b border-g200">
                                <th className="p-4">SUBJECT CODE/NAME</th>
                                <th className="p-4">SECTION</th>
                                <th className="p-4">DAYS</th>
                                <th className="p-4">TIME WINDOW</th>
                                <th className="p-4">ROOM</th>
                                <th className="p-4">INSTRUCTOR</th>
                                <th className="p-4">UNITS</th>
                                <th className="p-4 text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubjects.map(s => {
                                const sec = sections.find(x => x.id === s.secId);
                                const inst = instructors.find(i => i.id === s.instId);
                                return (
                                    <tr key={s.id} className="border-b border-g100 hover:bg-g50 transition text-sm">
                                        <td className="p-4 font-semibold text-gray-800">{s.nm}</td>
                                        <td className="p-4"><span className="px-2 py-1 bg-g100 text-gray-700 rounded text-xs font-bold">{sec?.name || '—'}</span></td>
                                        <td className="p-4 text-gray-600">{s.days}</td>
                                        <td className="p-4 text-gray-600 whitespace-nowrap">{s.st} – {s.et}</td>
                                        <td className="p-4 text-gray-600">{s.room}</td>
                                        <td className="p-4 text-gray-700">{inst?.nm || <span className="text-gray-400 italic">TBA</span>}</td>
                                        <td className="p-4"><span className="px-2 py-0.5 bg-ustpGold/10 text-ustpGold rounded text-xs font-bold">{s.units}u</span></td>
                                        <td className="p-4 text-right">
                                            <button className="p-1 border rounded hover:bg-g100 text-gray-600" onClick={() => { setForm({ ...s, instId: s.instId ?? '' }); setModalOpen(true); }}><Icon name="edit" size={14}/></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}