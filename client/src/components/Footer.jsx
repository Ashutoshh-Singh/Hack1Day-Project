import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, ExternalLink, Sparkles, Cpu } from 'lucide-react';

export default function Footer({ onOpenAiChat }) {
  return (
    <footer className="bg-[#040810] text-slate-400 border-t border-white/[0.08] pt-12 pb-8 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/[0.06]">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Right<span className="text-cyan-400">2</span>Know
                <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/80 px-1 py-0.5 rounded border border-cyan-800/40 ml-1.5">
                  CIVIC-TECH
                </span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Empowering students across India with instant, deterministic scholarship matching. 
              Discover genuine government and CSR financial aid without intermediaries, paywalls, or privacy loss.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free, Deterministic & Open-Access</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-200 mb-3">
              Platform Modules
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/" className="hover:text-cyan-300 transition-colors">
                  Radar Feed
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-cyan-300 transition-colors">
                  Eligibility Engine
                </Link>
              </li>
              <li>
                <button 
                  onClick={onOpenAiChat}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-left"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  AI Guidance Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Official Portals */}
          <div>
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-200 mb-3">
              Official Government Portals
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a 
                  href="https://scholarships.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                >
                  National Scholarship Portal (NSP)
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.aicte-india.org/schemes/students-development-schemes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                >
                  AICTE Schemes Portal
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://scholarship.up.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                >
                  UP Scholarship Portal
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Right2Know. Dedicated to Indian students pursuing higher education.
          </p>
          <div className="flex items-center gap-1.5 text-cyan-400/80">
            <Cpu className="w-3.5 h-3.5" />
            <span>Pure Deterministic Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
