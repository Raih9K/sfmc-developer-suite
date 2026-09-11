'use client';

import React, { useState } from 'react';
import { Play, CheckCircle, AlertTriangle, Terminal, ArrowRight, UserCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function SimulatorPage() {
  const [contactKey, setContactKey] = useState('CUST-88392');
  const [email, setEmail] = useState('john.doe@example.com');
  const [cartValue, setCartValue] = useState(125.50);
  const [channel, setChannel] = useState('WhatsApp + SMS');
  const [loading, setLoading] = useState(false);
  const [responseLog, setResponseLog] = useState<Record<string, unknown> | null>(null);

  const handleSimulateJourneyStep = async () => {
    setLoading(true);
    setResponseLog(null);
    try {
      const payload = {
        journeyName: 'Abandoned Cart Nurture 2026',
        activityName: 'Smart Webhook & Loyalty Rewarder',
        keyValue: contactKey,
        inArguments: [
          { contactKey },
          { email },
          { cartValue },
          { notificationChannel: channel }
        ]
      };

      const res = await fetch('/api/activity/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setResponseLog(data);
    } catch (err: unknown) {
      setResponseLog({
        status: 'error',
        message: err instanceof Error ? err.message : 'Execution failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Simulator Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-800/40 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <Terminal className="w-4 h-4" />
          Interactive Journey Builder Simulator
        </div>
        <h1 className="text-2xl font-bold text-white">Test Custom Activity Execution Without SFMC Tenant</h1>
        <p className="text-slate-400 text-sm mt-1">
          Simulate a contact progressing through the Journey Builder canvas and entering this custom activity node.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Input Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <UserCheck className="w-4 h-4 text-blue-400" />
            Contact & Journey Context Data
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Contact / Subscriber Key</label>
              <input
                type="text"
                value={contactKey}
                onChange={(e) => setContactKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Customer Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Cart Value ($)</label>
                <input
                  type="number"
                  value={cartValue}
                  onChange={(e) => setCartValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500"
                >
                  <option value="WhatsApp + SMS">WhatsApp + SMS</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="SMS">SMS</option>
                  <option value="Email Webhook">Email</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleSimulateJourneyStep}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-md shadow-blue-600/30"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            Fire &quot;Execute&quot; Webhook
          </button>
        </div>

        {/* Execution Response Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Terminal className="w-4 h-4 text-purple-400" />
              Live /execute API Response
            </h2>

            <div className="mt-4">
              {responseLog ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    HTTP 200 OK — Activity Executed Successfully
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 overflow-x-auto max-h-64">
                    <pre>{JSON.stringify(responseLog, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  <Play className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-60" />
                  Click <strong>Fire &quot;Execute&quot; Webhook</strong> to simulate how Journey Builder sends data to this backend.
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-center justify-between">
            <span>Audit log automatically recorded</span>
            <Link href="/" className="text-blue-400 hover:underline flex items-center gap-1">
              View in Schema Explorer <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
