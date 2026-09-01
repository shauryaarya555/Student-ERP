import React from 'react';
import {
  LayoutDashboard,
  Clock,
  GraduationCap,
  Award,
  Calendar,
  Bell,
  User,
  Calculator,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  profile: StudentProfile;
  unreadCount: number;
  urgentDeadlinesCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  profile,
  unreadCount,
  urgentDeadlinesCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'attendance',
      label: 'Attendance Records',
      icon: Clock,
      badge: profile.overallAttendance < 75 ? 'Low' : null,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'academics',
      label: 'Academic Grades & GPA',
      icon: GraduationCap,
      badge: `${profile.cgpa}`,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'achievements',
      label: 'Achievements & Badges',
      icon: Award,
      badge: '6 Badges',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'schedule',
      label: 'Events & Deadlines',
      icon: Calendar,
      badge: urgentDeadlinesCount > 0 ? `${urgentDeadlinesCount} Due` : null,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'announcements',
      label: 'Faculty Notices',
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount} New` : null,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'calculators',
      label: 'GPA & Target Planner',
      icon: Calculator,
      badge: null,
    },
    {
      id: 'profile',
      label: 'Student Profile & ID',
      icon: User,
      badge: null,
    },
    {
      id: 'register',
      label: 'Register Student',
      icon: UserPlus,
      badge: 'New',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col justify-between p-4 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Items */}
        <div className="space-y-1">
          <p className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Student Portal Navigation
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Student Academic Badge Card */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Academic Standing
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Excellent
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Class Rank</span>
              <span className="font-bold text-slate-800">
                #{profile.rankInBatch} <span className="text-[10px] text-slate-400">/ {profile.totalStudentsInBatch}</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Earned Credits</span>
              <span className="font-bold text-indigo-700">{profile.totalCreditsEarned} Credits</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-slate-500">ERP Sync Active</span>
            </div>
            <span className="font-mono text-slate-400">v2.4.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
