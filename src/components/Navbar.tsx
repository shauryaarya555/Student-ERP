import React, { useState } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  Bell,
  GraduationCap,
  ShieldCheck,
  CreditCard,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Menu,
} from 'lucide-react';
import { StudentProfile, FacultyAnnouncement } from '../types';

interface NavbarProps {
  profile: StudentProfile;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onOpenSearch: () => void;
  onOpenIdCard: () => void;
  onOpenAuth: () => void;
  announcements: FacultyAnnouncement[];
  onOpenAnnouncementDetail: (announcement: FacultyAnnouncement) => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  privacyMode,
  onTogglePrivacy,
  onOpenSearch,
  onOpenIdCard,
  onOpenAuth,
  announcements,
  onOpenAnnouncementDetail,
  onToggleMobileSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = announcements.filter((a) => !a.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu + Portal Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/25">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900">CampusVault</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Fall 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">Student Academic Information Portal</p>
            </div>
          </div>
        </div>

        {/* Center: Quick Global Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-all text-xs group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              <span>Search subjects, grades, deadlines, circulars...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono shadow-xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Actions (Privacy, Search Icon on Mobile, ID Card, Notifications, User) */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Privacy Toggle Button */}
          <button
            onClick={onTogglePrivacy}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              privacyMode
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
            }`}
            title={privacyMode ? 'Privacy Mode Active (GPA & IDs masked)' : 'Toggle Privacy Mode'}
          >
            {privacyMode ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
            <span className="hidden xl:inline text-[11px]">{privacyMode ? 'Privacy On' : 'Privacy'}</span>
          </button>

          {/* Digital ID Card Trigger */}
          <button
            onClick={onOpenIdCard}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100/80 text-indigo-700 text-xs font-semibold transition-all shadow-xs"
          >
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span className="text-[11px]">Digital ID</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Faculty & Admin Notices</span>
                  </div>
                  <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-semibold">
                    {unreadCount} New
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 my-2">
                  {announcements.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onOpenAnnouncementDetail(item);
                        setShowNotifications(false);
                      }}
                      className="py-2.5 px-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.content}</p>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
                        <span>{item.senderName}</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    View All Announcements →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all text-left bg-white shadow-xs"
            >
              <img
                src={profile.avatar}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-lg object-cover border border-indigo-200"
              />
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                  {profile.fullName}
                </p>
                <p className="text-[10px] text-indigo-600 font-mono">
                  {privacyMode ? '••••••••' : profile.rollNumber}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 border-b border-slate-100 pb-3 mb-1">
                  <p className="text-xs font-bold text-slate-900">{profile.fullName}</p>
                  <p className="text-[11px] text-slate-500">{profile.course}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] bg-slate-50 p-1.5 rounded-lg font-mono border border-slate-100">
                    <span className="text-slate-500">CGPA</span>
                    <span className="font-bold text-indigo-600">{privacyMode ? '••' : profile.cgpa} / 10.0</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onOpenIdCard();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>View Digital Student Card</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAuth();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Switch Student Profile</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAuth();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out / Lock Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
