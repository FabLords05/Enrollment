import React, { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';
import Icon from '../ui/Icon';
import Modal from '../ui/Modal';

interface Subject {
    id: number | null;
    nm: string;
    secId: number;
    units: number;
    days: string;
    st: string;
    et: string;
    instId: number | null;
    room: string;
}

interface Section { id: number; nm: string; }
interface Instructor { id: number; nm: string; }

export default function SubjectsManager() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [filterSection, setFilterSection] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<Partial<Subject>>({});

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
        if (!form.nm || !form.secId) return;
        try {
            if (form.id) {
                await api.put(`subjects/${form.id}/`, form);
            } else {
                await api.post('subjects/', form);
            }
            setModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Error updates on subject catalogs", err);
        }
    };

    const filteredSubjects = filterSection 
        ? subjects.filter(s => s.secId === Number(filterSection))
        : subjects;

    return (
        <>
            {modalOpen && (
                <Modal title={form.id ? "Modify Subject" : "Register Subject"} onClose={() => setModalOpen(false)} footer={
                    <>
                        <button className="px-4 py-2 border rounded-md" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="px-4 py-2 bg-ustp-blue text-white rounded-md" onClick={handleSave}>Confirm</button>
                    </>
                }>
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1">SUBJECT TITLE</label>
                        <input className="w-full border p-2 rounded-md" value={form.nm || ''} onChange={e => setForm({...form, nm: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">TARGET SECTION</label>
                            <select className="w-full border p-2 rounded-md bg-white" value={form.secId || ''} onChange={e => setForm({...form, secId: Number(e.target.value)})}>
                                <option value="">Select Section</option>
                                {sections.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">UNITS LOAD</label>
                            <input type="number" className="w-full border p-2 rounded-md" value={form.units || 3} onChange={e => setForm({...form, units: Number(e.target.value)})}/>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-500 mb-1">WEEKDAYS SCHED</label>
                        <input className="w-full border p-2 rounded-md" placeholder="Mon & Wed" value={form.days || ''} onChange={e => setForm({...form, days: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">START TIME</label>
                            <input className="w-full border p-2 rounded-md" placeholder="08:00 AM" value={form.st || ''} onChange={e => setForm({...form, st: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">END TIME</label>
                            <input className="w-full border p-2 rounded-md" placeholder="10:00 AM" value={form.et || ''} onChange={e => setForm({...form, et: e.target.value})}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">INSTRUCTOR ASSIGNED</label>
                            <select className="w-full border p-2 rounded-md bg-white" value={form.instId || ''} onChange={e => setForm({...form, instId: e.target.value ? Number(e.target.value) : null})}>
                                <option value="">TBA</option>
                                {instructors.map(i => <option key={i.id} value={i.id}>{i.nm}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ROOM LOCATION</label>
                            <input className="w-full border p-2 rounded-md" placeholder="Room 101" value={form.room || ''} onChange={e => setForm({...form, room: e.target.value})}/>
                        </div>
                    </div>
                </Modal>
            )}

            <div className="flex gap-4 mb-4 items-center justify-between">
                <select className="border p-2 rounded-md bg-white text-sm outline-none w-48" value={filterSection} onChange={e => setFilterSection(e.target.value)}>
                    <option value="">All Academic Sections</option>
                    {sections.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
                </select>
                <button className="flex items-center gap-2 bg-ustp-blue text-white px-4 py-2 rounded-md font-medium text-sm" onClick={() => { setForm({units: 3}); setModalOpen(true); }}>
                    <Icon n="plus" s={14}/> Add Subject
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
                                        <td className="p-4"><span className="px-2 py-1 bg-g100 text-gray-700 rounded text-xs font-bold">{sec?.nm || '—'}</span></td>
                                        <td className="p-4 text-gray-600">{s.days}</td>
                                        <td className="p-4 text-gray-600 whitespace-nowrap">{s.st} – {s.et}</td>
                                        <td className="p-4 text-gray-600">{s.room}</td>
                                        <td className="p-4 text-gray-700">{inst?.nm || <span className="text-gray-400 italic">TBA</span>}</td>
                                        <td className="p-4"><span className="px-2 py-0.5 bg-ustp-gold-light text-ustp-gold-dark rounded text-xs font-bold">{s.units}u</span></td>
                                        <td className="p-4 text-right">
                                            <button className="p-1 border rounded hover:bg-g100 text-gray-600" onClick={() => { setForm(s); setModalOpen(true); }}><Icon n="edit" s={14}/></button>
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