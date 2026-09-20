import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="py-24 max-w-lg mx-auto text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <Compass className="w-8 h-8 text-brand-600" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
        404 Error
      </span>

      <h1 className="text-3xl font-extrabold text-navy-900 mt-4 mb-2 tracking-tight">
        Page Not Found
      </h1>

      <p className="text-sm text-slate-600 mb-8 max-w-sm mx-auto leading-relaxed">
        The link you followed may be broken or the scholarship page may have been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-navy-900 hover:bg-navy-800 transition-colors shadow-sm"
        >
          <Home className="w-4 h-4 text-brand-300" />
          <span>Return to Home</span>
        </Link>

        <Link
          to="/eligibility"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          <span>Check Eligibility</span>
        </Link>
      </div>
    </div>
  );
}
