import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  ArrowRight, 
  Check, 
  Share2, 
  Building2, 
  Zap,
  Sparkles
} from 'lucide-react';
import MatchBadge from './MatchBadge';
import DeadlineBadge from './DeadlineBadge';

export default function SchemeCard({ scheme }) {
  const [copied, setCopied] = useState(false);

  if (!scheme) return null;

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/scholarships/${scheme.id}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article 
      className="soft-glass-card rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between space-y-5 overflow-hidden group"
      id={`scheme-card-${scheme.id}`}
    >
      {/* Card Header & Badges */}
      <div className="space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {scheme.isNew && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 shadow-sm animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                ✨ NEW LAUNCH
              </span>
            )}
            <MatchBadge score={scheme.matchScore || 88} />
            <DeadlineBadge deadline={scheme.deadline} />
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs flex items-center gap-1 transition-colors"
            title="Copy link to this scholarship"
            aria-label="Share scholarship"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10px] text-emerald-600 font-bold">Copied</span>
              </>
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Provider & Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{scheme.provider}</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
            <Link to={`/scholarships/${scheme.id}`} className="hover:underline focus:outline-none">
              {scheme.name}
            </Link>
          </h3>
        </div>

        {/* Benefit Tile (Inspired by Image 2 Pastel Tiles) */}
        <div className="tile-sky rounded-2xl p-4 flex items-center justify-between gap-2 shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
              Financial Benefit
            </span>
            <span className="text-sm sm:text-base font-black text-slate-900 line-clamp-1">
              {scheme.benefit}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/80 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-sm shrink-0">
            ₹
          </div>
        </div>

        {/* Reason Pill */}
        {scheme.reason && (
          <div className="rounded-2xl bg-white/80 border border-slate-200/60 p-3.5 text-xs text-slate-600 flex items-start gap-2 shadow-sm">
            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block text-[11px]">
                Why You Matched:
              </span>
              <p className="leading-relaxed text-slate-600 font-normal">
                {scheme.reason}
              </p>
            </div>
          </div>
        )}

        {/* Tags */}
        {Array.isArray(scheme.tags) && scheme.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {scheme.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="text-[10px] font-bold text-slate-600 bg-white/90 border border-slate-200 px-2.5 py-1 rounded-xl shadow-2xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between gap-3">
        <Link
          to={`/scholarships/${scheme.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 py-2 px-3 rounded-xl hover:bg-white transition-all"
          id={`view-details-${scheme.id}`}
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <a
          href={scheme.applyLink || 'https://scholarships.gov.in'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-slate-900 hover:bg-indigo-900 active:scale-[0.98] shadow-md shadow-slate-900/10 transition-all soft-pill-btn"
          id={`apply-now-${scheme.id}`}
        >
          <span>Apply Now</span>
          <ExternalLink className="w-3.5 h-3.5 text-indigo-300" />
        </a>
      </div>
    </article>
  );
}
