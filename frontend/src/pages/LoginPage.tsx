import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  GraduationCap,
  Shield,
  UserCheck,
  Users,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  BookOpen,
  Utensils,
  Wallet,
} from 'lucide-react';

interface LoginPageProps {
  initialAdminMode?: boolean;
  onBackToPublic?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialAdminMode = false, onBackToPublic }) => {
  const { login } = useAuth();
  const [isAdminMode, setIsAdminMode] = useState<boolean>(
    initialAdminMode || (typeof window !== 'undefined' && window.location.pathname === '/admin')
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAdminMode) {
      setSelectedRole('admin');
    } else if (selectedRole === 'admin') {
      setSelectedRole('teacher');
    }
  }, [isAdminMode]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'admin') {
      setIsAdminMode(true);
      window.history.replaceState(null, '', '/admin');
    } else {
      setIsAdminMode(false);
      window.history.replaceState(null, '', '/');
    }
  };

  const handleToggleAdminMode = (enableAdmin: boolean) => {
    setIsAdminMode(enableAdmin);
    setErrorMsg(null);
    if (enableAdmin) {
      handleRoleSelect('admin');
    } else {
      handleRoleSelect('teacher');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter your registered username/email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const success = await login(username.trim(), password.trim());
      if (!success) {
        setErrorMsg('Invalid login credentials. Please check your username and password.');
      }
    } catch {
      setErrorMsg('An unexpected connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = (u: string, p: string, role?: UserRole) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg(null);
    if (role === 'admin') {
      setIsAdminMode(true);
      setSelectedRole('admin');
    } else if (role) {
      setIsAdminMode(false);
      setSelectedRole(role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] via-[#e2eaf2] to-[#d8e3ed] flex flex-col justify-between font-sans selection:bg-[#9ae1ff] selection:text-[#002147]">
      {/* Top institution bar */}
      <div className="bg-[#002147] text-white px-4 lg:px-8 py-2.5 shadow-md flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Govt Middle School Awanpora</span>
          <span className="hidden sm:inline text-slate-300">• Zone Mattan, Dist. Anantnag</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-300 font-mono hidden md:inline">UDISE: 01061102301</span>
          {onBackToPublic && (
            <button
              type="button"
              onClick={onBackToPublic}
              className="text-xs text-amber-300 hover:text-white font-bold transition-colors flex items-center gap-1"
            >
              ← Public School Portal
            </button>
          )}
          {isAdminMode ? (
            <button
              type="button"
              onClick={() => handleToggleAdminMode(false)}
              className="text-xs text-slate-300 hover:text-white underline transition-colors"
            >
              Portal Mode
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleToggleAdminMode(true)}
              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition-all shadow-sm flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Admin Portal (/admin)
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-stretch">
          {/* Left Hero / Info Branding Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#002147] via-[#09325e] to-[#0c6780] rounded-t-3xl lg:rounded-3xl p-6 lg:p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Watermark badge */}
            <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
              <GraduationCap className="w-64 h-64" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
                {isAdminMode ? <Shield className="w-8 h-8" /> : <GraduationCap className="w-8 h-8" />}
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-[#002147] font-sans">
                  {isAdminMode ? 'Administrative Console' : 'School ERP Portal'}
                </span>
                <h1 className="text-xl lg:text-2xl font-black tracking-tight mt-2 text-white leading-snug">
                  Govt Middle School Awanpora
                </h1>
                <p className="text-xs text-slate-200 mt-1">
                  Samagra Shiksha Abhiyan (SSA) • Zone Mattan, Anantnag, J&K
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <BookOpen className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Continuous Evaluation (CCE):</span> SCERT J&K pattern report cards with AI remarks.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <Utensils className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">PM-POSHAN Tracker:</span> Daily Mid-Day Meal distribution and attendance.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <Wallet className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">SSA Grants & Schemes:</span> Transparent composite grants & free uniforms.
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom footnote */}
            <div className="pt-6 border-t border-white/10 relative z-10 flex items-center justify-between text-[11px] text-slate-300">
              <span>Academic Year 2026-27</span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300" /> Powered by Gemini
              </span>
            </div>
          </div>

          {/* Right Login Action Panel */}
          <div className="lg:col-span-7 bg-white rounded-b-3xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              {/* Top Banner to switch to public website */}
              {onBackToPublic && (
                <div className="mb-4 p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600 font-medium">Looking for the public school website?</span>
                  <button
                    type="button"
                    onClick={onBackToPublic}
                    className="px-2.5 py-1 rounded-lg bg-[#002147] hover:bg-[#0c6780] text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1"
                  >
                    <span>Visit Public Portal →</span>
                  </button>
                </div>
              )}

              {/* Header Title */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-[#002147]">
                    {isAdminMode ? 'Headmaster / Admin Sign In' : 'Sign In to School Portal'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isAdminMode
                      ? 'Secure administrative portal for Headmaster & Staff In-charge'
                      : 'Choose your role or enter your credentials below'}
                  </p>
                </div>
              </div>

              {/* Role Selection Tabs (for non-admin or toggle) */}
              {!isAdminMode ? (
                <div className="space-y-3 mb-5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Select Your Role:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('teacher')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        selectedRole === 'teacher'
                          ? 'bg-[#0c6780] text-white border-[#0c6780] shadow-md scale-[1.02]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span className="text-xs font-bold">Teacher</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRoleSelect('parent')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        selectedRole === 'parent'
                          ? 'bg-[#FF8C00] text-white border-[#FF8C00] shadow-md scale-[1.02]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-bold">Parent</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRoleSelect('student')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        selectedRole === 'student'
                          ? 'bg-[#22C55E] text-white border-[#22C55E] shadow-md scale-[1.02]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-xs font-bold">Student</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-5 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#002147]">
                    <Shield className="w-4 h-4 text-[#0c6780]" />
                    <span>Administrator Route Active (/admin)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleAdminMode(false)}
                    className="text-[11px] font-bold text-[#0c6780] hover:underline"
                  >
                    Switch to Teacher/Parent
                  </button>
                </div>
              )}

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Quick Fill Demo Credentials */}
              <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[11px] font-bold text-slate-600">Quick Test Credentials:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleAutoFill('admin@me', 'admin123', 'admin')}
                    className="px-2 py-1 rounded-lg bg-[#002147] hover:bg-[#0c6780] text-white text-[10px] font-bold shadow-xs transition-all flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3 text-amber-300" />
                    <span>Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAutoFill('teacher@gms.edu', 'teacher123', 'teacher')}
                    className="px-2 py-1 rounded-lg bg-[#0c6780] hover:bg-[#095469] text-white text-[10px] font-bold shadow-xs transition-all flex items-center gap-1"
                  >
                    <UserCheck className="w-3 h-3 text-white" />
                    <span>Teacher</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAutoFill('parent@gms.edu', 'parent123', 'parent')}
                    className="px-2 py-1 rounded-lg bg-[#FF8C00] hover:bg-[#ea580c] text-white text-[10px] font-bold shadow-xs transition-all flex items-center gap-1"
                  >
                    <Users className="w-3 h-3 text-white" />
                    <span>Parent</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAutoFill('student@gms.edu', 'student123', 'student')}
                    className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-xs transition-all flex items-center gap-1"
                  >
                    <GraduationCap className="w-3 h-3 text-white" />
                    <span>Student</span>
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                    Username / Email Address
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username or email address"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:bg-white focus:outline-none transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0c6780] focus:bg-white focus:outline-none transition-all font-medium text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#002147] hover:bg-[#0c6780] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In as {isAdminMode ? 'Headmaster' : selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Role Switcher Helper */}
            <div className="mt-5 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              {!isAdminMode ? (
                <span>
                  Are you the School Headmaster or Admin?{' '}
                  <button
                    type="button"
                    onClick={() => handleToggleAdminMode(true)}
                    className="font-bold text-[#002147] hover:underline"
                  >
                    Use Admin Login (/admin)
                  </button>
                </span>
              ) : (
                <span>
                  Staff member, student or parent?{' '}
                  <button
                    type="button"
                    onClick={() => handleToggleAdminMode(false)}
                    className="font-bold text-[#0c6780] hover:underline"
                  >
                    Back to General Portal (Teacher/Parent/Student)
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 text-[11px] text-slate-500">
        Govt Middle School Awanpora • Zone Mattan, District Anantnag, Jammu & Kashmir • UDISE 01061102301
      </footer>
    </div>
  );
};
