import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from '../components/ui/ToastContainer';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, GitPullRequest, Database, Library, 
  Globe, Users, Settings, LogOut, Search, Bell, ChevronDown, 
  Menu, X, Sparkles, FolderKanban, BarChart3, ShieldCheck
} from 'lucide-react';
import { KnotLogo } from '../components/ui/KnotLogo';

export const AdminLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      
      {/* Top Banner Warning for demo role changes */}
      <div className="bg-indigo-900 text-white text-[11px] font-semibold py-1.5 px-6 flex justify-between items-center z-50 print:hidden">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-indigo-300 animate-pulse" />
          <span>Role Sandbox: Test interface as different admissions officers.</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Active Role:</span>
          <select
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
            className="bg-indigo-800 text-white rounded border border-indigo-750 text-[10px] px-2 py-0.5 focus:outline-none cursor-pointer font-bold"
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
        <aside className="w-64 bg-slate-900 text-slate-350 flex flex-col border-r border-slate-800 hidden lg:flex flex-shrink-0 z-30 print:hidden">
          {/* Logo & College branding */}
          <div className="p-5 border-b border-slate-800 flex items-center">
            <KnotLogo height={52} invert={true} />
          </div>

          {/* Sidebar Menu Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto font-semibold text-[11px] uppercase tracking-wider select-none text-slate-400">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-650 text-white font-extrabold shadow-sm' 
                      : 'hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                  <span className="capitalize">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-850 space-y-3">
            <div className="flex items-center gap-3">
              <img src={currentUser.avatar} alt="" className="h-8 w-8 rounded-full border border-slate-750 object-cover" />
              <div className="truncate text-xs font-semibold">
                <span className="text-white font-bold block">{currentUser.name}</span>
                <span className="text-[9px] text-slate-500 capitalize block mt-0.5">{currentUser.role} Profile</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </aside>

        {/* ==========================================
            MAIN CONTENT AREA
           ========================================== */}
        <div className="flex-grow flex flex-col min-w-0">
          {/* Header Dashboard Nav */}
          <header className="h-14 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 md:px-8 flex justify-between items-center select-none z-20 sticky top-0 print:hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 border border-slate-200 rounded-lg text-slate-600 mr-2"
              >
                <Menu className="h-4 w-4" />
              </button>
              <span>Workspace</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-850 font-black">{activeLabel}</span>
            </div>

            {/* Quick Actions & Profiles */}
            <div className="flex items-center gap-3">
              {/* Search Shortcut */}
              <button 
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:border-slate-350 rounded-xl bg-slate-50/50 hover:bg-white text-[10px] text-slate-405 font-bold shadow-sm transition-all"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search...</span>
                <kbd className="bg-slate-200 border border-slate-300 rounded px-1.5 py-0.5 text-[8px] font-mono">Ctrl+K</kbd>
              </button>

              {/* Notification Center */}
              <div className="relative">
                <button 
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl relative shadow-xs"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 ring-2 ring-white" />
                  )}
                </button>

                <AnimatePresence>
                  {notifDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4"
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b pb-2 mb-2 select-none">
                        Notifications Inbox ({notifications.length})
                      </span>
                      {notifications.length === 0 ? (
                        <p className="text-[10px] text-slate-400 italic text-center py-6 select-none font-semibold">No recent alerts</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                          {notifications.map(notif => (
                            <div key={notif.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between gap-1 leading-normal font-semibold">
                              <div>
                                <span className="font-bold text-slate-700 block">{notif.text}</span>
                                <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">{notif.time}</span>
                              </div>
                              <button onClick={() => clearNotification(notif.id)} className="text-slate-400 hover:text-slate-600 self-start p-0.5"><X className="h-3 w-3" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Active Profile dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1 focus:outline-none"
                >
                  <img src={currentUser.avatar} alt="" className="h-8 w-8 rounded-full border object-cover" />
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-xs font-semibold">
                    <span className="block px-3 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest select-none">Switch Officer Profile</span>
                    {systemUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                          currentUser.id === u.id 
                            ? 'bg-indigo-50/60 text-indigo-700 font-extrabold' 
                            : 'hover:bg-slate-50 text-slate-650'
                        }`}
                      >
                        {u.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* ==========================================
          MOBILE DRAWER SIDEBAR
         ========================================== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-slate-900 text-slate-300 flex flex-col p-6 z-10 select-none">
            <div className="flex justify-between items-center mb-6">
              <KnotLogo height={72} invert={true} />
              <button onClick={() => setSidebarOpen(false)} className="p-1 border border-slate-700 text-slate-400 rounded"><X className="h-4 w-4" /></button>
            </div>
            
            <nav className="flex-1 space-y-1 overflow-y-auto font-semibold text-[11px] uppercase tracking-wider text-slate-400">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-slate-200 transition-colors"
                >
                  {item.icon}
                  <span className="capitalize">{item.label}</span>
                </Link>
              ))}
            </nav>

            <button onClick={handleLogout} className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </aside>
        </div>
      )}

      {/* ==========================================
          GLOBAL COMMAND PALETTE DIALOG (Ctrl+K)
         ========================================== */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-900/60 backdrop-blur-xs pt-[15vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs font-semibold"
            >
              {/* Input */}
              <div className="p-4 border-b flex items-center gap-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search evaluations, leads, catalog entries..."
                  className="flex-grow focus:outline-none text-sm font-medium bg-transparent"
                />
                <button onClick={() => setCommandPaletteOpen(false)} className="text-[10px] text-slate-400 border rounded px-1.5 py-0.5">ESC</button>
              </div>

              {/* Suggestions */}
              <div className="p-4 max-h-64 overflow-y-auto space-y-4">
                {searchQuery ? (
                  <>
                    {/* Evaluations matches */}
                    {filteredEvaluations.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Evaluations matches</span>
                        {filteredEvaluations.map(e => (
                          <div 
                            key={e.id} 
                            onClick={() => handlePaletteSelect(`/admin/evaluations/${e.id}`)}
                            className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex justify-between"
                          >
                            <span>{e.studentName} ({e.sendingInstitution})</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{e.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Leads matches */}
                    {filteredLeads.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Leads CRM matches</span>
                        {filteredLeads.map(l => (
                          <div 
                            key={l.id} 
                            onClick={() => handlePaletteSelect('/admin/leads')}
                            className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex justify-between"
                          >
                            <span>{l.studentName} ({l.studentProgram})</span>
                            <span className="text-[10px] text-indigo-500 font-bold">Score: {l.leadScore}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {filteredEvaluations.length === 0 && filteredLeads.length === 0 && (
                      <p className="text-center text-slate-400 italic py-6">No matching queries found.</p>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Quick Navigation Shortcuts</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {navItems.slice(0, 6).map(item => (
                        <div
                          key={item.label}
                          onClick={() => handlePaletteSelect(item.path)}
                          className="p-2 border rounded-xl hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                        >
                          {item.icon}
                          <span className="capitalize">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Alert containers */}
      <ToastContainer />

    </div>
  );
};
