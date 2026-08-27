import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  GraduationCap,
  Users,
  UserCheck,
  Sparkles,
  LogOut,
  MessageSquarePlus,
} from 'lucide-react';
import { ChangelogModal } from './ChangelogModal';
import { BetaFeedbackModal } from './BetaFeedbackModal';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, activeRole, logout } = useAuth();
  const [showChangelog, setShowChangelog] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const getRoleBadge = () => {
    switch (activeRole) {
      case 'admin':
        return {
          label: 'Headmaster / Admin',
          icon: <Shield className="w-3.5 h-3.5" />,
          badgeClass: 'bg-[#002147] text-white',
        };
      case 'teacher':
        return {
          label: 'Teaching Faculty',
          icon: <UserCheck className="w-3.5 h-3.5" />,
          badgeClass: 'bg-[#0c6780] text-white',
        };
      case 'parent':
        return {
          label: 'Parent Portal',
          icon: <Users className="w-3.5 h-3.5" />,
          badgeClass: 'bg-[#FF8C00] text-white',
        };
      case 'student':
        return {
          label: 'Student Portal',
          icon: <GraduationCap className="w-3.5 h-3.5" />,
          badgeClass: 'bg-[#22C55E] text-white',
        };
      default:
        return {
          label: 'School Portal',
          icon: <Shield className="w-3.5 h-3.5" />,
          badgeClass: 'bg-slate-800 text-white',
        };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-2.5 transition-all shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Left: School Branding & Beta Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002147] to-[#0c6780] flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-[#002147] tracking-tight leading-none">
                Govt Middle School Awanpora
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-blue-50 text-[#0c6780] border border-blue-200">
                SSA Salia
              </span>
              <button
                type="button"
                onClick={() => setShowChangelog(true)}
                className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300 transition-all flex items-center gap-1 shadow-xs"
                title="View Release Notes (v1.0.0 Production)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                v1.0.0 Live
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 hidden sm:block">
              Zone Mattan • District Anantnag, J&K (UDISE: 01050200101)
            </p>
          </div>
        </div>

        {/* Right: Actions, Role Badge & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Beta Feedback Button */}
          <button
            type="button"
            onClick={() => setShowFeedback(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
            title="Submit Beta Feedback or Bug Report"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-amber-600" />
            <span>Feedback</span>
          </button>

          {/* Active Role Indicator Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${roleInfo.badgeClass}`}>
            {roleInfo.icon}
            <span className="hidden sm:inline">{roleInfo.label}</span>
            <span className="sm:hidden uppercase">{activeRole}</span>
          </div>

          {/* AI Assistant Quick Button */}
          <button
            onClick={() => setCurrentTab('ai-assistant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              currentTab === 'ai-assistant'
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span className="hidden md:inline">Gemini AI</span>
          </button>

          {/* User Profile & Sign Out Button */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-[#002147] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[130px]">
                {user?.name}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">{user?.role}</div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors border border-slate-200/80 text-xs font-bold ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
      {showFeedback && <BetaFeedbackModal onClose={() => setShowFeedback(false)} />}
    </header>
  );
};
