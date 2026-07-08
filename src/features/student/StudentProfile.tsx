import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Lock, Mail, Phone, Calendar, School, Save, Shield, Bell } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  
  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name.split(' ')[1] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('(555) 012-3456');
  const [dob, setDob] = useState('2003-05-15');
  
  const [college, setCollege] = useState('Bay Area Community College');
  const [gpa, setGpa] = useState('3.85');
  const [credits, setCredits] = useState('45');
  
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-xs">
      
      <div className="border-b pb-5 select-none">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Student Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your academic credentials and notification settings.</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-100/50 text-xs font-bold text-emerald-800 rounded-xl">
          Profile configurations updated successfully.
        </div>
      )}

      <form onSubmit={handleProfileSubmit} className="space-y-6 text-xs font-semibold text-slate-500">
        
        {/* Personal Details */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5 border-b pb-2 select-none">
            <User className="h-4.5 w-4.5 text-indigo-500" />
            Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 uppercase">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 uppercase">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 uppercase">Email Address</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-semibold text-slate-450 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block mb-2 uppercase">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Academic Details */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5 border-b pb-2 select-none">
            <School className="h-4.5 w-4.5 text-indigo-500" />
            Academic Background
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block mb-2 uppercase">Current College</label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 uppercase">Cumulative GPA</label>
              <input
                type="text"
                required
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none text-center"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 uppercase">Credits Completed</label>
            <input
              type="number"
              required
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
            />
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6 space-y-4 select-none">
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5 border-b pb-2">
            <Bell className="h-4.5 w-4.5 text-indigo-500" />
            Notifications Registry
          </h3>

          <div className="space-y-3 font-semibold text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifEmail}
                onChange={() => setNotifEmail(!notifEmail)}
                className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500"
              />
              Email notifications for AI Magic completed reports
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifSMS}
                onChange={() => setNotifSMS(!notifSMS)}
                className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500"
              />
              SMS logs for counselor meeting notifications
            </label>
          </div>
        </Card>

        <Button
          type="submit"
          className="w-full py-3 text-xs"
          leftIcon={<Save className="h-4.5 w-4.5" />}
        >
          Save Profile Updates
        </Button>
      </form>

    </div>
  );
};
export { StudentProfile as default };
