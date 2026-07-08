import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Settings, Shield, Laptop, Globe, Eye, Save } from 'lucide-react';

export const StudentSettings: React.FC = () => {
  const [lang, setLang] = useState('English');
  const [theme, setTheme] = useState('Light');
  const [mfa, setMfa] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const connectedDevices = [
    { device: 'MacBook Pro', browser: 'Chrome • Boston, MA', ip: '192.168.1.45', status: 'Active Now' },
    { device: 'iPhone 15 Pro', browser: 'Safari • Boston, MA', ip: '10.0.0.12', status: 'Last active 2 hrs ago' }
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans text-xs">
      
      <div className="border-b pb-5 select-none">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage portal preferences and check connected devices.</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-100/50 text-xs font-bold text-emerald-800 rounded-xl">
          System configurations saved.
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs font-semibold text-slate-500">
        
        {/* Core preferences */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5 border-b pb-2 select-none">
            <Settings className="h-4.5 w-4.5 text-indigo-500" />
            General Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 uppercase">Language</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 uppercase">Interface Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
              >
                <option>Light (Default)</option>
                <option>Dark Mode</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Security Preferences */}
        <Card className="p-6 space-y-4 select-none">
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5 border-b pb-2">
            <Shield className="h-4.5 w-4.5 text-indigo-500" />
            Security & MFA
          </h3>

          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={mfa}
              onChange={() => setMfa(!mfa)}
              className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500"
            />
            Require Multi-Factor verification codes for logins
          </label>
        </Card>

        {/* Connected Devices */}
        <Card className="p-6 space-y-4 select-none">
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5 border-b pb-2">
            <Laptop className="h-4.5 w-4.5 text-indigo-500" />
            Connected Devices
          </h3>

          <div className="space-y-3">
            {connectedDevices.map((dev, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center font-bold">
                <div className="flex items-center gap-3">
                  <Globe className="h-4.5 w-4.5 text-slate-400" />
                  <div>
                    <span className="text-slate-800 text-xs block">{dev.device}</span>
                    <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{dev.browser} • {dev.ip}</span>
                  </div>
                </div>
                <span className="text-[9px] text-indigo-600 font-black uppercase bg-indigo-50 border rounded px-2 py-0.5">{dev.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Button
          type="submit"
          className="w-full py-3 text-xs"
          leftIcon={<Save className="h-4.5 w-4.5" />}
        >
          Save Configuration
        </Button>
      </form>

    </div>
  );
};
export { StudentSettings as default };
