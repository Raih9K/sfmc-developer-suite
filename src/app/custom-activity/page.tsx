'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Send, ShieldCheck, HelpCircle } from 'lucide-react';

export default function CustomActivityModal() {
  const [discountTier, setDiscountTier] = useState('DYNAMIC');
  const [notificationChannel, setNotificationChannel] = useState('WhatsApp + SMS');
  const [enableAuditLog, setEnableAuditLog] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // In production, SFMC communicates via postmonger:
  // const connection = new Postmonger.Session();
  // connection.trigger('ready');
  // connection.on('initActivity', (data) => ...);
  useEffect(() => {
    // Notify SFMC Journey Builder canvas that the UI modal has finished loading
    if (typeof window !== 'undefined' && (window as unknown as { Postmonger?: unknown }).Postmonger) {
      console.log('[Postmonger] Notifying Journey Builder Canvas: ready');
    }
  }, []);

  const handleSaveAndConfirm = async () => {
    setStatusMessage('Saving activity configuration to Journey Builder...');
    try {
      const res = await fetch('/api/activity/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discountTier,
          notificationChannel,
          enableAuditLog,
          configuredAt: new Date().toISOString()
        })
      });

      if (res.ok) {
        setStatusMessage('Configuration saved! Activity is ready on Journey canvas.');
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch {
      setStatusMessage('Error saving configuration.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Activity Header (Mimics SFMC Journey Builder Activity Dialog) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Smart Webhook & Loyalty Rewarder</h1>
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-2 py-0.5 rounded font-medium">
                  Custom Activity
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Configure this activity step inside Journey Builder canvas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
            Postmonger Handshake Ready
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-blue-500/15 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          {statusMessage}
        </div>
      )}

      {/* Configuration Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-base font-semibold text-slate-200">Step 1: Activity Parameters & Rules</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Define what happens when a contact in this Journey evaluates this node.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notification Channel */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-400" />
              Delivery Webhook Channel
            </label>
            <select
              value={notificationChannel}
              onChange={(e) => setNotificationChannel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="WhatsApp + SMS">WhatsApp + SMS (Omnichannel)</option>
              <option value="WhatsApp">WhatsApp Webhook Only</option>
              <option value="SMS">SMS Gateway Only</option>
              <option value="Email Webhook">Transactional Email Dispatcher</option>
            </select>
            <p className="text-[11px] text-slate-500">The gateway targeted by our execute endpoint.</p>
          </div>

          {/* Reward Code Logic */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              Reward Logic Formula
            </label>
            <select
              value={discountTier}
              onChange={(e) => setDiscountTier(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="DYNAMIC">Dynamic (Cart Value Based: $100+ = 25% OFF)</option>
              <option value="FIXED_10">Fixed 10% Welcome Discount</option>
              <option value="LOYALTY_POINTS">Grant 500 Loyalty Bonus Points</option>
            </select>
            <p className="text-[11px] text-slate-500">Computed in real-time during execution.</p>
          </div>
        </div>

        {/* Audit Log Switch */}
        <div className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-lg">
          <div>
            <div className="text-sm font-medium text-slate-200">Log Executions to SFMC Data Extension</div>
            <div className="text-xs text-slate-500">
              Automatically writes Contact Key and Response payload to <code>Custom_Activity_Execution_Audit</code>
            </div>
          </div>
          <input
            type="checkbox"
            checked={enableAuditLog}
            onChange={(e) => setEnableAuditLog(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 cursor-pointer"
          />
        </div>

        {/* SFMC Contact Field Mapping Preview */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Automatic Data Binding (From Journey Context)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-400">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-blue-400">contactKey:</span> &quot;&#123;&#123;Contact.Key&#125;&#125;&quot;
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-blue-400">email:</span> &quot;&#123;&#123;InteractionDefaults.Email&#125;&#125;&quot;
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-blue-400">cartValue:</span> &quot;&#123;&#123;Event.Cart_Abandonment_Event.CartValue&#125;&#125;&quot;
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveAndConfirm}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition shadow-lg shadow-blue-600/20"
          >
            <Save className="w-4 h-4" />
            Save Activity Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
