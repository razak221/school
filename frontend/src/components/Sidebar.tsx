import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  Bell,
  Wallet,
  Sparkles,
  BookOpen,
  Users,
  Shield,
  CalendarDays,
  DollarSign,
  GraduationCap,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { activeRole, logout } = useAuth();

  const getNavItems = () => {
    switch (activeRole) {
      case 'teacher':
        return [
          { id: 'teacher-dashboard', label: 'Teacher Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, badge: 'Class 8-A' },
          { id: 'attendance', label: 'Mark Attendance & MDM', icon: <CalendarCheck className="w-4 h-4" />, badge: 'Daily' },
          { id: 'academics', label: 'Exam Marks & CCE', icon: <Award className="w-4 h-4" />, badge: 'Term 1' },
          { id: 'timetable', label: 'Timetable & Periods', icon: <CalendarDays className="w-4 h-4" />, badge: '6 Periods' },
          { id: 'directory', label: 'Student Directory', icon: <Users className="w-4 h-4" />, badge: 'Roster' },
          { id: 'notices', label: 'Notice Board & Alerts', icon: <Bell className="w-4 h-4" />, badge: 'Broadcast' },
          { id: 'ai-assistant', label: 'Gemini AI Assistant', icon: <Sparkles className="w-4 h-4" />, badge: 'Active', highlight: true },
        ];
      case 'parent':
        return [
          { id: 'parent-dashboard', label: 'Child Progress Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, badge: 'Overview' },
          { id: 'academics', label: 'Academic Marksheet', icon: <Award className="w-4 h-4" />, badge: 'CCE Grade' },
          { id: 'timetable', label: 'Class Timetable', icon: <CalendarDays className="w-4 h-4" />, badge: 'Schedule' },
          { id: 'attendance', label: 'Attendance & Meal Record', icon: <CalendarCheck className="w-4 h-4" />, badge: 'Daily' },
          { id: 'notices', label: 'School Circulars', icon: <Bell className="w-4 h-4" />, badge: 'Multilingual' },
          { id: 'ai-assistant', label: 'School AI Helpdesk', icon: <Sparkles className="w-4 h-4" />, badge: 'Help', highlight: true },
        ];
      case 'student':
        return [
          { id: 'student-dashboard', label: 'Student Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, badge: 'Class 8' },
          { id: 'timetable', label: 'My Class Schedule', icon: <CalendarDays className="w-4 h-4" />, badge: 'Periods' },
          { id: 'academics', label: 'My Exam Results', icon: <Award className="w-4 h-4" />, badge: 'Grade A+' },
          { id: 'attendance', label: 'My Attendance & Meal Log', icon: <CalendarCheck className="w-4 h-4" />, badge: 'Daily' },
          { id: 'notices', label: 'School Announcements', icon: <Bell className="w-4 h-4" />, badge: 'Circulars' },
          { id: 'ai-assistant', label: 'AI Study Assistant', icon: <Sparkles className="w-4 h-4" />, badge: 'Ask AI', highlight: true },
        ];
      case 'admin':
      default:
        return [
          { id: 'admin-dashboard', label: 'Main ERP Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, badge: 'Bento' },
          { id: 'finance', label: 'FinFlow & Invoicing', icon: <DollarSign className="w-4 h-4 text-amber-500" />, badge: 'Stripe' },
          { id: 'directory', label: 'Student & Staff Directory', icon: <Users className="w-4 h-4" />, badge: 'Roster' },
          { id: 'timetable', label: 'Timetable & Schedule Master', icon: <CalendarDays className="w-4 h-4" />, badge: 'All Classes' },
          { id: 'attendance', label: 'Attendance & MDM Tracker', icon: <CalendarCheck className="w-4 h-4" />, badge: 'Daily' },
          { id: 'academics', label: 'Academics & AI Marks', icon: <Award className="w-4 h-4" />, badge: 'Term 1' },
          { id: 'notices', label: 'Notice Board & Translations', icon: <Bell className="w-4 h-4" />, badge: 'Regional' },
          { id: 'grants', label: 'SSA Grants & MDM Logs', icon: <Wallet className="w-4 h-4" />, badge: 'PM-POSHAN' },
          { id: 'diagnostics', label: 'System Diagnostics & Cloud', icon: <Shield className="w-4 h-4" />, badge: 'Cloud' },
          { id: 'ai-assistant', label: 'Gemini AI Assistant', icon: <Sparkles className="w-4 h-4" />, badge: 'Active', highlight: true },
        ];
    }
  };

  const navItems = getNavItems();

  const renderNavContent = (isMobileView = false) => (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div className="space-y-4">
        {isMobileView && (
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#002147] to-[#0c6780] flex items-center justify-center text-white font-bold shadow-sm">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-[#002147]">GMS Awanpora</h3>
                <p className="text-[10px] text-slate-500 capitalize">{activeRole} Portal</p>
              </div>
            </div>
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div>
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {activeRole ? `${activeRole.toUpperCase()} Navigation` : 'Navigation'}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCurrentTab(item.id);
                    if (isMobileView && onCloseMobile) {
                      onCloseMobile();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 min-h-[44px] ${
                    isActive
                      ? 'bg-[#002147] text-white shadow-sm'
                      : item.highlight
                      ? 'bg-amber-50 text-amber-900 hover:bg-amber-100/80'
                      : 'text-slate-600 hover:text-[#002147] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.highlight
                          ? 'bg-amber-200 text-amber-950'
                          : 'bg-slate-100 text-slate-500'
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

        {/* School Info Box */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-100 space-y-1.5">
          <div className="flex items-center gap-2 text-[#002147]">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">Academic Profile</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Classes: <strong className="text-slate-800">1st to 8th Standard</strong>
            <br />
            UDISE: <strong className="text-slate-800 font-mono">01061102301</strong>
          </p>
          <div className="pt-1 border-t border-blue-100/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>SCERT J&K Pattern</span>
            <span className="font-semibold text-[#0c6780]">Active</span>
          </div>
        </div>
      </div>

      {/* Footer Info & Logout */}
      <div className="pt-3 border-t border-slate-100 space-y-2.5">
        <button
          type="button"
          onClick={() => {
            if (isMobileView && onCloseMobile) onCloseMobile();
            logout();
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/80 transition-all text-xs font-bold flex items-center justify-center gap-2 min-h-[44px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
        <div className="text-[10px] text-slate-400 text-center">
          <p className="font-semibold text-slate-600">Govt Middle School Awanpora</p>
          <p>Zone Mattan, Anantnag, J&K</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 p-4 shrink-0 flex-col justify-between min-h-[calc(100vh-65px)]">
        {renderNavContent(false)}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-[85%] bg-white shadow-2xl z-50 p-4 overflow-y-auto animate-slide-in">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
