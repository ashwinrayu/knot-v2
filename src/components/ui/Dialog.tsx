import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl relative z-10 p-6 space-y-5"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-650 p-1 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="text-xs text-slate-650 leading-relaxed font-semibold">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
