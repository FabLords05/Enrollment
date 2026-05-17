/**
 * CashierLayout.tsx  ─  ADD-ONLY
 * Drop into: frontend/src/layouts/CashierLayout.tsx
 */

import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { RoleShell } from './RoleShell';

import CashierDashboardPage from '../pages/cashier/CashierDashboardPage';
import CashierPaymentsPage from '../pages/cashier/CashierPaymentsPage';
import CashierStudentSearchPage from '../pages/cashier/CashierStudentSearchPage';
import CashierTransactionsPage from '../pages/cashier/CashierTransactionsPage';
import CashierProfilePage from '../pages/cashier/CashierProfilePage';

const cashierNav = [
  { id: 'dashboard',     label: 'Dashboard',      icon: 'home'   },
  { id: 'payments',      label: 'Payments',        icon: 'doc'    },
  { id: 'student-search',label: 'Student Search',  icon: 'search' },
  { id: 'transactions',  label: 'Transactions',    icon: 'grid'   },
  { id: 'profile',       label: 'Profile',         icon: 'user'   },
];

export default function CashierLayout() {
  const { user, logout } = useContext(AuthContext) || {};
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogout = () => { if (logout) logout(); };

  return (
    <RoleShell
      portalLabel="Cashier Portal"
      accentClass="bg-green-400"
      userInit="C"
      userName={user?.email?.split('@')[0] ?? 'Cashier'}
      userSub="Finance Office"
      nav={cashierNav}
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={handleLogout}
    >
      {activePage === 'dashboard'      && <CashierDashboardPage />}
      {activePage === 'payments'       && <CashierPaymentsPage />}
      {activePage === 'student-search' && <CashierStudentSearchPage />}
      {activePage === 'transactions'   && <CashierTransactionsPage />}
      {activePage === 'profile'        && <CashierProfilePage />}
    </RoleShell>
  );
}
