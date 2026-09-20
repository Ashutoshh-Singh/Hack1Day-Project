import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SchemeCard from '../components/SchemeCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { matchStudent } from '../services/api';
import { 
  Sparkles, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Search, 
  CheckCircle2, 
  Zap
} from 'lucide-react';

export default function ResultsPage({ resultsData, onOpenAiChat }) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(() => {
    if (resultsData?.profile) return resultsData.profile;
    try {
      const saved = sessionStorage.getItem('right2know_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [matches, setMatches] = useState(() => {
    if (resultsData?.matches) return resultsData.matches;
    try {
      const saved = sessionStorage.getItem('right2know_matches');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sorting & Filtering State
  const [sortBy, setSortBy] = useState('deadline');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Re-fetch on refresh if profile exists
  useEffect(() => {
    if (profile && (!matches || matches.length === 0) && !error) {
      let isMounted = true;
      async function reEvaluate() {
        setLoading(true);
        try {
          const res = await matchStudent(profile);
          if (isMounted && res.success) {
            setMatches(res.matches || []);
            sessionStorage.setItem('right2know_matches', JSON.stringify(res.matches || []));
          }
        } catch (err) {
          if (isMounted) setError(err.message);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
      reEvaluate();
      return () => { isMounted = false; };
    }
  }, [profile]);

  const allTags = useMemo(() => {
    const set = new Set();
    matches.forEach(m => (m.tags || []).forEach(t => set.add(t)));
    return ['ALL', ...Array.from(set)];
  }, [matches]);

  const displayedMatches = useMemo(() => {
    let list = [...matches];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        (m.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedTag !== 'ALL') {
      list = list.filter(m => (m.tags || []).includes(selectedTag));
    }

    list.sort((a, b) => {
      if (sortBy === 'deadline') {
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return dateA - dateB;
      }
      if (sortBy === 'score') {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      if (sortBy === 'benefit') {
        return (b.benefitAmount || 0) - (a.benefitAmount || 0);
      }
      return 0;
    });

    return list;
  }, [matches, searchQuery, selectedTag, sortBy]);

  if (loading) {
    return <LoadingState message="Recalculating personalized scholarship matches..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Could Not Load Matches" 
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!profile) {
    return (
      <div className="py-24 max-w-lg mx-auto text-center px-4">
        <div className="w-16 h-16 rounded-3xl bg-white shadow-md border border-slate-200 text-indigo-600 flex items-center justify-center mx-auto mb-6">
          <SlidersHorizontal className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          No Profile Detected
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Please fill your academic criteria first to calculate matched scholarships.
        </p>
        <Link
          to="/eligibility"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white bg-slate-900 hover:bg-indigo-900 shadow-md"
        >
          <span>Fill 2-Minute Form</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Result HUD Banner */}
      <div className="soft-glass-card rounded-[2.5rem] p-6 sm:p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deterministic Match Verified</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" id="results-heading">
              Scholarships Matched for You
            </h1>
            
            <p className="mt-1 text-sm text-slate-600">
              Found <strong className="text-slate-900 font-bold">{matches.length} scholarship{matches.length === 1 ? '' : 's'}</strong> meeting 100% of your eligibility criteria.
            </p>
          </div>

          {/* Profile Criteria Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-xl bg-white/90 text-slate-700 border border-slate-200/80 shadow-2xs">
                {profile.course} (Yr {profile.year})
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/90 text-slate-700 border border-slate-200/80 shadow-2xs">
                {profile.state}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/90 text-slate-700 border border-slate-200/80 shadow-2xs">
                {profile.category}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/90 text-slate-700 border border-slate-200/80 shadow-2xs">
                ₹{profile.incomeLakhs}L/yr
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/90 text-slate-700 border border-slate-200/80 shadow-2xs">
                CGPA {profile.cgpa}
              </span>
            </div>

            <Link
              to="/eligibility"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all ml-auto sm:ml-0"
              id="edit-profile-btn"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Filter & Sort Controls */}
      {matches.length > 0 && (
        <div className="soft-glass-card rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search matched schemes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300/80 bg-white/90 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Tag Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {allTags.slice(0, 5).map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors font-bold ${
                  selectedTag === tag
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200'
                }`}
              >
                {tag === 'ALL' ? 'All Tags' : tag}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs rounded-xl border border-slate-300/80 bg-white px-3 py-1.5 font-bold text-slate-800 focus:border-indigo-500"
              id="results-sort-select"
            >
              <option value="deadline">⏰ Deadline (Urgent First)</option>
              <option value="score">✨ Match Score (Highest)</option>
              <option value="benefit">💰 Financial Benefit (Highest)</option>
            </select>
          </div>

        </div>
      )}

      {/* Scheme Cards Grid */}
      {matches.length === 0 ? (
        <EmptyState onOpenAiChat={onOpenAiChat} />
      ) : displayedMatches.length === 0 ? (
        <div className="soft-glass-card rounded-[2rem] p-12 text-center max-w-md mx-auto space-y-4">
          <Search className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-lg">No matches for active filter</h3>
          <p className="text-xs text-slate-500">
            No scholarships matched your search "{searchQuery}" or tag filter.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedTag('ALL'); }}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMatches.map((scheme) => (
            <SchemeCard 
              key={scheme.id} 
              scheme={scheme} 
            />
          ))}
        </div>
      )}

      {/* AI Assistant Floating Banner */}
      <div className="mt-12 p-6 sm:p-7 rounded-[2rem] bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-slate-900/10">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base text-white">
              Have questions about document requirements or application steps?
            </h4>
            <p className="text-xs text-slate-300">
              Ask our AI assistant for instant guidance tailored to your active profile.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAiChat}
          className="px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs whitespace-nowrap transition-all shadow-md soft-pill-btn"
        >
          Ask AI Guide
        </button>
      </div>

    </div>
  );
}
