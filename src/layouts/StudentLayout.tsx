import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, UploadCloud, History, FileSpreadsheet, 
  HelpCircle, Settings, LogOut, Menu, Bell, User, ChevronRight, MessageSquare, X
} from 'lucide-react';
import { KnotLogo } from '../components/ui/KnotLogo';

export const StudentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Upload Transcript', path: '/student/upload', icon: <UploadCloud className="h-4 w-4" /> },
    { label: 'My Evaluations', path: '/student/evaluations', icon: <History className="h-4 w-4" /> },
    { label: 'Alternative Courses', path: '/student/alternatives', icon: <HelpCircle className="h-4 w-4" /> },
    { label: 'Reports', path: '/student/reports', icon: <FileSpreadsheet className="h-4 w-4" /> },
    { label: 'Messages', path: '/student/messages', icon: <MessageSquare className="h-4 w-4" /> },
    { label: 'Notifications', path: '/student/notifications', icon: <Bell className="h-4 w-4" /> },
    { label: 'Profile', path: '/student/profile', icon: <User className="h-4 w-4" /> },
    { label: 'Settings', path: '/student/settings', icon: <Settings className="h-4 w-4" /> }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getBreadcrumbName = (pathname: string) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return 'Home';
    return parts[parts.length - 1].replace(/-/g, ' ');
  };

  return (
    <div className="bg-slate-50 min-h-screen flex font-sans text-slate-800">
      
      {/* Sidebar - Desktop Layout */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200/80 flex-col justify-between flex-shrink-0 select-none">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <Link to="/student/dashboard">
            <KnotLogo height={96} />
          </Link>

          {/* Links list */}
          <nav className="space-y-1 font-semibold text-xs text-slate-500 uppercase tracking-wider">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-50/60 text-indigo-700 font-extrabold shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]' 
                      : 'hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {item.icon}
                  <span className="capitalize">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout info */}
        <div className="p-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <img src={user?.avatar} alt="" className="h-8.5 w-8.5 rounded-full border bg-slate-50 object-cover" />
            <div className="truncate text-xs font-semibold">
              <span className="text-slate-850 font-bold block">{user?.name}</span>
              <span className="text-[10px] text-slate-450 block truncate">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main portal grid framework */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar navigation panel */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/70 backdrop-blur-md px-6 md:px-8 py-3.5 flex justify-between items-center select-none shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 capitalize">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 border border-slate-200 rounded-lg text-slate-600 mr-2"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span>Portal</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-850 font-black">{getBreadcrumbName(location.pathname)}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell dropdown trigger */}
            <div className="relative">
              <button 
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 border border-slate-200/80 hover:bg-slate-50 text-slate-500 rounded-xl relative shadow-sm"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 ring-2 ring-white" />
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-4 text-xs font-semibold text-slate-600">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block mb-2">Recent notifications</span>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    <p className="p-2 bg-slate-50 rounded-lg text-slate-700 leading-normal">Your transcript scan for B.S. in Computer Science is complete.</p>
                  </div>
                </div>
              )}
            </div>

            <img src={user?.avatar} alt="" className="h-8 w-8 rounded-full border bg-slate-50 object-cover" />
          </div>
        </header>

        {/* Content canvas container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-6 z-10 animate-slide-right select-none">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Link to="/student/dashboard">
                  <KnotLogo height={72} />
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-1 border rounded"><X className="h-4 w-4" /></button>
              </div>

              <nav className="space-y-1 font-semibold text-xs uppercase tracking-wider text-slate-500">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                        isActive ? 'bg-indigo-50/50 text-indigo-700' : 'hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      {item.icon}
                      <span className="capitalize">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4 text-xs font-semibold">
              <div className="flex items-center gap-2.5">
                <img src={user?.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                <span className="text-slate-800 font-bold block">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-1">
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
};

