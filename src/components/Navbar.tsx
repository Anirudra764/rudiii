/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, User as UserIcon, ShieldAlert, LogIn, ChevronDown, CheckCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LOGO_ITEMS } from '../lib/brand.js';
import { User, UserRole } from '../types.js';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  onOpenLoginModal: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchRole,
  onLogout,
  onOpenLoginModal
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Band' },
    { id: 'videos', label: 'Videos' },
    { id: 'events', label: 'Tour' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const isAdminOrManager = currentUser.role !== 'user';

  return (
    <nav className="sticky top-0 z-40 bg-[#0f0e13]/80 backdrop-blur-md border-b border-white/10 px-4 py-3 text-white transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="cursor-pointer" onClick={() => handleNavClick('home')}>
          <LOGO_ITEMS.MainLogo className="h-9" />
        </div>

        {/* Regular Desktop Navigation links */}
        <div className="hidden lg:flex items-center gap-7">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-semibold tracking-wide transition-all relative py-1 focus:outline-none cursor-pointer ${
                activeTab === item.id 
                  ? 'text-[#D4AF37]' 
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <span className="relative z-10 px-1">{item.label}</span>
              {activeTab === item.id && (
                <motion.span 
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-[#D4AF37] to-[#8A2BE2] rounded-full"
                  transition={{ type: "spring", stiffness: 355, damping: 28 }}
                />
              )}
            </button>
          ))}

          {/* User Ticket Dashboard */}
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNavClick('dashboard')}
            className={`text-sm font-semibold tracking-wide transition-all px-3 py-1.5 bg-white/5 rounded-full flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dashboard' ? 'text-[#D4AF37] border border-[#D4AF37]/45 font-bold' : 'text-zinc-300'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            My Dashboard
          </motion.button>
 
          {/* Admin Dashboard Page Link for Administrative Roles */}
          {isAdminOrManager && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNavClick('admin')}
              className={`text-sm font-bold tracking-wide py-1.5 px-3.5 rounded-full border bg-gradient-to-r transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin' 
                  ? 'from-[#D4AF37] to-[#8A2BE2] text-black border-transparent font-black shadow-lg shadow-[#D4AF37]/20 scale-105' 
                  : 'from-amber-600/20 to-purple-800/20 border-amber-500/30 text-[#D4AF37] hover:border-amber-400'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Console
              <span className="inline-flex items-center justify-center bg-red-650 text-white text-[8px] font-black rounded-full w-4 h-4 text-center">
                {currentUser.role === 'superadmin' ? 'S' : currentUser.role === 'admin' ? 'A' : 'M'}
              </span>
            </motion.button>
          )}
        </div>

        {/* Role Simulator Options (Essential for reviewing RBAC dynamically without logging out repeatedly) */}
        <div className="hidden lg:flex items-center gap-2">
          
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="role-switch-trigger"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="px-3 py-1.5 rounded-lg bg-[#181524] hover:bg-[#201d30] border border-[#8A2BE2]/30 text-xs flex items-center gap-2 transition-all text-purple-200 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '6s' }} />
              Role: <span className="font-extrabold text-[#f5f5f7] capitalize">{currentUser.role}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.button>
 
            <AnimatePresence>
              {roleDropdownOpen && (
                <motion.div 
                  id="role-dropdown-menu"
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-56 bg-[#0f0e13] border border-[#8A2BE2]/30 rounded-xl shadow-2xl z-50 p-1.5 backdrop-blur-xl"
                >
                  <div className="px-3 py-1.5 text-[9px] uppercase font-mono tracking-widest text-[#D4AF37] border-b border-white/10 mb-1">
                    RBAC Role Sandbox Simulator
                  </div>
                  
                  {(['superadmin', 'admin', 'manager', 'user'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        onSwitchRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        currentUser.role === role 
                          ? 'bg-purple-900/40 text-white font-semibold' 
                          : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="capitalize">{role === 'manager' ? 'Staff Manager' : role}</span>
                      {currentUser.role === role && <CheckCheck className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-right text-xs bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
            <span className="block text-[10px] text-zinc-400 font-mono">User</span>
            <span className="font-semibold text-zinc-100">{currentUser.fullName}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="text-xs text-red-450 hover:text-red-300 px-2 py-1.5 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
          >
            Switch User
          </motion.button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Explicit Role Selector Dropdown */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="text-[10px] px-2.5 py-1.5 bg-[#181524] rounded-lg border border-[#8A2BE2]/40 text-[#D4AF37] uppercase font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Select simulation role"
            >
              <span>{currentUser.role}</span>
              <ChevronDown className="w-3 h-3 text-[#D4AF37]" />
            </motion.button>
 
            <AnimatePresence>
              {roleDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 w-44 bg-[#0f0e13] border border-[#8A2BE2]/40 rounded-xl shadow-2xl z-50 p-1.5 backdrop-blur-xl"
                >
                  <div className="px-2 py-1 text-[8px] uppercase font-mono tracking-widest text-[#D4AF37] border-b border-white/10 mb-1">
                    RBAC Simulator
                  </div>
                  
                  {(['superadmin', 'admin', 'manager', 'user'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        onSwitchRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors ${
                        currentUser.role === role 
                          ? 'bg-purple-900/40 text-white font-semibold' 
                          : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="capitalize text-[11px]">{role === 'manager' ? 'Staff' : role}</span>
                      {currentUser.role === role && <CheckCheck className="w-3 h-3 text-[#D4AF37]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
 
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-[#181524] text-zinc-200 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

      </div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden mt-3 p-4 bg-[#0f0e13]/95 border-t border-purple-900/40 rounded-xl space-y-3.5 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold border-l-2 border-[#D4AF37]' 
                    : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'dashboard' ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-bold' : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              My Ticket Dashboard
            </button>

            {isAdminOrManager && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center gap-2 ${
                  activeTab === 'admin' ? 'bg-amber-500/20 text-[#D4AF37] font-bold' : 'text-amber-400/80 hover:bg-white/5'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Administrative Console
              </button>
            )}

            {/* Mobile explicit Role Sandbox Selectors */}
            <div className="bg-purple-950/20 border border-purple-900/40 rounded-lg p-2.5 mt-1 space-y-2">
              <span className="block text-[9px] text-[#D4AF37] font-mono tracking-wider uppercase">
                RBAC Sandbox Simulator
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['superadmin', 'admin', 'manager', 'user'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      onSwitchRole(role);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-1.5 text-[11px] rounded transition-all text-center font-medium capitalize flex items-center justify-center gap-1 ${
                      currentUser.role === role
                        ? 'bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-semibold shadow-md'
                        : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{role === 'manager' ? 'Staff' : role}</span>
                    {currentUser.role === role && <CheckCheck className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-zinc-900/50 rounded-lg border border-white/5 mt-1">
              <div className="text-xs">
                <span className="block text-[9px] text-zinc-400 font-mono">Current Identity</span>
                <span className="font-semibold text-zinc-200">{currentUser.fullName}</span>
              </div>
              <button
                onClick={onLogout}
                className="text-xs text-red-400 hover:text-red-300 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
