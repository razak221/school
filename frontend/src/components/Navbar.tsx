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
  Globe,
  Menu,
} from 'lucide-react';
import { ChangelogModal } from './ChangelogModal';
import { BetaFeedbackModal } from './BetaFeedbackModal';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onToggleMobileMenu }) => {
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-4 lg:px-8 py-2 transition-all shadow-xs">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Hamburger (Mobile) + School Branding */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              aria-label="Open Navigation Menu"
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#002147] min-h-[40px] min-w-[40px] flex items-center justify-center transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#002147] to-[#0c6780] flex items-center justify-center text-white shadow-md shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-bold text-xs sm:text-base text-[#002147] tracking-tight leading-tight truncate max-w-[140px] sm:max-w-none">
                GMS Awanpora
              </h1>
              <span className="hidden xs:inline px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase rounded-full bg-blue-50 text-[#0c6780] border border-blue-200">
                Zone Mattan
              </span>
              <button
                type="button"
                onClick={() => setShowChangelog(true)}
                className="hidden sm:flex px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300 transition-all items-center gap-1 shadow-xs"
                title="Official Session 2026-27 Production Portal"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Session 2026-27
              </button>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">
              Zone Mattan • District Anantnag, J&K (UDISE: 01061102301)
            </p>
          </div>
        </div>

        {/* Right: Actions, Role Badge & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Public Portal Button */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#002147] text-xs font-semibold border border-slate-200 transition-all"
            title="Open Public School Website in New Tab"
          >
            <Globe className="w-3.5 h-3.5 text-[#0c6780]" />
            <span>Public Site</span>
          </a>

          {/* Support & Feedback Button */}
          <button
            type="button"
            onClick={() => setShowFeedback(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
            title="School Support & Feedback Desk"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-amber-600" />
            <span>Support Desk</span>
          </button>

          {/* Active Role Indicator Badge */}
          <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold shadow-xs ${roleInfo.badgeClass}`}>
            {roleInfo.icon}
            <span className="hidden sm:inline">{roleInfo.label}</span>
            <span className="sm:hidden uppercase text-[10px]">{activeRole}</span>
          </div>

          {/* AI Assistant Quick Button */}
          <button
            type="button"
            onClick={() => setCurrentTab('ai-assistant')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-xl border transition-all ${
              currentTab === 'ai-assistant'
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span className="hidden md:inline">Gemini AI</span>
          </button>

          {/* User Profile & Sign Out Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#002147] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[130px]">
                {user?.name}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">{user?.role}</div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors border border-slate-200/80 text-xs font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1">Sign Out</span>
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
