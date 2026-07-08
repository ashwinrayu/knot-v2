import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 space-y-6 text-center">
        
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-650 mb-4 shadow-inner">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-display font-black text-slate-900">Set New Password</h2>
          <p className="text-xs text-slate-505 mt-2">Enter your new account password security parameters</p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100/50 text-[11px] font-bold text-emerald-800 flex items-center gap-2 text-left leading-normal">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              Password updated successfully. You can now login.
            </div>
            <Link
              to="/login"
              className="w-full inline-block py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center transition-colors"
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-left">
            <div>
              <label className="block text-slate-550 uppercase mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 bg-white font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-555 uppercase mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 bg-white font-semibold"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Update Password
            </Button>
          </form>
        )}

      </div>
    </div>
  );
};
export { ResetPassword as default };
