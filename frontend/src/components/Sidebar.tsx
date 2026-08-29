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
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
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
          { id: 'attendance', label: 'Attendance & Meal Record', icon: <CalendarCheck className="w-4 h-4" />, badge: '95%' },
          { id: 'notices', label: 'School Circulars', icon: <Bell className="w-4 h-4" />, badge: 'Multilingual' },
          { id: 'ai-assistant', label: 'School AI Helpdesk', icon: <Sparkles className="w-4 h-4" />, badge: 'Help', highlight: true },
        ];
      case 'student':
        return [
          { id: 'student-dashboard', label: 'Student Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, badge: 'Class 8' },
          { id: 'timetable', label: 'My Class Schedule', icon: <CalendarDays className="w-4 h-4" />, badge: 'Periods' },
          { id: 'academics', label: 'My Exam Results', icon: <Award className="w-4 h-4" />, badge: 'Grade A+' },
          { id: 'attendance', label: 'My Attendance & Meal Log', icon: <CalendarCheck className="w-4 h-4" />, badge: '95%' },
          { id: 'notices', label: 'School Announcements', icon: <Bell className="w-4 h-4" />, badge: 'Circulars' },
          { id: 'ai-assistant', label: 'AI Study Assistant', icon: <Sparkles className="w-4 h-4" />, badge: 'Ask AI', highlight: true },
        ];
      case 'admin':
      default:
        return [
          { id: 'admin-dashboard', label: 'Main ERP Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, badge: 'Bento' },
          { id: 'finance', label: 'FinFlow & Invoicing', icon: <DollarSign className="w-4 h-4 text-amber-500" />, badge: 'Stripe' },
          { id: 'directory', label: 'Student & Staff Directory', icon: <Users className="w-4 h-4" />, badge: '248 Enrolled' },
          { id: 'timetable', label: 'Timetable & Schedule Master', icon: <CalendarDays className="w-4 h-4" />, badge: 'All Classes' },
          { id: 'attendance', label: 'Attendance & MDM Tracker', icon: <CalendarCheck className="w-4 h-4" />, badge: '94.2%' },
          { id: 'academics', label: 'Academics & AI Marks', icon: <Award className="w-4 h-4" />, badge: 'Term 1' },
          { id: 'notices', label: 'Notice Board & Translations', icon: <Bell className="w-4 h-4" />, badge: 'Regional' },
          { id: 'grants', label: 'SSA Grants & MDM Logs', icon: <Wallet className="w-4 h-4" />, badge: 'PM-POSHAN' },
          { id: 'diagnostics', label: 'System Diagnostics & Cloud', icon: <Shield className="w-4 h-4" />, badge: 'Cloud' },
          { id: 'ai-assistant', label: 'Gemini AI Assistant', icon: <Sparkles className="w-4 h-4" />, badge: 'Active', highlight: true },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {activeRole ? `${activeRole.toUpperCase()} Navigation` : 'Navigation'}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
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
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-100 space-y-2">
          <div className="flex items-center gap-2 text-[#002147]">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-bold">Academic Session</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Classes: <strong className="text-slate-800">1st to 8th Standard</strong>
            <br />
            Enrolment: <strong className="text-slate-800">248 Students</strong>
            <br />
            Faculty: <strong className="text-slate-800">11 Staff Members</strong>
          </p>
          <div className="pt-1 border-t border-blue-100/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>SCERT J&K Curriculum</span>
            <span className="font-semibold text-[#0c6780]">Active</span>
          </div>
        </div>
      </div>

      {/* Footer Info & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <button
          onClick={logout}
          className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/80 transition-all text-xs font-bold flex items-center justify-center gap-2"
        >
          <span>Sign Out</span>
        </button>
        <div className="text-[11px] text-slate-400">
          <p className="font-semibold text-slate-600">Govt Middle School Awanpora</p>
          <p>Salia, Mattan, Anantnag, J&K</p>
        </div>
      </div>
    </aside>
  );
};
