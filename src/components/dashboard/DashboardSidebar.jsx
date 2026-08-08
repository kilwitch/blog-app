import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../Logo';

export default function DashboardSidebar({ isCollapsed, setIsCollapsed, onLogout, onNavigate }) {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Explore', path: '/all-posts', icon: 'explore' },
    { label: 'My Posts', path: '/my-posts', icon: 'folder_shared' },
    { label: 'Create Post', path: '/add-post', icon: 'edit_note' },
  ];

  return (
    <>
      {/* Mobile Floating Hamburger Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2.5 bg-white text-[#191c21] border border-[#e1e2e9] rounded-xl shadow-md hover:bg-[#f2f3fa] transition-colors cursor-pointer flex items-center justify-center"
          title="Toggle Mobile Menu"
        >
          <span className="material-symbols-outlined text-[24px]">
            {isCollapsed ? 'menu' : 'close'}
          </span>
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {!isCollapsed && (
        <div
          onClick={() => setIsCollapsed(true)}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Sidebar Navigation Container */}
      <nav
        className={`fixed left-0 top-0 h-screen bg-[#f2f3fa] border-r border-[#e1e2e9] z-40 flex flex-col py-6 transition-all duration-300 ${
          isCollapsed ? 'w-20 px-3' : 'w-64 px-4'
        } ${
          isCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
        }`}
      >
        {/* Top Branding & Hamburger Toggle Header */}
        <div
          className={`mb-8 flex items-center ${
            isCollapsed ? 'flex-col gap-4 justify-center' : 'justify-between px-2'
          }`}
        >
          {!isCollapsed ? (
            <div className="flex flex-col gap-1">
              <Link to="/" className="inline-block">
                <Logo width="150px" />
              </Link>
              <p className="text-xs text-[#5a4138] font-['JetBrains_Mono',monospace]">Dev Console</p>
            </div>
          ) : (
            <Link to="/" className="inline-block" title="Inkflow Home">
              <Logo iconOnly width="36px" />
            </Link>
          )}

          {/* Desktop Hamburger Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 text-[#5a4138] hover:text-[#ea580c] hover:bg-[#e1e2e9] rounded-lg transition-colors cursor-pointer items-center justify-center border border-transparent hover:border-[#e1e2e9]"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isCollapsed ? 'menu' : 'menu_open'}
            </span>
          </button>
        </div>

        {/* Action Button: New Post */}
        <button
          onClick={() => onNavigate('/add-post')}
          className={`mb-8 w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-150 shadow-xs cursor-pointer ${
            isCollapsed ? 'py-3 px-0' : 'py-3 px-4'
          }`}
          title="New Post"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          {!isCollapsed && <span>New Post</span>}
        </button>

        {/* Main Navigation Links */}
        <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 py-2.5 rounded-lg transition-colors duration-150 text-sm font-medium ${
                  isCollapsed ? 'justify-center px-0' : 'px-4'
                } ${
                  isActive
                    ? 'bg-[rgba(234,88,12,0.12)] text-[#ea580c] font-semibold border-r-2 border-[#ea580c]'
                    : 'text-[#5a4138] hover:text-[#191c21] hover:bg-[#e1e2e9]'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Bottom Logout Button */}
        <div className="mt-auto pt-4 border-t border-[#e1e2e9] flex flex-col gap-1">
          <button
            onClick={onLogout}
            title={isCollapsed ? 'Log Out' : undefined}
            className={`flex items-center gap-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-150 text-sm font-medium w-full cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : 'px-4 text-left'
            }`}
          >
            <span className="material-symbols-outlined text-red-500">logout</span>
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </nav>
    </>
  );
}
