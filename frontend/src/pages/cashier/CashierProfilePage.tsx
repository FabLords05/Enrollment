/**
 * CashierProfilePage.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/pages/cashier/CashierProfilePage.tsx
 */

import React, { useState } from 'react';

export default function CashierProfilePage() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-500 h-24" />
        <div className="px-6 pb-6 -mt-10">
          <div className="w-20 h-20 rounded-full bg-green-400 text-white flex items-center justify-center text-3xl font-extrabold border-4 border-white shadow-md">
            C
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-extrabold text-ustpDarkBlue">Cashier Staff</h2>
            <p className="text-sm text-gray-400">cashier@ustp.edu.ph</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[11px] bg-green-50 text-green-600 px-2.5 py-0.5 rounded-full font-semibold">Finance Office</span>
              <span className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-semibold">Cashier Role</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-bold text-ustpDarkBlue">Staff Information</h3>
          <button
            onClick={() => setEditing(!editing)}
            className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              editing ? 'bg-ustpDarkBlue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {editing ? '💾 Save' : '✏️ Edit'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Employee ID',    value: 'EMP-2019-005',         readOnly: true  },
            { label: 'Full Name',      value: 'Jane Cashier',          readOnly: false },
            { label: 'Email',          value: 'cashier@ustp.edu.ph',  readOnly: true  },
            { label: 'Contact',        value: '09181234567',           readOnly: false },
            { label: 'Department',     value: 'Finance Office',        readOnly: true  },
            { label: 'Designation',    value: 'Cashier II',            readOnly: true  },
          ].map(({ label, value, readOnly }) => (
            <div key={label}>
              <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">{label}</label>
              <input
                type="text"
                defaultValue={value}
                disabled={!editing || readOnly}
                className={`w-full border rounded-lg px-3 py-2 text-[13px] text-gray-700 transition-colors ${
                  editing && !readOnly
                    ? 'border-ustpBlue/40 bg-white focus:outline-none focus:ring-2 focus:ring-ustpBlue/20'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
