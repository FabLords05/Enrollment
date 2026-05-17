/**
 * RegistrarLayout.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/layouts/RegistrarLayout.tsx
 */

import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { RoleShell } from './RoleShell';

import RegistrarDashboardPage from '../pages/registrar/RegistrarDashboardPage';
import RegistrarStudentRecordsPage from '../pages/registrar/RegistrarStudentRecordsPage';
import RegistrarEnrollmentApprovalPage from '../pages/registrar/RegistrarEnrollmentApprovalPage';
import RegistrarSectionsPage from '../pages/registrar/RegistrarSectionsPage';
import RegistrarReportsPage from '../pages/registrar/RegistrarReportsPage';
import RegistrarProfilePage from '../pages/registrar/RegistrarProfilePage';

const registrarNav = [
  { id: 'dashboard',          label: 'Dashboard',          icon: 'home',  },
  { id: 'student-records',    label: 'Student Records',    icon: 'users', },
  { id: 'enrollment-approval',label: 'Enrollment Approval',icon: 'check', badge: 4 },
  { id: 'sections',           label: 'Sections',           icon: 'grid',  },
  { id: 'reports',            label: 'Reports',            icon: 'doc',   },
  { id: 'profile',            label: 'Profile',            icon: 'user',  },
];

export default function RegistrarLayout() {
  const { user, logout } = useContext(AuthContext) || {};
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogout = () => { if (logout) logout(); };

  return (
    <RoleShell
      portalLabel="Registrar Portal"
      accentClass="bg-purple-400"
      userInit="R"
      userName={user?.email?.split('@')[0] ?? 'Registrar'}
      userSub="Registrar Office"
      nav={registrarNav}
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={handleLogout}
    >
      {activePage === 'dashboard'           && <RegistrarDashboardPage />}
      {activePage === 'student-records'     && <RegistrarStudentRecordsPage />}
      {activePage === 'enrollment-approval' && <RegistrarEnrollmentApprovalPage />}
      {activePage === 'sections'            && <RegistrarSectionsPage />}
      {activePage === 'reports'             && <RegistrarReportsPage />}
      {activePage === 'profile'             && <RegistrarProfilePage />}
    </RoleShell>
  );
}
