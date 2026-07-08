import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Sparkles, Mail, Lock, User, ArrowRight, ArrowLeft, Phone, Calendar, School, Eye, EyeOff } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Registration form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [currentInst, setCurrentInst] = useState('');
  const [program, setProgram] = useState('B.S. in Computer Science');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('You must accept the terms and conditions.');
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await register(fullName, email, program);
      setIsLoading(false);
      navigate('/verify-email');
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setErrorMessage('Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch font-sans text-slate-800">
      
      {/* Left Banner: Marketing Quote */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-indigo-900 to-slate-950" />
        
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="h-8.5 w-8.5 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            K
          </div>
          <span className="font-display font-black text-white tracking-tight">Knot</span>
        </Link>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Admissions Enrollment Engine
          </div>
          <h2 className="text-3xl font-display font-black leading-tight tracking-tight">
            Register your transfer profile.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-semibold">
            Track your evaluations, compare credit differentials, and share compiled reports with admissions counselors.
          </p>
        </div>

        <span className="text-[10px] text-slate-500 relative z-10 font-bold uppercase tracking-wider">
          © 2026 Knot University. Registrar office.
        </span>
      </div>

      {/* Right Column: Registration Card form */}
      <div className="flex-grow flex flex-col justify-center items-center p-6 md:p-12 relative overflow-y-auto max-h-screen">
        <Link 
          to="/login" 
          className="absolute top-6 left-6 text-xs text-slate-450 hover:text-indigo-650 flex items-center gap-1.5 font-bold transition-colors select-none"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>

        <div className="max-w-md w-full space-y-6 py-10">
          <div>
            <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Student Registration</h1>
            <p className="text-xs text-slate-450 mt-1">Create an account to track your transfer credit mappings</p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/50 text-[10px] text-rose-700 font-bold animate-pulse">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-semibold text-slate-500">
            
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 uppercase">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white font-semibold text-slate-700 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 uppercase">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white font-semibold text-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@example.com"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white font-semibold text-slate-700 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 uppercase">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 012-3456"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white font-semibold text-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* DoB & Current Institution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 uppercase">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white font-semibold text-slate-700 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 uppercase">Current College</label>
                <div className="relative">
                  <School className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={currentInst}
                    onChange={(e) => setCurrentInst(e.target.value)}
                    placeholder="Bay Area CC"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white font-semibold text-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 uppercase">Program of Interest</label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none font-semibold text-slate-750 text-xs"
              >
                <option>B.S. in Computer Science</option>
                <option>B.S. in Business Administration</option>
                <option>B.S. in Mechanical Engineering</option>
                <option>B.A. in Psychology</option>
              </select>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white font-semibold text-slate-700 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 uppercase">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white font-semibold text-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Toggle show password */}
            <div className="flex justify-between items-center select-none text-[10px] text-slate-500 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500"
                />
                Show Password
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500"
                />
                I accept terms & privacy
              </label>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-2.5"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Create My Account
            </Button>
          </form>

          <p className="text-[10px] text-slate-400 font-semibold text-center mt-2.5">
            Already have a profile? <Link to="/login" className="text-indigo-650 hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>

    </div>
  );
};
export { Register as default };
