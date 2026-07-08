import React from 'react';
import { useAppState } from '@/context/AppStateContext';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, clearNotification } = useAppState();

  const getIcon = (type: 'success' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgClass = (type: 'success' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        return 'border-emerald-100 bg-emerald-50/90 text-slate-800';
      case 'warning':
        return 'border-amber-100 bg-amber-50/90 text-slate-800';
      default:
        return 'border-blue-100 bg-blue-50/90 text-slate-800';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map(notif => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg glass ${getBgClass(notif.type)}`}
          >
            <div className="flex-shrink-0 mt-0.5">{getIcon(notif.type)}</div>
            <div className="flex-grow">
              <p className="text-sm font-medium">{notif.text}</p>
              <span className="text-[10px] text-slate-400 block mt-1">{notif.time}</span>
            </div>
            <button
              onClick={() => clearNotification(notif.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
