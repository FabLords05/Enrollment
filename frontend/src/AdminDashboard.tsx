import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import api from './api/axiosSetup';
import { AdminShell } from './components/layout/AdminShell';

export default function AdminDashboard() {
    const { user, logout } = useContext(AuthContext) || {};
    
    // UI State (Matches the new AdminShell Navigation IDs)
    const [activePage, setActivePage] = useState('dashboard');
    
    // Data State
    const [staffList, setStaffList] = useState([]);
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('REGISTRAR');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (activePage === 'staff') {
            fetchStaff();
        }
    }, [activePage]);

    const fetchStaff = async () => {
        try {
            // Note: You will need to create a simple UserViewSet in Django to make this endpoint work!
            const response = await api.get('users/'); 
            setStaffList(response.data);
        } catch (error) {
            console.error("Failed to fetch staff", error);
        }
    };

    const handleCreateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Send data to your Django API
            await api.post('users/', { email, password, role });
            setMessage('Account created successfully!');
            setEmail('');
            setPassword('');
            fetchStaff(); // Refresh the table
        } catch (error) {
            setMessage('Error creating account. Email might already exist.');
        }
    };

    const handleLogout = () => {
        if (logout) {
            logout();
        }
    };

    return (
        <AdminShell 
            activePage={activePage} 
            setActivePage={setActivePage} 
            onLogout={handleLogout}
            pendingRequestsCount={3} // Mock badge
        >
            
            {/* --- DASHBOARD VIEW --- */}
            {activePage === 'dashboard' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-ustpDarkBlue">Welcome to the Admin Portal, {user?.email || 'Admin'}</h2>
                    <p className="text-gray-600 mt-2">
                        Your UI components and layout shell are perfectly wired up.
                    </p>
                </div>
            )}

            {/* --- STAFF MANAGEMENT VIEW --- */}
            {/* Note: I mapped this to 'students' in the sidebar for now, you can rename the nav items in AdminShell later if you want a dedicated 'staff' tab */}
            {(activePage === 'students' || activePage === 'staff') && (
                <div>
                    <h2 className="text-2xl font-bold text-ustpDarkBlue mb-6 border-b border-gray-200 pb-2">
                        Staff Management
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Create Staff Form */}
                        <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                            <h3 className="text-[15px] font-bold text-ustpDarkBlue mb-4">Create Account</h3>
                            {message && <p className="mb-4 text-[13px] font-medium text-green-600 bg-green-50 p-2 rounded-md border border-green-200">{message}</p>}
                            
                            <form onSubmit={handleCreateStaff} className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wider">Email</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required
                                        className="w-full border-1.5 border-gray-200 rounded-lg p-2.5 text-[13px] text-gray-800 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wider">Password</label>
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required
                                        className="w-full border-1.5 border-gray-200 rounded-lg p-2.5 text-[13px] text-gray-800 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wider">Role</label>
                                    <select 
                                        value={role} 
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full border-1.5 border-gray-200 rounded-lg p-2.5 text-[13px] text-gray-800 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    >
                                        <option value="REGISTRAR">Registrar</option>
                                        <option value="CASHIER">Cashier</option>
                                    </select>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-ustpBlue hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-[13px] transition-colors mt-2"
                                >
                                    Add Staff
                                </button>
                            </form>
                        </div>

                        {/* Staff List Table */}
                        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="text-[15px] font-bold text-ustpDarkBlue mb-4">Active Accounts</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="text-[10px] font-bold text-gray-600 uppercase tracking-wide py-2.5 px-3 bg-gray-50 border-b-2 border-gray-200 text-left whitespace-nowrap">Email</th>
                                            <th className="text-[10px] font-bold text-gray-600 uppercase tracking-wide py-2.5 px-3 bg-gray-50 border-b-2 border-gray-200 text-left whitespace-nowrap">Role</th>
                                            <th className="text-[10px] font-bold text-gray-600 uppercase tracking-wide py-2.5 px-3 bg-gray-50 border-b-2 border-gray-200 text-left whitespace-nowrap">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Mock Data display when API returns empty */}
                                        {staffList.length === 0 && (
                                            <tr className="hover:bg-gray-50 transition-colors">
                                                <td className="py-2.5 px-3 border-b border-gray-100 text-[13px] text-gray-800 align-middle">registrar@school.edu</td>
                                                <td className="py-2.5 px-3 border-b border-gray-100 align-middle">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">REGISTRAR</span>
                                                </td>
                                                <td className="py-2.5 px-3 border-b border-gray-100 text-[13px] text-green-600 font-medium align-middle">Active</td>
                                            </tr>
                                        )}
                                        {/* Real Data Map */}
                                        {staffList.map((staff: any) => (
                                            <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-2.5 px-3 border-b border-gray-100 text-[13px] text-gray-800 align-middle">{staff.email}</td>
                                                <td className="py-2.5 px-3 border-b border-gray-100 align-middle">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-ustpBlue">
                                                        {staff.role}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-3 border-b border-gray-100 text-[13px] text-green-600 font-medium align-middle">Active</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* --- PLACEHOLDER FOR OTHER TABS --- */}
            {activePage !== 'dashboard' && activePage !== 'students' && activePage !== 'staff' && (
                <div className="flex items-center justify-center h-64 text-gray-400 font-semibold border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    The {activePage} module is being ported next...
                </div>
            )}

        </AdminShell>
    );
}