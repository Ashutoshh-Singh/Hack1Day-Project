import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Sparkles, 
  Search, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function Navbar({ onOpenAiChat }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Discover', path: '/' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Eligibility Engine', path: '/eligibility' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-4 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <div className="bg-white/80 backdrop-blur-2xl border border-white/90 rounded-[1.75rem] px-5 sm:px-6 py-3 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.06)] flex items-center justify-between transition-all">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="Right2Know Home"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-5 h-5 text-indigo-200" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
              Right<span className="text-blue-600">2</span>Know
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 -mt-1">
              Scholarship Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/50" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                isActive(link.path)
                  ? 'text-slate-950 bg-white shadow-sm font-extrabold'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Ask AI Pill */}
          <button
            type="button"
            onClick={onOpenAiChat}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-100 transition-all shadow-sm group ml-1"
            id="navbar-ask-ai-button"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-12 transition-transform" />
            <span>Ask AI Assistant</span>
          </button>
        </nav>

        {/* Primary CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/eligibility"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-slate-900 hover:bg-indigo-900 active:scale-[0.98] shadow-md shadow-slate-900/10 transition-all soft-pill-btn"
            id="navbar-cta-button"
          >
            <Search className="w-3.5 h-3.5 mr-2 text-indigo-300" />
            <span>Find Scholarships</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onOpenAiChat}
            className="p-2 text-indigo-600 bg-indigo-50 rounded-xl border border-indigo-100"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100"
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-2xl p-4 shadow-2xl space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive(link.path)
                    ? 'text-slate-950 bg-slate-100 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiChat();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Ask AI Guidance Assistant
            </button>

            <Link
              to="/eligibility"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 shadow-md"
            >
              <Search className="w-4 h-4 text-indigo-300" />
              Check Eligibility (2 Mins)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
