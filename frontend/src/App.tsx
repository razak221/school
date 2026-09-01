import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Lazy-loaded page components for optimal bundle chunking
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard').then((m) => ({ default: m.TeacherDashboard })));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard').then((m) => ({ default: m.StudentDashboard })));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard').then((m) => ({ default: m.ParentDashboard })));
const AttendanceManager = lazy(() => import('./pages/AttendanceManager').then((m) => ({ default: m.AttendanceManager })));
const AcademicsReportCard = lazy(() => import('./pages/AcademicsReportCard').then((m) => ({ default: m.AcademicsReportCard })));
const NoticeBoard = lazy(() => import('./pages/NoticeBoard').then((m) => ({ default: m.NoticeBoard })));
const GrantsAndFunds = lazy(() => import('./pages/GrantsAndFunds').then((m) => ({ default: m.GrantsAndFunds })));
const AIAssistant = lazy(() => import('./pages/AIAssistant').then((m) => ({ default: m.AIAssistant })));
const SystemDiagnostics = lazy(() => import('./pages/SystemDiagnostics').then((m) => ({ default: m.SystemDiagnostics })));
const TimetableManager = lazy(() => import('./pages/TimetableManager').then((m) => ({ default: m.TimetableManager })));
const Directory = lazy(() => import('./pages/Directory').then((m) => ({ default: m.Directory })));
const FinanceManager = lazy(() => import('./pages/FinanceManager').then((m) => ({ default: m.FinanceManager })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const PublicPortal = lazy(() => import('./pages/PublicPortal').then((m) => ({ default: m.PublicPortal })));

// Loading Skeleton Component
const PageLoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse p-2">
    <div className="h-28 bg-gradient-to-r from-slate-200 to-slate-100 rounded-3xl" />
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-24 bg-slate-200/80 rounded-2xl" />
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-24 bg-slate-200/80 rounded-2xl" />
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-24 bg-slate-200/80 rounded-2xl" />
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-24 bg-slate-200/80 rounded-2xl" />
    </div>
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-7 h-64 bg-slate-200/70 rounded-3xl" />
      <div className="col-span-12 lg:col-span-5 h-64 bg-slate-200/70 rounded-3xl" />
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { user, token, activeRole, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('admin-dashboard');
  const [showLogin, setShowLogin] = useState<boolean>(
    typeof window !== 'undefined' && (window.location.pathname === '/admin' || window.location.pathname === '/login')
  );

  // Sync tab with role when user signs in or role changes
  useEffect(() => {
    if (user?.role) {
      if (user.role === 'teacher') setCurrentTab('teacher-dashboard');
      else if (user.role === 'parent') setCurrentTab('parent-dashboard');
      else if (user.role === 'student') setCurrentTab('student-dashboard');
      else setCurrentTab('admin-dashboard');
    }
  }, [user?.role]);

  const renderContent = () => {
    switch (currentTab) {
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={setCurrentTab} />;
      case 'teacher-dashboard':
        return <TeacherDashboard onNavigate={setCurrentTab} />;
      case 'student-dashboard':
        return <StudentDashboard onNavigate={setCurrentTab} />;
      case 'parent-dashboard':
        return <ParentDashboard onNavigate={setCurrentTab} />;
      case 'directory':
        return <Directory onNavigate={setCurrentTab} />;
      case 'attendance':
        return <AttendanceManager />;
      case 'academics':
        return <AcademicsReportCard />;
      case 'timetable':
        return <TimetableManager />;
      case 'notices':
        return <NoticeBoard />;
      case 'grants':
        return <GrantsAndFunds />;
      case 'finance':
        return <FinanceManager />;
      case 'diagnostics':
        return <SystemDiagnostics />;
      case 'ai-assistant':
        return <AIAssistant />;
      default:
        if (activeRole === 'admin') return <AdminDashboard onNavigate={setCurrentTab} />;
        if (activeRole === 'teacher') return <TeacherDashboard onNavigate={setCurrentTab} />;
        if (activeRole === 'student') return <StudentDashboard onNavigate={setCurrentTab} />;
        if (activeRole === 'parent') return <ParentDashboard onNavigate={setCurrentTab} />;
        return <AdminDashboard onNavigate={setCurrentTab} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#002147] border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="font-bold text-[#002147] text-sm">Govt Middle School Awanpora</h3>
          <p className="text-xs text-slate-500">Loading School ERP Workspace...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show the public school portal by default, or the login page if requested
  if (!user || !token) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#002147] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        {showLogin ? (
          <LoginPage onBackToPublic={() => setShowLogin(false)} />
        ) : (
          <PublicPortal onOpenLogin={() => setShowLogin(true)} />
        )}
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col font-sans">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="flex-1 flex flex-col md:flex-row max-w-[1440px] w-full mx-auto">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Suspense fallback={<PageLoadingSkeleton />}>
            {renderContent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
