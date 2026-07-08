import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Sparkles, MailOpen, ArrowRight } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setIsLoading(true);
    
    await verifyEmail(code);
    setIsLoading(false);
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 space-y-6 text-center">
        
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-650 mb-4 shadow-inner">
            <MailOpen className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-display font-black text-slate-900">Verify Your Email</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            We sent a verification code to your email address. Enter the code below to finalize email check.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 text-xs font-semibold text-left">
          <div>
            <label className="block text-slate-550 uppercase mb-2">Verification Code</label>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 123456"
              className="w-full text-center px-4 py-3 rounded-xl border border-slate-200 text-lg font-bold focus:outline-none focus:border-indigo-500 bg-slate-50/50 uppercase tracking-widest font-mono"
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Verify & Continue
          </Button>
        </form>

        <p className="text-[10px] text-slate-400 font-semibold mt-2.5">
          Didn't receive the email? <button onClick={() => alert('Verification email resent')} className="text-indigo-600 font-bold hover:underline">Resend Code</button>
        </p>

      </div>
    </div>
  );
};
export { VerifyEmail as default };
