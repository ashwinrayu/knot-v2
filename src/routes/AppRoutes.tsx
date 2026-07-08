import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout wrappers
import { PublicLayout } from '../layouts/PublicLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public pages
import { HomeLanding, AboutPage, TransferCreditsPage, FAQPage, ContactPage } from '../pages/MarketingPages';

// Auth pages
import { Login } from '../features/auth/Login';
import { Register } from '../features/auth/Register';
import { VerifyEmail } from '../features/auth/VerifyEmail';
import { ForgotPassword } from '../features/auth/ForgotPassword';
import { ResetPassword } from '../features/auth/ResetPassword';

// Student Portal pages
import { StudentDashboard } from '../features/student/StudentDashboard';
import { StudentUpload } from '../features/student/StudentUpload';
import { StudentEvaluations } from '../features/student/StudentEvaluations';
import { StudentEvaluationDetail } from '../features/student/StudentEvaluationDetail';
import { StudentAlternatives } from '../features/student/StudentAlternatives';
import { StudentReports } from '../features/student/StudentReports';
import { StudentMessages } from '../features/student/StudentMessages';
import { StudentNotifications } from '../features/student/StudentNotifications';
import { StudentProfile } from '../features/student/StudentProfile';
import { StudentSettings } from '../features/student/StudentSettings';

// Admin Portal pages
import { OnboardingWizard } from '../features/onboarding/OnboardingWizard';
import { AdminDashboard } from '../features/dashboard/AdminDashboard';
import { ReviewCenter } from '../features/review/ReviewCenter';
import { TranscriptEvaluations } from '../features/evaluation/TranscriptEvaluations';
import { EvaluationWorkspace } from '../features/evaluation/EvaluationWorkspace';
import { KnowledgeBase } from '../features/knowledge-base/KnowledgeBase';
import { CourseCatalog } from '../features/catalog/CourseCatalog';
import { WebsiteScraper } from '../features/scraper/WebsiteScraper';
import { LeadPipeline } from '../features/leads/LeadPipeline';
import { StudentReports as AdminStudentReports } from '../features/reports/StudentReports';
import { AnalyticsDashboard } from '../features/analytics/AnalyticsDashboard';
import { UserManagement } from '../features/users/UserManagement';
import { SettingsPanel } from '../features/settings/SettingsPanel';

// Route Guards
const StudentGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return <div className="p-8 text-center text-xs font-bold text-slate-500">Authenticating...</div>;
  if (!isAuthenticated || user?.role !== 'student') return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return <div className="p-8 text-center text-xs font-bold text-slate-500">Authenticating...</div>;
  if (!isAuthenticated || (user?.role !== 'staff' && user?.role !== 'sysadmin')) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ==========================================
          PUBLIC WEBSITE LAYOUT & ROUTES
         ========================================== */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomeLanding />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="transfer-credits" element={<TransferCreditsPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* ==========================================
          AUTHENTICATION FLOWS
         ========================================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/staff-login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ==========================================
          PUBLIC TRANSCRIPT UPLOAD (No login required)
         ========================================== */}
      <Route path="/upload" element={<PublicLayout />}>
        <Route index element={<StudentUpload />} />
      </Route>

      {/* ==========================================
          STUDENT PORTAL SYSTEM (GUARDED)
         ========================================== */}
      <Route 
        path="/student" 
        element={
          <StudentGuard>
            <StudentLayout />
          </StudentGuard>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="upload" element={<StudentUpload />} />  {/* still accessible when logged in */}
        <Route path="evaluations" element={<StudentEvaluations />} />
        <Route path="evaluations/:id" element={<StudentEvaluationDetail />} />
        <Route path="alternatives" element={<StudentAlternatives />} />
        <Route path="reports" element={<StudentReports />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* ==========================================
          ADMIN PORTAL SYSTEM (GUARDED)
         ========================================== */}
      <Route 
        path="/admin" 
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="onboarding" element={<OnboardingWizard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="review" element={<ReviewCenter />} />
        <Route path="evaluations" element={<TranscriptEvaluations />} />
        <Route path="evaluations/:id" element={<EvaluationWorkspace />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="catalog" element={<CourseCatalog />} />
        <Route path="scraper" element={<WebsiteScraper />} />
        <Route path="leads" element={<LeadPipeline />} />
        <Route path="reports" element={<AdminStudentReports />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<SettingsPanel />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
