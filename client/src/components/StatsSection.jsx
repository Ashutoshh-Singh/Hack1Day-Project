import React from 'react';
import { Timer, Cpu, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      num: '01',
      icon: Timer,
      value: '< 2 Minutes',
      label: 'Eligibility Evaluation',
      description: 'Single-page assessment without multi-step wizard delays or document upload friction.',
      tileClass: 'tile-sky',
      iconColor: 'text-sky-600'
    },
    {
      num: '02',
      icon: Cpu,
      value: '100% Deterministic',
      label: 'Hard-Filter Matching',
      description: 'No AI hallucinations on critical eligibility decisions. Output is strictly rule-based and explainable.',
      tileClass: 'tile-lavender',
      iconColor: 'text-purple-600'
    },
    {
      num: '03',
      icon: ShieldCheck,
      value: '100% Free & Direct',
      label: 'Civic-Tech Architecture',
      description: 'Zero application fees, zero ads, and verified links directly to official government portals.',
      tileClass: 'tile-mint',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="soft-glass-card rounded-[2rem] p-7 flex flex-col justify-between space-y-6 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl ${stat.tileClass} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-slate-400 transition-colors">
                  {stat.num}
                </span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                  {stat.label}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
