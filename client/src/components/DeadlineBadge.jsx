import React from 'react';
import { Clock, AlertTriangle, XCircle } from 'lucide-react';
import { getDeadlineStatus } from '../utils/deadline';

export default function DeadlineBadge({ deadline }) {
  const { status, label } = getDeadlineStatus(deadline);

  let Icon = Clock;
  let style = 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40';

  if (status === 'urgent') {
    Icon = AlertTriangle;
    style = 'bg-rose-950/80 text-rose-300 border-rose-600/50 animate-pulse font-bold';
  } else if (status === 'warning') {
    Icon = Clock;
    style = 'bg-amber-950/80 text-amber-300 border-amber-600/50';
  } else if (status === 'expired') {
    Icon = XCircle;
    style = 'bg-slate-900 text-slate-500 border-slate-800';
  }

  return (
    <span 
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono border ${style}`}
      title={`Official Application Deadline: ${deadline || 'Rolling'}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{label}</span>
    </span>
  );
}
