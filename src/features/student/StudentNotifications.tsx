import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../../components/ui/Card';
import { Bell, ShieldCheck, MailOpen, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export const StudentNotifications: React.FC = () => {
  const { notifications, clearNotification } = useAppState();

  const mockNotifs = [
    { id: '1', text: 'Official transcript evaluation report is now published by Evelyn Martinez.', type: 'success', time: '10 mins ago', icon: <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" /> },
    { id: '2', text: 'Evaluation mapping completed. Review recommended course equivalents.', type: 'info', time: '2 hours ago', icon: <FileText className="h-4.5 w-4.5 text-indigo-650" /> },
    { id: '3', text: 'AI Magic scanning sequence started for deanza_unofficial.pdf transcript.', type: 'info', time: '1 day ago', icon: <Bell className="h-4.5 w-4.5 text-indigo-600 animate-bounce" /> }
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans text-xs">
      
      <div className="border-b pb-5 select-none">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Notification Center</h1>
        <p className="text-xs text-slate-405 mt-1">Review automated AI Magic steps logs and admissions reviews.</p>
      </div>

      <div className="space-y-3 font-semibold text-slate-600">
        {mockNotifs.map((notif) => (
          <Card key={notif.id} className="p-4 flex gap-4 items-center justify-between hover:border-slate-350 transition-colors shadow-xs">
            <div className="flex gap-3 items-center">
              <div className="h-8.5 w-8.5 rounded-full bg-slate-50 border flex items-center justify-center flex-shrink-0 shadow-inner">
                {notif.icon}
              </div>
              <div>
                <span className="text-slate-800 block text-xs leading-normal">{notif.text}</span>
                <span className="text-[9px] text-slate-400 block font-semibold mt-0.5">{notif.time}</span>
              </div>
            </div>
            
            <button 
              onClick={() => alert('Notification cleared')} 
              className="text-[9px] text-slate-400 hover:text-slate-600 font-bold border rounded-lg px-2 py-1 select-none bg-white"
            >
              Clear
            </button>
          </Card>
        ))}
      </div>

    </div>
  );
};
export { StudentNotifications as default };
