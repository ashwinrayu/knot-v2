import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, Lock } from 'lucide-react';
import { KnotLogo } from '../components/ui/KnotLogo';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-800">
      
      {/* Top sticky marketing header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md py-4 px-6 md:px-12 flex justify-between items-center select-none shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <Link to="/">
          <KnotLogo height={110} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-indigo-600 transition-colors">About</Link>
          <Link to="/transfer-credits" className="hover:text-indigo-600 transition-colors">Transfer Credits</Link>
          <Link to="/faq" className="hover:text-indigo-600 transition-colors">FAQ</Link>
          <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
        </nav>

        {/* Portal access CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  if (user?.role === 'student') navigate('/student/dashboard');
                  else if (user?.role === 'staff') navigate('/admin/dashboard');
                  else if (user?.role === 'sysadmin') navigate('/admin/dashboard'); // fallback
                }}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors bg-white shadow-sm flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5" />
                My Workspace
              </button>
              <button
                onClick={logout}
                className="px-3.5 py-2 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl text-xs font-semibold transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/staff-login"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                Staff Access
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-6 space-y-5 text-xs font-bold uppercase tracking-wider text-slate-500 select-none">
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={handleNavClick} className="hover:text-indigo-600">Home</Link>
            <Link to="/about" onClick={handleNavClick} className="hover:text-indigo-600">About</Link>
            <Link to="/transfer-credits" onClick={handleNavClick} className="hover:text-indigo-600">Transfer Credits</Link>
            <Link to="/faq" onClick={handleNavClick} className="hover:text-indigo-600">FAQ</Link>
            <Link to="/contact" onClick={handleNavClick} className="hover:text-indigo-600">Contact</Link>
          </div>
          <div className="border-t border-slate-100 pt-5 flex flex-col gap-3 font-semibold text-xs">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user?.role === 'student') navigate('/student/dashboard');
                  else navigate('/admin/dashboard');
                }}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-center"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/staff-login" onClick={handleNavClick} className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-center">
                  Staff Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Primary content area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Institutional footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 md:px-12 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="h-7 w-7 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-xs">
                K
              </div>
              <span className="font-display font-black text-white tracking-tight">Knot</span>
            </div>
            <p className="text-slate-450 leading-relaxed font-semibold">
              State-of-the-art Transfer Evaluation software mapping partner college syllabuses with semantic vectors instantly.
            </p>
          </div>

          <div className="space-y-3 font-semibold">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Institution Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/transfer-credits" className="hover:text-white transition-colors">Transfer Matrix</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Staff Directory</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ Support</Link></li>
            </ul>
          </div>

          <div className="space-y-3 font-semibold">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Programs Mapping</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">B.S. in Computer Science</a></li>
              <li><a href="#" className="hover:text-white transition-colors">B.S. in Business Admin</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mechanical Engineering</a></li>
            </ul>
          </div>

          <div className="space-y-3 font-semibold">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Security Layer</h4>
            <p className="text-slate-450 leading-relaxed">
              Protected by TLS encryption. Verified FERPA compliance mapping boundaries.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 font-semibold flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Knot University. All rights reserved. Self-service credit mapper.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-350">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-350">Terms of Use</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
