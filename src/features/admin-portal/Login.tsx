import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppState } from '@/context/AppStateContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { systemUsers, switchUser, triggerSystemNotification } = useAppState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login checks
    setTimeout(() => {
      // Find user by email or fallback to admin
      const user = systemUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || systemUsers[0];
      switchUser(user.id);
      setIsLoading(false);
      triggerSystemNotification(`Signed in as ${user.name}`, 'success');
      navigate('/admin/dashboard');
    }, 800);
  };

  const handleQuickLogin = (userId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      switchUser(userId);
      const user = systemUsers.find(u => u.id === userId);
      setIsLoading(false);
      if (user) {
        triggerSystemNotification(`Signed in as ${user.name}`, 'success');
      }
      navigate('/admin/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch font-sans">
      
      {/* Left: Product Showcase Banner */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-indigo-900 to-slate-950" />
        
        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            K
          </div>
          <span className="font-display font-bold text-white tracking-tight">KNOT</span>
        </div>

        {/* Center Quote/Graphics */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Engine Node v2.0
          </div>
          <h2 className="text-3xl font-display font-black leading-tight tracking-tight">
            Institutional credit automation, simplified.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Nurture transfer paths, compile semantic course mappings, and publish finalized credit evaluations in minutes instead of weeks.
          </p>
        </div>

        {/* Bottom copyright */}
        <span className="text-[10px] text-slate-500 relative z-10">
          © 2026 Knot University. All rights reserved. Secure OAuth2 access layer.
        </span>
      </div>

      {/* Right: Login Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative">
        <Link 
          to="/" 
          className="absolute top-6 left-6 text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1.5 font-bold transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Student Portal
        </Link>

        <div className="max-w-sm w-full space-y-8">
          <div>
            <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Staff Sign In</h1>
            <p className="text-xs text-slate-400 mt-1">Provide your credentials to access the admissions review center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-500 uppercase mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@knot.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-all bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 uppercase mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-all bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {isLoading ? 'Signing In...' : 'Access Workspace'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Login profiles */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick Log-In Sandbox Profiles
            </span>
            <div className="grid grid-cols-1 gap-2">
              {systemUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleQuickLogin(user.id)}
                  disabled={isLoading}
                  className="w-full p-2.5 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/10 rounded-xl text-[11px] font-semibold text-slate-650 transition-all flex items-center gap-3 text-left"
                >
                  <img src={user.avatar} alt="" className="h-6 w-6 rounded-full object-cover border" />
                  <div>
                    <span className="text-slate-800 font-bold block">{user.name}</span>
                    <span className="text-[9px] text-slate-400 capitalize block leading-none mt-0.5">{user.role} Profile</span>
                  </div>
                  <ShieldCheck className="h-4 w-4 text-indigo-500 ml-auto opacity-0 hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
