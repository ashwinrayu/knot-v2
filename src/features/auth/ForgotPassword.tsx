import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    await resetPassword(email);
    setIsLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 space-y-6 text-center">
        
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-650 mb-4 shadow-inner">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-display font-black text-slate-900">Forgot Password</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Provide your email address, and we'll send a password recovery verification link.
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/10 text-xs font-semibold text-indigo-800 leading-normal text-left">
              📩 If an account matches this email, a reset link will appear. Proceed next to set a new password.
            </div>
            <Link
              to="/reset-password"
              className="w-full inline-block py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold text-center"
            >
              Reset Password Mock screen
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 text-xs font-semibold text-left">
            <div>
              <label className="block text-slate-555 uppercase mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 bg-white font-semibold"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3"
            >
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="border-t border-slate-100 pt-4 text-center">
          <Link to="/login" className="text-xs text-slate-455 hover:text-indigo-600 flex items-center gap-1.5 justify-center font-bold">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
export { ForgotPassword as default };
