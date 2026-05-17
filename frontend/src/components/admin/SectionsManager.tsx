import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { Modal } from '../ui/Modal';

// Mock data to ensure the UI renders perfectly before you wire up Django
const INITIAL_SECTIONS = [
  { id: 1, nm: 'BSIT-1A', prog: 'BS Information Technology', yr: 1, slots: 40, enrolled: 28 },
  { id: 2, nm: 'BSIT-1B', prog: 'BS Information Technology', yr: 1, slots: 40, enrolled: 35 },
  { id: 3, nm: 'BSCS-1A', prog: 'BS Computer Science', yr: 1, slots: 35, enrolled: 22 },
];

export function SectionsManager() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nm: '', prog: '', yr: 1, slots: 40 });

  const handleSave = () => {
    // In the future, this will be api.post('sections/', formData)
    const newSection = { ...formData, id: Date.now(), enrolled: 0 };
    setSections([...sections, newSection]);
    setModalOpen(false);
    setFormData({ nm: '', prog: '', yr: 1, slots: 40 });
  };

  return (
    <div>
      
      {/* Header & Add Button */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-2xl font-bold text-ustpDarkBlue">Section Management</h2>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-ustpBlue hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-[13px] transition-colors flex items-center gap-2"
        >
          <Icon name="plus" size={14} />
          New Section
        </button>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map(sec => {
          const capacityPct = Math.round((sec.enrolled / sec.slots) * 100);
          
          return (
            <div key={sec.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:-translate-y-0.5 transition-transform">
              {/* Top Gradient Stripe */}
              <div className="h-1 bg-gradient-to-r from-ustpBlue to-ustpGold rounded-t-2xl -mx-5 -mt-5 mb-4" />
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-extrabold text-[15px] text-ustpDarkBlue">{sec.nm}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">{sec.prog}</div>
                </div>
                <span className="bg-blue-50 text-ustpBlue text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Year {sec.yr}
                </span>
              </div>

              {/* Stats Row */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-[15px] text-ustpBlue">{sec.enrolled}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Enrolled</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-[15px] text-ustpBlue">{sec.slots}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Total Slots</div>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[11px] text-gray-500 mb-1 font-medium">
                  <span>Capacity</span>
                  <span>{capacityPct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      capacityPct > 85 ? 'bg-red-500' : capacityPct > 65 ? 'bg-ustpGold' : 'bg-ustpBlue'
                    }`} 
                    style={{ width: `${capacityPct}%` }} 
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-ustpBlue py-1.5 rounded-lg text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5">
                  <Icon name="edit" size={12} /> Edit
                </button>
                <button className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 rounded-lg transition-colors flex items-center justify-center">
                  <Icon name="trash" size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Creation Modal */}
      {modalOpen && (
        <Modal 
          title="Create New Section" 
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-[13px] font-semibold bg-ustpBlue text-white hover:bg-blue-700 rounded-lg transition-colors">Save Section</button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wider">Section Name</label>
              <input type="text" placeholder="e.g. BSIT-1A" value={formData.nm} onChange={e => setFormData({...formData, nm: e.target.value})} className="w-full border-1.5 border-gray-200 rounded-lg p-2.5 text-[13px] outline-none focus:border-ustpBlue focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wider">Program</label>
              <input type="text" placeholder="e.g. BS Information Technology" value={formData.prog} onChange={e => setFormData({...formData, prog: e.target.value})} className="w-full border-1.5 border-gray-200 rounded-lg p-2.5 text-[13px] outline-none focus:border-ustpBlue focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wider">Year Level</label>
                <select value={formData.yr} onChange={e => setFormData({...formData, yr: parseInt(e.target.value)})} className="w-full border-1.5 border-gray-200 rounded-lg p-2.5 text-[13px] outline-none focus:border-ustpBlue focus:ring-4 focus:ring-blue-500/10">
                  {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wider">Total Slots</label>
                <input type="number" min="1" value={formData.slots} onChange={e => setFormData({...formData, slots: parseInt(e.target.value)})} className="w-full border-1.5 border-gray-200 rounded-lg p-2.5 text-[13px] outline-none focus:border-ustpBlue focus:ring-4 focus:ring-blue-500/10" />
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}