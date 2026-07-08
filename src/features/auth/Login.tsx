import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sparkles, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { KnotLogo } from '../../components/ui/KnotLogo';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const loggedUser = await login(email, password);
      setIsLoading(false);
      
      // Redirect staff/admin role to dashboard
      if (loggedUser.role === 'staff' || loggedUser.role === 'sysadmin') {
        navigate('/admin/dashboard');
      } else {
        setErrorMessage('Access restricted to staff members only.');
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setErrorMessage('Invalid username or password credentials.');
    }
  };

  const handleQuickLogin = async (presetEmail: string) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const loggedUser = await login(presetEmail, 'password');
      setIsLoading(false);
      if (loggedUser.role === 'staff' || loggedUser.role === 'sysadmin') {
        navigate('/admin/dashboard');
      } else {
        setErrorMessage('Access restricted to staff members only.');
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch font-sans text-slate-800">
      
      {/* Left Column: Product Showcase Banner */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-indigo-900 to-slate-950" />
        
        {/* Top Logo */}
        <Link to="/" className="relative z-10">
          <KnotLogo height={96} invert={true} />
        </Link>

        {/* Center graphics */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI Transfer Credit Network v2.0
          </div>
          <h2 className="text-3xl font-display font-black leading-tight tracking-tight">
            Seamless institutional transfer evaluation.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-semibold">
            Evaluate unofficial transcripts, mapping equivalent program modules with neural vectors in under 60 seconds.
          </p>
        </div>

        <span className="text-[10px] text-slate-500 relative z-10 font-bold uppercase tracking-wider">
          © 2026 Knot University. Standard academic integrations.
        </span>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative">
        <Link 
          to="/" 
          className="absolute top-6 left-6 text-xs text-slate-400 hover:text-indigo-650 flex items-center gap-1.5 font-bold transition-colors select-none"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home Website
        </Link>

        <div className="max-w-sm w-full space-y-6">
          <div>
            <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Staff Sign In</h1>
            <p className="text-xs text-slate-400 mt-1">Input your registrar or administrator email credentials</p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/50 text-[10px] text-rose-700 font-bold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-500 uppercase mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@articulate.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors bg-white font-semibold"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-500 uppercase">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-indigo-650 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors bg-white font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember me toggle */}
            <div className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember" className="text-slate-500 font-semibold cursor-pointer">Remember my session</label>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Preset testing credentials list */}
          <div className="border-t border-slate-200 pt-5 space-y-3.5 text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Sandbox Testing profiles</span>
            
            <div className="grid grid-cols-1 gap-2 select-none">
              <div className="grid grid-cols-2 gap-2 text-left">
                <button
                  onClick={() => handleQuickLogin('staff@articulate.edu')}
                  disabled={isLoading}
                  className="p-2 border border-slate-200 hover:border-indigo-200 rounded-xl text-[9px] font-semibold text-slate-600 flex items-center gap-2 bg-white"
                >
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&q=80" className="h-5 w-5 rounded-full object-cover" />
                  <span className="truncate text-slate-800 font-bold">Evelyn (Staff)</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('sysadmin@articulate.edu')}
                  disabled={isLoading}
                  className="p-2 border border-slate-200 hover:border-indigo-200 rounded-xl text-[9px] font-semibold text-slate-650 flex items-center gap-2 bg-white"
                >
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&q=80" className="h-5 w-5 rounded-full object-cover" />
                  <span className="truncate text-slate-800 font-bold">Admin (Sys)</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
export default Login;
