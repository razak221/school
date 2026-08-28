import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './pages/AdminDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { ParentDashboard } from './pages/ParentDashboard';
import { AttendanceManager } from './pages/AttendanceManager';
import { AcademicsReportCard } from './pages/AcademicsReportCard';
import { NoticeBoard } from './pages/NoticeBoard';
import { GrantsAndFunds } from './pages/GrantsAndFunds';
import { AIAssistant } from './pages/AIAssistant';
import { SystemDiagnostics } from './pages/SystemDiagnostics';
import { TimetableManager } from './pages/TimetableManager';
import { Directory } from './pages/Directory';
import { FinanceManager } from './pages/FinanceManager';
import { LoginPage } from './pages/LoginPage';
import { PublicPortal } from './pages/PublicPortal';

const AppContent: React.FC = () => {
  const { user, token, activeRole, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('admin-dashboard');
  const [showLogin, setShowLogin] = useState<boolean>(
    typeof window !== 'undefined' && (window.location.pathname === '/admin' || window.location.pathname === '/login')
  );

  // Sync tab with role when user signs in or role changes
  React.useEffect(() => {
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
    if (showLogin) {
      return <LoginPage onBackToPublic={() => setShowLogin(false)} />;
    }
    return <PublicPortal onOpenLogin={() => setShowLogin(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col font-sans">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="flex-1 flex flex-col md:flex-row max-w-[1440px] w-full mx-auto">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {renderContent()}
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
