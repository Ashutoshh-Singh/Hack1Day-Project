import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ErrorState({ 
  title = 'Engine Communication Exception', 
  message = 'An issue occurred communicating with the scholarship data repository.',
  onRetry 
}) {
  return (
    <div className="max-w-md mx-auto text-center py-20 px-4 space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-600/50 text-rose-400 flex items-center justify-center mx-auto shadow-xl">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">
          {title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          {message}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:brightness-110 shadow-lg shadow-cyan-500/20"
          >
            <RefreshCw className="w-4 h-4 text-slate-950" />
            <span>Re-Execute</span>
          </button>
        )}

        <Link
          to="/eligibility"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 border border-white/10 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Form</span>
        </Link>
      </div>
    </div>
  );
}
