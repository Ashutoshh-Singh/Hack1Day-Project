import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function EmptyState({ onOpenAiChat }) {
  return (
    <div className="max-w-xl mx-auto text-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-xl">
        <SearchX className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
        No Exact Telemetry Matches Found Yet
      </h2>

      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-8 max-w-md mx-auto">
        Try adjusting your income ceiling or checking broader categories as new state and private opportunities are constantly updated.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/eligibility"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all"
          id="empty-state-edit-profile-button"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-950" />
          <span>Edit Profile Criteria</span>
        </Link>

        {onOpenAiChat && (
          <button
            type="button"
            onClick={onOpenAiChat}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-700/50 hover:bg-indigo-900/80 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Consult AI Guide</span>
          </button>
        )}
      </div>
    </div>
  );
}
