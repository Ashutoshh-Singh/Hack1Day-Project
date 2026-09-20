import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MatchBadge({ score = 90 }) {
  let badgeStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
  let dotStyle = 'bg-emerald-400';

  if (score >= 95) {
    badgeStyle = 'bg-emerald-950 text-emerald-200 border-emerald-400 font-extrabold shadow-sm shadow-emerald-500/20';
    dotStyle = 'bg-emerald-400 animate-ping';
  } else if (score >= 85) {
    badgeStyle = 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 font-bold';
    dotStyle = 'bg-cyan-400';
  } else {
    badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700 font-medium';
    dotStyle = 'bg-slate-400';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
      <span>{score}% Match</span>
    </span>
  );
}
