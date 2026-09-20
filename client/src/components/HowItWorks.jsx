import React from 'react';
import { UserCheck, Cpu, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      num: '01 / INPUT',
      title: 'Student Profile Telemetry',
      description: 'Enter your basic academic course, year of study, state domicile, social category, and annual family income.',
      detail: 'Instant fill without account registration.',
      tile: 'tile-sky'
    },
    {
      num: '02 / MATCH',
      title: 'Deterministic Filtering',
      description: 'Our rule engine matches your profile parameters against official Government and CSR scholarship guidelines in milliseconds.',
      detail: '100% hard-filter precision.',
      tile: 'tile-lavender'
    },
    {
      num: '03 / APPLY',
      title: 'Discover & Apply',
      description: 'Review personalized matching scholarships with clear eligibility explanations, deadline countdowns, and official application portals.',
      detail: 'Step-by-step document checklist included.',
      tile: 'tile-mint'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3.5 py-1 rounded-full">
          Transparent Pipeline
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Right2Know Works
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          A predictable three-step flow to connect students with authentic funding opportunities.
        </p>
      </div>

      {/* 3 Step Cards (Inspired by Reference Image 1 & 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="soft-glass-card rounded-[2rem] p-8 flex flex-col justify-between space-y-6"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-xl">
                  {item.num}
                </span>
                <span className="w-8 h-8 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">
                  ✓
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-indigo-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{item.detail}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="mt-14 text-center">
        <Link
          to="/eligibility"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm text-white bg-slate-900 hover:bg-indigo-900 shadow-lg shadow-slate-900/10 transition-all soft-pill-btn"
        >
          <span>Start 2-Minute Eligibility Check</span>
          <ArrowRight className="w-4 h-4 text-indigo-200" />
        </Link>
      </div>

    </section>
  );
}
