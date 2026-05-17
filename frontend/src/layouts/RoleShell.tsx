/**
 * RoleShell.tsx  ─  ADD-ONLY  ─  Do NOT modify existing files
 *
 * A generic shell identical in style to AdminShell but parameterised
 * for Student / Cashier / Registrar.  Drop this into:
 *   frontend/src/layouts/RoleShell.tsx
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Avatar from '../components/ui/Avatar';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

interface RoleShellProps {
  /** Short role label shown in the sidebar header, e.g. "Student Portal" */
  portalLabel: string;
  /** Accent colour for the role badge — must be a Tailwind bg class */
  accentClass?: string;
  /** Avatar initials */
  userInit: string;
  /** Display name shown in the sidebar footer */
  userName: string;
  /** Sub-label, e.g. "BS Computer Science" */
  userSub: string;
  /** Navigation items for this role */
  nav: NavItem[];
  /** Currently active page id */
  activePage: string;
  /** Callback when a nav item is clicked */
  setActivePage: (id: string) => void;
  /** Logout callback */
  onLogout: () => void;
  children: React.ReactNode;
}

export function RoleShell({
  portalLabel,
  accentClass = 'bg-ustpGold',
  userInit,
  userName,
  userSub,
  nav,
  activePage,
  setActivePage,
  onLogout,
  children,
}: RoleShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentLabel = nav.find(n => n.id === activePage)?.label ?? portalLabel;

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="pt-4 px-5 pb-3 border-b border-white/10">
        <div className={`${accentClass} text-ustpDarkBlue font-bold text-[10px] px-2 py-0.5 rounded inline-block mb-1 tracking-wide`}>
          USTP EMS
        </div>
        <div className="text-sm font-bold text-white leading-tight">{portalLabel}</div>
        <div className="text-[10px] text-white/45 mt-0.5">Enrollment Management System</div>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-2.5">
        <div className="px-4 py-2 text-[9px] font-semibold text-white/30 tracking-wider uppercase">
          Navigation
        </div>
        {nav.map(n => (
          <div
            key={n.id}
            className={`flex items-center gap-2.5 py-2.5 px-4 cursor-pointer text-[13px] transition-all border-l-[3px] relative ${
              activePage === n.id
                ? 'bg-ustpGold/15 text-ustpGold border-ustpGold'
                : 'text-white/70 border-transparent hover:bg-white/5 hover:text-white'
            }`}
            onClick={() => { setActivePage(n.id); setSidebarOpen(false); }}
          >
            <Icon name={n.icon} size={15} />
            <span>{n.label}</span>
            {n.badge && n.badge > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-ustpGold" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 flex items-center gap-2.5">
        <Avatar init={userInit} size={30} gold />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-white truncate">{userName}</div>
          <div className="text-[10px] text-white/40">{userSub}</div>
        </div>
        <button
          onClick={onLogout}
          className="text-white/45 hover:text-ustpGold p-1 rounded transition-colors"
          title="Logout"
        >
          <Icon name="logout" size={14} />
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">

      {/* ── Desktop Sidebar ── */}
      <div className="hidden md:flex w-[236px] bg-ustpDarkBlue text-white flex-col fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[236px] bg-ustpDarkBlue text-white flex flex-col transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* ── Main Content ── */}
      <div className="md:ml-[236px] flex-1 flex flex-col min-w-0">

        {/* Top Nav */}
        <div className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="md:hidden text-ustpDarkBlue p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <div className="text-[17px] font-extrabold text-ustpDarkBlue">{currentLabel}</div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline text-[11px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-semibold">
              SY 2025–2026
            </span>
            <Avatar init={userInit} size={30} gold />
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
