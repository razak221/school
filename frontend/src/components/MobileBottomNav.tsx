import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  Bell,
  Sparkles,
  Users,
  CalendarDays,
  Menu,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenMenu,
}) => {
  const { activeRole } = useAuth();

  const getBottomNavItems = () => {
    switch (activeRole) {
      case 'parent':
        return [
          { id: 'parent-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'academics', label: 'Marks', icon: <Award className="w-5 h-5" /> },
          { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-5 h-5" /> },
          { id: 'notices', label: 'Notices', icon: <Bell className="w-5 h-5" /> },
          { id: 'ai-assistant', label: 'AI Help', icon: <Sparkles className="w-5 h-5 text-amber-500" /> },
        ];
      case 'student':
        return [
          { id: 'student-dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'timetable', label: 'Schedule', icon: <CalendarDays className="w-5 h-5" /> },
          { id: 'academics', label: 'Results', icon: <Award className="w-5 h-5" /> },
          { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-5 h-5" /> },
          { id: 'ai-assistant', label: 'AI Study', icon: <Sparkles className="w-5 h-5 text-amber-500" /> },
        ];
      case 'teacher':
        return [
          { id: 'teacher-dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'attendance', label: 'Roll Call', icon: <CalendarCheck className="w-5 h-5" /> },
          { id: 'academics', label: 'CCE Marks', icon: <Award className="w-5 h-5" /> },
          { id: 'timetable', label: 'Schedule', icon: <CalendarDays className="w-5 h-5" /> },
          { id: 'ai-assistant', label: 'AI Remarks', icon: <Sparkles className="w-5 h-5 text-amber-500" /> },
        ];
      case 'admin':
      default:
        return [
          { id: 'admin-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'directory', label: 'Directory', icon: <Users className="w-5 h-5" /> },
          { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-5 h-5" /> },
          { id: 'notices', label: 'Notices', icon: <Bell className="w-5 h-5" /> },
          { id: 'menu', label: 'More', icon: <Menu className="w-5 h-5 text-slate-600" />, isMenuTrigger: true },
        ];
    }
  };

  const items = getBottomNavItems();

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-bottom"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.isMenuTrigger) {
                  onOpenMenu();
                } else {
                  setCurrentTab(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-150 min-h-[46px] relative ${
                isActive
                  ? 'text-[#002147] font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50 text-[#002147] scale-110 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-1.5 h-1.5 bg-[#002147] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
