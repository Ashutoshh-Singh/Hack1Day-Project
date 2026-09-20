import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import HowItWorks from '../components/HowItWorks';
import { getSchemes, seedNewScheme } from '../services/api';
import SchemeCard from '../components/SchemeCard';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  PlusCircle,
  Loader2,
  BellRing
} from 'lucide-react';

export default function LandingPage({ onOpenAiChat }) {
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [totalCount, setTotalCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [liveToast, setLiveToast] = useState(null);

  // Polling for newly launched schemes
  const loadSchemesData = async (isInitial = false) => {
    try {
      const data = await getSchemes();
      if (data?.schemes) {
        setFeaturedSchemes(prev => {
          if (!isInitial && prev.length > 0 && data.schemes.length > totalCount) {
            const newest = data.schemes[0];
            setLiveToast({
              name: newest.name,
              provider: newest.provider,
              benefit: newest.benefit
            });
            setTimeout(() => setLiveToast(null), 7000);
          }
          return data.schemes.slice(0, 6);
        });
        setTotalCount(data.count || data.schemes.length);
      }
    } catch (e) {
      console.warn('Could not fetch preview schemes:', e);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemesData(true);

    const interval = setInterval(() => {
      loadSchemesData(false);
    }, 8000);

    return () => clearInterval(interval);
  }, [totalCount]);

  const handleSimulateNewLaunch = async () => {
    setIsSeeding(true);
    try {
      const res = await seedNewScheme();
      if (res && res.scheme) {
        setLiveToast({
          name: res.scheme.name,
          provider: res.scheme.provider,
          benefit: res.scheme.benefit
        });
        await loadSchemesData(false);
      }
    } catch (err) {
      console.error('Failed to simulate new launch:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Live Toast */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-3xl shadow-2xl border-2 border-indigo-400 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 animate-bounce">
              <BellRing className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full">
                  ⚡ New Launch Auto-Fetched
                </span>
              </div>
              <h4 className="text-sm font-bold text-white line-clamp-1">
                {liveToast.name}
              </h4>
              <p className="text-xs text-slate-300">
                {liveToast.provider} • <strong className="text-emerald-400">{liveToast.benefit}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Key Capabilities / Stats Section */}
      <StatsSection />

      {/* 3. How It Works Section */}
      <HowItWorks />

      {/* 4. Verified Scholarship Catalog Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Live Scheme Radar & Simulate Button */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Scheme Radar: Active Auto-Fetch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Verified Scholarship Opportunities
            </h2>
            <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl">
              Monitoring <strong className="text-slate-900 font-bold">{totalCount} active scholarship schemes</strong>. Newly announced government & CSR opportunities automatically update in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Interactive Simulation Button */}
            <button
              type="button"
              onClick={handleSimulateNewLaunch}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Simulate adding a new scholarship"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                  <span>Launching Scheme...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-amber-700" />
                  <span>⚡ Simulate New Scheme Launch</span>
                </>
              )}
            </button>

            <Link
              to="/eligibility"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-slate-900 hover:bg-indigo-900 transition-colors shadow-md shadow-slate-900/10 soft-pill-btn"
            >
              <span>Check My Eligibility</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
            </Link>
          </div>
        </div>

        {/* Grid of Schemes */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-[2rem] bg-white/60 animate-pulse border border-white/80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            to="/eligibility"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white bg-slate-900 hover:bg-indigo-900 shadow-xl shadow-slate-900/10 active:scale-[0.99] transition-all soft-pill-btn"
          >
            <span>Match Your Profile Against All {totalCount} Scholarships</span>
            <ArrowRight className="w-4 h-4 text-indigo-200" />
          </Link>
        </div>
      </section>

      {/* 5. FAQs / Trust Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="soft-glass-card rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              How are newly launched scholarship schemes updated?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Right2Know continuously monitors the National Scholarship Portal (NSP), state portals, and CSR foundations. Newly launched schemes are ingested immediately and tagged with a live "NEW LAUNCH" banner.
            </p>
          </div>

          <div className="soft-glass-card rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Is Right2Know completely free to use?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Yes, Right2Know is 100% free and open-access for every student in India. We do not charge application consultation fees or sell student data.
            </p>
          </div>

          <div className="soft-glass-card rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              How does the matching engine work?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We use a deterministic rule engine that directly compares your course, academic marks (CGPA), category reservation, income bracket, and state domicile against verified scholarship requirements.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
