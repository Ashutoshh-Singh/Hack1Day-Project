import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Award, 
  Zap,
  Sliders,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function Hero() {
  const [activeTab, setActiveTab] = useState(0);

  const showcaseScenarios = [
    {
      category: 'Engineering & Tech',
      title: 'B.Tech 2nd Year • UP Domicile',
      scheme: 'Central Sector Scholarship Scheme',
      provider: 'Ministry of Education (Govt. of India)',
      benefit: '₹20,000 / year',
      score: 96,
      reason: '7.5 CGPA meets criteria & family income within ₹4.5L ceiling',
      badgeClass: 'tile-sky text-sky-800'
    },
    {
      category: 'Social Justice / SC/ST',
      title: '1st Year B.Tech • SC Quota',
      scheme: 'ONGC Merit Scholarship for SC/ST',
      provider: 'ONGC Foundation',
      benefit: '₹48,000 / year',
      score: 98,
      reason: 'SC Category quota, Engineering course & < ₹2L income limit',
      badgeClass: 'tile-peach text-amber-900'
    },
    {
      category: 'Women in STEM',
      title: 'Female • Technical Degree',
      scheme: 'AICTE Pragati Scholarship for Girls',
      provider: 'AICTE India',
      benefit: '₹50,000 / year',
      score: 99,
      reason: '100% compliance with AICTE female empowerment criteria',
      badgeClass: 'tile-lavender text-purple-900'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % showcaseScenarios.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = showcaseScenarios[activeTab];

  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      
      {/* Soft Ambient Pastel Glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[400px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-[450px] h-[350px] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-purple-200/25 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Pill Capsule */}
        <div className="flex justify-center lg:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white/90 text-slate-700 text-xs font-semibold shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-bold text-slate-900">Right2Know Engine:</span>
            <span>Deterministic Civic Matching v2.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Find scholarships you{' '}
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 bg-clip-text text-transparent block sm:inline">
                already qualify for.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Right2Know matches your academic year, category quota, state domicile, and family income with authentic Indian scholarships in under two minutes. No login required.
            </p>

            {/* Tactile Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/eligibility"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white bg-slate-900 hover:bg-indigo-900 active:scale-[0.98] shadow-xl shadow-slate-900/15 transition-all soft-pill-btn"
                id="hero-check-eligibility-button"
              >
                <span>Check My Eligibility (2m)</span>
                <ArrowRight className="w-4 h-4 text-indigo-200" />
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm text-slate-700 bg-white/80 hover:bg-white border border-white/90 shadow-sm transition-all soft-pill-btn"
                id="hero-how-it-works-button"
              >
                How It Works
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Deterministic Filtering</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Direct Official Portal Links</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Free for All Students</span>
              </div>
            </div>

          </div>

          {/* Right Column: Inspired by Reference Image 2 (Tactile Smart UI Device / Cards) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              
              {/* Outer Frosted Glass Phone / Smart Container */}
              <div className="rounded-[2.5rem] bg-white/70 border-4 border-white/90 p-6 sm:p-7 shadow-[0_24px_60px_-15px_rgba(30,58,138,0.12)] backdrop-blur-2xl space-y-6">
                
                {/* Header bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                      ✨
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Live Match Simulation
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {current.title}
                      </span>
                    </div>
                  </div>

                  {/* Circular Score Pill */}
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col items-center justify-center text-emerald-700 font-bold text-xs shadow-sm">
                    <span>{current.score}%</span>
                    <span className="text-[8px] uppercase tracking-tighter text-emerald-600">Match</span>
                  </div>
                </div>

                {/* Tactile Pastel Module Tiles (Inspired by Image 2) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="tile-sky rounded-2xl p-3.5 space-y-1 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                      Grant Benefit
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 block">
                      {current.benefit}
                    </span>
                  </div>

                  <div className="tile-lavender rounded-2xl p-3.5 space-y-1 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">
                      Discipline
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate block">
                      {current.category}
                    </span>
                  </div>
                </div>

                {/* Active Matched Scheme Box */}
                <div className="rounded-2xl bg-white/90 border border-slate-200/70 p-4 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-600 truncate">{current.provider}</span>
                    <span className="text-[10px] font-bold text-slate-400">ACTIVE</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {current.scheme}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {current.reason}
                  </p>
                </div>

                {/* Interactive Scenario Dots */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs text-slate-500">
                  <span>Scenario {activeTab + 1} of {showcaseScenarios.length}</span>
                  <div className="flex gap-1.5">
                    {showcaseScenarios.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === activeTab ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                        }`}
                        aria-label={`Scenario ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
