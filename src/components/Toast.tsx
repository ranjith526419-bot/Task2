import React from 'react';
import { RotateCcw, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onUndo, onClose }) => {
  return (
    <div
      id="app-toast-notification"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <span>{message}</span>
      {onUndo && (
        <button
          type="button"
          id="toast-undo-btn"
          onClick={onUndo}
          className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Undo
        </button>
      )}
      <button
        type="button"
        id="toast-close-btn"
        onClick={onClose}
        className="text-slate-400 hover:text-white p-0.5 rounded-md cursor-pointer ml-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
