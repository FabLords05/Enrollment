/**
 * StudentLayout.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/layouts/StudentLayout.tsx
 */

import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { RoleShell } from './RoleShell';

import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import StudentSubjectsPage from '../pages/student/StudentSubjectsPage';
import StudentSchedulePage from '../pages/student/StudentSchedulePage';
import StudentFinancePage from '../pages/student/StudentFinancePage';
import StudentProfilePage from '../pages/student/StudentProfilePage';

const studentNav = [
  { id: 'dashboard', label: 'Dashboard',  icon: 'home' },
  { id: 'subjects',  label: 'Subjects',   icon: 'book' },
  { id: 'schedule',  label: 'Schedule',   icon: 'cal'  },
  { id: 'finance',   label: 'Finance',    icon: 'doc'  },
  { id: 'profile',   label: 'Profile',    icon: 'user' },
];

export default function StudentLayout() {
  const { user, logout } = useContext(AuthContext) || {};
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogout = () => { if (logout) logout(); };

  return (
    <RoleShell
      portalLabel="Student Portal"
      accentClass="bg-ustpGold"
      userInit="S"
      userName={user?.email?.split('@')[0] ?? 'Student'}
      userSub="Enrolled Student"
      nav={studentNav}
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={handleLogout}
    >
      {activePage === 'dashboard' && <StudentDashboardPage />}
      {activePage === 'subjects'  && <StudentSubjectsPage />}
      {activePage === 'schedule'  && <StudentSchedulePage />}
      {activePage === 'finance'   && <StudentFinancePage />}
      {activePage === 'profile'   && <StudentProfilePage />}
    </RoleShell>
  );
}
