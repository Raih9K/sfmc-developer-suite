import React from 'react';
import Link from 'next/link';

export function Navigation() {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
            SF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-100">SFMC Developer Suite</span>
              <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-500/30">
                Full-Stack
              </span>
            </div>
            <p className="text-xs text-slate-400">Marketing Cloud Engagement & Journey Builder</p>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
          <Link
            href="/"
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition whitespace-nowrap"
          >
            📊 Schema Explorer
          </Link>
          <Link
            href="/custom-activity"
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition whitespace-nowrap"
          >
            ⚙️ Custom Activity
          </Link>
          <Link
            href="/simulator"
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition whitespace-nowrap"
          >
            🚀 Simulator
          </Link>
          <Link
            href="/journey-query-builder"
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 transition whitespace-nowrap"
          >
            🧭 Journey Query Builder
          </Link>
          <Link
            href="/cloudpages-ssjs"
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-teal-400 bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 transition whitespace-nowrap"
          >
            🌐 CloudPages & SSJS
          </Link>
          <Link
            href="/sql-studio"
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition whitespace-nowrap"
          >
            🔍 SQL Studio
          </Link>
          <Link
            href="/transactional-api"
            className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition whitespace-nowrap"
          >
            ⚡ Transactional API
          </Link>
          <Link
            href="/knowledge-hub"
            className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm whitespace-nowrap"
          >
            📚 Playbook
          </Link>
        </nav>
      </div>
    </header>
  );
}
