'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Database, 
  Settings, 
  Play, 
  GitCommit, 
  Globe, 
  Code2, 
  Zap, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Schema Explorer', icon: Database, color: 'text-blue-400' },
    { href: '/custom-activity', label: 'Custom Activity', icon: Settings, color: 'text-purple-400' },
    { href: '/simulator', label: 'Simulator', icon: Play, color: 'text-emerald-400' },
    { href: '/journey-query-builder', label: 'Journey SQL', icon: GitCommit, color: 'text-violet-400' },
    { href: '/cloudpages-ssjs', label: 'CloudPages SSJS', icon: Globe, color: 'text-teal-400' },
    { href: '/sql-studio', label: 'SQL Studio', icon: Code2, color: 'text-amber-400' },
    { href: '/transactional-api', label: 'Transactional API', icon: Zap, color: 'text-rose-400' },
    { href: '/knowledge-hub', label: 'Playbook', icon: Sparkles, color: 'text-indigo-400' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/75 border-b border-white/[0.08] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition duration-300">
              SF
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white group-hover:text-blue-400 transition text-base">
                SFMC Developer Suite
              </span>
              <span className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                Full-Stack
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Marketing Cloud Engagement & Journey Builder Studio
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-white/[0.1] text-white shadow-inner border border-white/[0.12]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? item.color : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
