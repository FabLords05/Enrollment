import { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { AdminShell } from './components/layout/AdminShell';

// 1. We import all your newly created modular components here!
import StudentsManager from './components/admin/StudentsManager';
import SubjectsManager from './components/admin/SubjectsManager';
import InstructorsManager from './components/admin/InstructorsManager';
import RequestsManager from './components/admin/RequestsManager';
import SectionsManager from './components/admin/SectionsManager';
import SchedulesManager from './components/admin/SchedulesManager';

export default function AdminDashboard() {
    const { logout } = useContext(AuthContext) || {};
    
    // This state tracks which tab is currently selected in the sidebar
    const [activePage, setActivePage] = useState('dashboard');

    const handleLogout = () => {
        if (logout) logout();
    };

    return (
        <AdminShell 
            activePage={activePage} 
            setActivePage={setActivePage} 
            onLogout={handleLogout}
            pendingRequestsCount={2} // Mock badge number
        >
            {/* 2. The traffic controller: Only the active component renders */}
            
            {activePage === 'dashboard' && (
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center">
                    <h2 className="text-2xl font-bold text-ustpDarkBlue">Welcome to the Admin Portal 🏛️</h2>
                    <p className="text-gray-500 mt-2">Select a module from the sidebar to manage university records.</p>
                </div>
            )}
            
            {/* These instantly load the files we built earlier! */}
            {activePage === 'students' && <StudentsManager />}
            
            {activePage === 'sections' && <SectionsManager />}
            
            {activePage === 'subjects' && <SubjectsManager />}
            
            {activePage === 'instructors' && <InstructorsManager />}
            
            {activePage === 'schedules' && <SchedulesManager />}

            {activePage === 'requests' && <RequestsManager />}
            
        </AdminShell>
    );
}