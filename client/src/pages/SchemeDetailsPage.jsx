import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getScheme } from '../services/api';
import DeadlineBadge from '../components/DeadlineBadge';
import LoadingState from '../components/LoadingState';
import { 
  ArrowLeft, 
  ExternalLink, 
  Building2, 
  Award, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Share2, 
  Check,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { formatDate } from '../utils/deadline';

export default function SchemeDetailsPage({ onOpenAiChat }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const userProfile = (() => {
    try {
      const saved = sessionStorage.getItem('right2know_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    let isMounted = true;
    async function fetchSchemeDetails() {
      setLoading(true);
      setError(null);
      try {
        const data = await getScheme(id);
        if (isMounted) {
          if (data?.scheme) {
            setScheme(data.scheme);
          } else {
            setError(`Scholarship with ID '${id}' not found.`);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Scholarship scheme not found.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) {
      fetchSchemeDetails();
    }
    return () => { isMounted = false; };
  }, [id]);

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <LoadingState message="Fetching official scholarship details..." />;
  }

  if (error || !scheme) {
    return (
      <div className="py-24 max-w-md mx-auto text-center px-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Scheme Not Found
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          The requested scheme ID "{id}" does not exist in our active dataset.
        </p>
        <Link
          to="/results"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white bg-slate-900 hover:bg-indigo-900 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matches</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/results"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white/90 border border-slate-200/80 px-4 py-2.5 rounded-2xl transition-all shadow-sm soft-pill-btn"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Back to Matches</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/90 border border-slate-200/80 px-4 py-2.5 rounded-2xl hover:bg-white transition-all shadow-sm soft-pill-btn"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>Share Opportunity</span>
            </>
          )}
        </button>
      </div>

      {/* Main Details Card */}
      <div className="soft-glass-card rounded-[2.5rem] overflow-hidden">
        
        {/* Header Banner */}
        <div className="p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <DeadlineBadge deadline={scheme.deadline} />
              <span className="text-xs text-slate-300 font-medium">
                Official Deadline: {formatDate(scheme.deadline)}
              </span>
            </div>

            {scheme.isOfficial && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-700/50 px-3.5 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Government / CSR Scheme</span>
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">
              {scheme.provider}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {scheme.name}
            </h1>
          </div>

          {/* Benefit Badge */}
          <div className="pt-2 flex items-center gap-3">
            <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-black text-lg flex items-center gap-2.5 shadow-inner">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>{scheme.benefit}</span>
            </div>
          </div>

        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Overview */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 font-mono">
              Scheme Overview
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {scheme.description}
            </p>
          </div>

          {/* Why Matched Pill */}
          {userProfile && (
            <div className="rounded-[2rem] bg-indigo-50/80 border border-indigo-100 p-6 space-y-2">
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Why Your Profile Matches This Opportunity</span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">
                Your submitted discipline ({userProfile.course}), Year {userProfile.year} status, domicile ({userProfile.state}), and family income (₹{userProfile.incomeLakhs}L) fully comply with the funding provider's mandatory guidelines.
              </p>
            </div>
          )}

          {/* Requirements Grid */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Eligibility Requirements Matrix</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Eligible Disciplines
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {Array.isArray(scheme.eligibleCourses) ? scheme.eligibleCourses.join(', ') : 'All Disciplines'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Academic Year
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {Array.isArray(scheme.eligibleYears) ? `Year ${scheme.eligibleYears.join(', ')}` : 'All Years'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  State Domicile
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {Array.isArray(scheme.eligibleStates) ? scheme.eligibleStates.join(', ') : 'Pan-India'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Max Family Income
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Up to ₹{scheme.maxIncomeLakhs} Lakhs/year
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Minimum Score
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {scheme.minCgpa} CGPA (or equivalent)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Target Category
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {Array.isArray(scheme.eligibleCategories) ? scheme.eligibleCategories.join(', ') : 'All Categories'}
                </span>
              </div>

            </div>
          </div>

          {/* Required Documents Checklist */}
          {Array.isArray(scheme.documents) && scheme.documents.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2 font-mono">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Required Documents Checklist</span>
              </h2>

              <div className="rounded-[2rem] border border-slate-200 divide-y divide-slate-100 overflow-hidden bg-white/90 shadow-2xs">
                {scheme.documents.map((doc, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">
                      {doc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onOpenAiChat}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors soft-pill-btn"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Ask AI Guide About This Scheme</span>
            </button>

            <a
              href={scheme.applyLink || 'https://scholarships.gov.in'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm text-white bg-slate-900 hover:bg-indigo-900 active:scale-[0.98] shadow-xl shadow-slate-900/15 transition-all soft-pill-btn"
              id="details-apply-button"
            >
              <span>Proceed to Official Application Portal</span>
              <ExternalLink className="w-4 h-4 text-indigo-300" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
