import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAppState } from '@/context/AppStateContext';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, GitPullRequest, Database, Library, 
  Globe, Users, Settings, LogOut, Search, Bell, ChevronDown, 
  Menu, X, Sparkles, FolderKanban, BarChart3, ShieldCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { 
    institution, currentUser, systemUsers, switchUser, 
    notifications, clearNotification, evaluations, leads 
  } = useAppState();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keypress listener for Command Palette (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Review Center', path: '/admin/review', icon: <GitPullRequest className="h-4 w-4" /> },
    { label: 'Transcript Evaluations', path: '/admin/evaluations', icon: <FileText className="h-4 w-4" /> },
    { label: 'Knowledge Base', path: '/admin/knowledge-base', icon: <Database className="h-4 w-4" /> },
    { label: 'Course Catalog', path: '/admin/catalog', icon: <Library className="h-4 w-4" /> },
    { label: 'Website Scraper', path: '/admin/scraper', icon: <Globe className="h-4 w-4" /> },
    { label: 'Student Leads (CRM)', path: '/admin/leads', icon: <FolderKanban className="h-4 w-4" /> },
    { label: 'Student Reports', path: '/admin/reports', icon: <FileText className="h-4 w-4" /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Users & Audit Logs', path: '/admin/users', icon: <ShieldCheck className="h-4 w-4" /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  // Get active navigation label for breadcrumbs
  const currentNav = navItems.find(item => pathname.startsWith(item.path));
  const activeLabel = currentNav ? currentNav.label : 'Admin Portal';

  // Command palette search items
  const filteredEvaluations = searchQuery
    ? evaluations.filter(e => e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || e.sendingInstitution.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredLeads = searchQuery
    ? leads.filter(l => l.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || l.sendingInstitution.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handlePaletteSelect = (path: string) => {
    setCommandPaletteOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      
      {/* Top Banner Warning for demo role changes */}
      <div className="bg-indigo-900 text-white text-[11px] font-semibold py-1.5 px-6 flex justify-between items-center z-50 print:hidden">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-indigo-300" />
          <span>Role Sandbox: Test interface as different admissions officers.</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Active Role:</span>
          <select
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
            className="bg-indigo-800 text-white rounded border border-indigo-700 text-[10px] px-2 py-0.5 focus:outline-none cursor-pointer"
          >
            {systemUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role.toUpperCase()})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* ==========================================
            SIDEBAR (DESKTOP)
           ========================================== */}
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 hidden lg:flex flex-shrink-0 z-30 print:hidden">
          {/* Logo & College branding */}
          <div className="p-6 border-b border-slate-850 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              K
            </div>
            <div>
              <span className="font-display font-bold text-white tracking-tight block leading-none">Knot</span>
              <span className="text-[10px] text-slate-500 mt-1 block tracking-wider">{institution.name}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map(item => {
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-slate-800 text-white shadow-sm border-l-2 border-indigo-500' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer / Current Impersonator indicator */}
          <div className="p-4 border-t border-slate-850 bg-slate-950/40 text-xs">
            <div className="flex items-center gap-2.5">
              <img src={currentUser.avatar} alt="" className="h-7 w-7 rounded-full object-cover border border-slate-700" />
              <div className="truncate">
                <p className="font-semibold text-white leading-none">{currentUser.name}</p>
                <span className="text-[9px] text-slate-500 capitalize">{currentUser.role}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ==========================================
            MOBILE SIDEBAR
           ========================================== */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Overlay background */}
              <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-105%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 bottom-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col z-50 lg:hidden shadow-2xl"
              >
                <div className="p-6 border-b border-slate-850 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
                      K
                    </div>
                    <span className="font-display font-bold text-white tracking-tight">Knot</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                  {navItems.map(item => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive 
                            ? 'bg-slate-800 text-white' 
                            : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="p-4 border-t border-slate-850 bg-slate-950/20">
                  <div className="flex items-center gap-3">
                    <img src={currentUser.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-white text-xs">{currentUser.name}</p>
                      <span className="text-[10px] text-slate-500 capitalize">{currentUser.role}</span>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ==========================================
            MAIN CONTENT AREA
           ========================================== */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Navbar */}
          <header className="sticky top-0 bg-white border-b border-slate-200/80 z-20 px-6 py-3.5 flex justify-between items-center print:hidden">
            {/* Mobile menu trigger + Breadcrumb */}
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-950">
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Link to="/admin/dashboard" className="hover:text-indigo-600">Admin</Link>
                <span>/</span>
                <span className="text-slate-800">{activeLabel}</span>
              </div>
            </div>

            {/* Topbar Utility Actions */}
            <div className="flex items-center gap-4">
              
              {/* Search triggers Command Palette */}
              <button 
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-xl bg-slate-50/50 hover:bg-slate-50 text-slate-400 text-xs transition-all w-48 text-left"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search...</span>
                <kbd className="ml-auto bg-white px-1.5 py-0.5 rounded border text-[9px] text-slate-400 font-sans shadow-sm font-semibold select-none">
                  Ctrl K
                </kbd>
              </button>

              {/* Notifications Center */}
              <div className="relative">
                <button 
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 relative transition-all"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-indigo-600 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown Drawer */}
                <AnimatePresence>
                  {notifDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setNotifDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.1 } }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-40 p-4"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">System Alerts</h4>
                          <span className="text-[10px] text-indigo-600 font-semibold">{notifications.length} Pending</span>
                        </div>
                        <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-4">No recent notifications.</p>
                          ) : (
                            notifications.map(notif => (
                              <div key={notif.id} className="py-2.5 flex justify-between gap-3 text-xs items-start">
                                <div>
                                  <p className="text-slate-700 font-medium">{notif.text}</p>
                                  <span className="text-[9px] text-slate-400 block mt-0.5">{notif.time}</span>
                                </div>
                                <button 
                                  onClick={() => clearNotification(notif.id)} 
                                  className="text-[9px] font-semibold text-rose-500 hover:text-rose-700 flex-shrink-0"
                                >
                                  Dismiss
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Public Portal Link */}
              <Link 
                to="/" 
                className="text-xs font-bold px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl shadow-sm transition-all"
              >
                Go to Public Site
              </Link>
            </div>
          </header>

          {/* Main Workspace Frame */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Notifications Toasts overlay */}
      <ToastContainer />

      {/* ==========================================
          GLOBAL COMMAND PALETTE DIALOG (MODAL)
         ========================================== */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students, schools, courses, or type actions..."
                  className="bg-transparent border-none text-slate-800 text-sm focus:outline-none flex-grow"
                />
                <button 
                  onClick={() => setCommandPaletteOpen(false)}
                  className="text-xs font-semibold px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 shadow-sm"
                >
                  ESC
                </button>
              </div>

              <div className="p-2 max-h-80 overflow-y-auto bg-slate-50/50">
                {searchQuery === '' ? (
                  <div className="p-3 text-xs text-slate-400 space-y-3">
                    <p className="font-bold text-slate-500 uppercase tracking-wider">Quick Actions</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      <button onClick={() => handlePaletteSelect('/admin/dashboard')} className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 text-left font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all">
                        <LayoutDashboard className="h-3.5 w-3.5 text-slate-400" />
                        Go to Dashboard
                      </button>
                      <button onClick={() => handlePaletteSelect('/admin/review')} className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 text-left font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all">
                        <GitPullRequest className="h-3.5 w-3.5 text-slate-400" />
                        Review Center
                      </button>
                      <button onClick={() => handlePaletteSelect('/admin/scraper')} className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 text-left font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all">
                        <Globe className="h-3.5 w-3.5 text-slate-400" />
                        Course Scraper
                      </button>
                      <button onClick={() => handlePaletteSelect('/admin/leads')} className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 text-left font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        CRM leads pipeline
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Evaluations Matches */}
                    {filteredEvaluations.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">Evaluations ({filteredEvaluations.length})</p>
                        <div className="space-y-1">
                          {filteredEvaluations.map(e => (
                            <button
                              key={e.id}
                              onClick={() => handlePaletteSelect(`/admin/evaluations/${e.id}`)}
                              className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-100 hover:border-indigo-300 text-xs transition-colors flex justify-between items-center"
                            >
                              <div>
                                <span className="font-semibold text-slate-800">{e.studentName}</span>
                                <span className="text-[10px] text-slate-400 block">{e.sendingInstitution}</span>
                              </div>
                              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full capitalize font-medium text-slate-600">{e.status.replace('_', ' ')}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Leads Matches */}
                    {filteredLeads.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">CRM Leads ({filteredLeads.length})</p>
                        <div className="space-y-1">
                          {filteredLeads.map(l => (
                            <button
                              key={l.id}
                              onClick={() => handlePaletteSelect(`/admin/leads`)}
                              className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-100 hover:border-indigo-300 text-xs transition-colors flex justify-between items-center"
                            >
                              <div>
                                <span className="font-semibold text-slate-800">{l.studentName}</span>
                                <span className="text-[10px] text-slate-400 block">{l.studentProgram} • Mapped score: {l.leadScore}</span>
                              </div>
                              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full capitalize font-medium">{l.status}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredEvaluations.length === 0 && filteredLeads.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6">No matching records found for "{searchQuery}".</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
