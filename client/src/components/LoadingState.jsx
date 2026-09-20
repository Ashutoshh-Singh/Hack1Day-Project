import React from 'react';
import { Sparkles, Cpu } from 'lucide-react';

export default function LoadingState({ message = 'Comparing your profile against scholarship criteria...' }) {
  return (
    <div className="py-24 px-4 text-center max-w-md mx-auto space-y-6">
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-cyan-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-cyan-400">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">
          Executing Deterministic Engine
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          {message}
        </p>
      </div>

      <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-3.5 py-1.5 rounded-full border border-cyan-800/50">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Evaluating discipline quotas & income limits</span>
      </div>
    </div>
  );
}
