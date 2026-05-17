import { useState, useEffect } from 'react';
import api from '../../api/axiosSetup';

export default function SchedulesManager() {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                const [subRes, secRes, instRes] = await Promise.all([
                    api.get('subjects/').catch(() => ({ data: [] })),
                    api.get('sections/').catch(() => ({ data: [] })),
                    api.get('instructors/').catch(() => ({ data: [] }))
                ]);
                setSubjects(subRes.data);
                setSections(secRes.data);
                setInstructors(instRes.data);
            } catch (error) {
                console.error("Failed to fetch schedule catalogs", error);
            }
        };
        fetchScheduleData();
    }, []);

    const filtered = filter ? subjects.filter(s => s.secId === Number(filter)) : subjects;

    return (
        <div className="max-w-6xl">
            <div className="flex gap-4 mb-6 items-center justify-between">
                <div className="flex items-center gap-3">
                    <select 
                        className="border-2 border-gray-200 p-2.5 rounded-lg bg-white text-sm outline-none w-64 focus:border-ustpBlue font-medium text-gray-700" 
                        value={filter} 
                        onChange={e => setFilter(e.target.value)}
                    >
                        <option value="">All Academic Sections</option>
                        {sections.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
                    </select>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1.5 rounded-md">
                        {filtered.length} Entries
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold border-b border-gray-200">
                                <th className="p-4 py-3">Subject</th>
                                <th className="p-4 py-3">Section</th>
                                <th className="p-4 py-3">Days</th>
                                <th className="p-4 py-3">Start</th>
                                <th className="p-4 py-3">End</th>
                                <th className="p-4 py-3">Room</th>
                                <th className="p-4 py-3">Instructor</th>
                                <th className="p-4 py-3">Units</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-400 text-sm">
                                        No schedule data available.
                                    </td>
                                </tr>
                            )}
                            {filtered.map(s => {
                                const sec = sections.find(x => x.id === s.secId);
                                const inst = instructors.find(i => i.id === s.instId);
                                return (
                                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition text-sm">
                                        <td className="p-4 font-bold text-gray-800">{s.nm}</td>
                                        <td className="p-4">
                                            {sec ? <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">{sec.nm}</span> : <span className="text-gray-400">—</span>}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs font-semibold">{s.days}</span>
                                        </td>
                                        <td className="p-4 font-bold text-ustpBlue whitespace-nowrap">{s.st}</td>
                                        <td className="p-4 text-gray-600 whitespace-nowrap">{s.et}</td>
                                        <td className="p-4 text-gray-600 font-medium">{s.room}</td>
                                        <td className="p-4 text-gray-700">
                                            {inst?.nm || <span className="text-gray-400 italic">TBA</span>}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">{s.units}u</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}