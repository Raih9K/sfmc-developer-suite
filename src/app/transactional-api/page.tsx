'use client';

import React, { useState } from 'react';
import { Send, Mail, CheckCircle2, RefreshCw, Terminal, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function TransactionalApiTesterPage() {
  const [definitionKey, setDefinitionKey] = useState('order_confirmation_v1');
  const [recipientEmail, setRecipientEmail] = useState('alex.johnson@example.com');
  const [contactKey, setContactKey] = useState('CUST-98231');
  const [firstName, setFirstName] = useState('Alex');
  const [orderTotal, setOrderTotal] = useState('$149.99');
  const [loading, setLoading] = useState(false);
  const [responseLog, setResponseLog] = useState<Record<string, unknown> | null>(null);

  const handleSendTransactionalMessage = async () => {
    setLoading(true);
    setResponseLog(null);

    // Mimic the exact SFMC /messaging/v1/email/messages endpoint
    setTimeout(() => {
      const messageKey = `msg-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      setResponseLog({
        requestId: `req-${Math.random().toString(36).substring(2, 9)}`,
        errorcode: 0,
        responses: [
          {
            messageKey: messageKey,
            status: 'SentToMTA',
            recipient: {
              to: recipientEmail,
              contactKey: contactKey,
              messageKey: messageKey
            },
            dispatchedAt: new Date().toISOString()
          }
        ]
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-800/40 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <Zap className="w-4 h-4" />
          Transactional Messaging REST API Workbench
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Real-Time Transactional Trigger Engine</h1>
        <p className="text-slate-400 text-sm mt-1">
          Test sub-second transactional message dispatch (Order confirmations, OTPs, shipping alerts) targeting SFMC Transactional API.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Mail className="w-4 h-4 text-rose-400" />
            Message Payload Parameters
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Definition Key (API Trigger Name)</label>
              <input
                type="text"
                value={definitionKey}
                onChange={(e) => setDefinitionKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Recipient Email</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Contact Key</label>
              <input
                type="text"
                value={contactKey}
                onChange={(e) => setContactKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">First Name (Attr)</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Order Total (Attr)</label>
                <input
                  type="text"
                  value={orderTotal}
                  onChange={(e) => setOrderTotal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSendTransactionalMessage}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-md shadow-rose-600/30 mt-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Fire Transactional Message Trigger
          </button>
        </div>

        {/* API Response */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Terminal className="w-4 h-4 text-rose-400" />
              REST API Response (/messaging/v1/email/messages)
            </h2>

            <div className="mt-4">
              {responseLog ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    HTTP 202 Accepted (Enqueued for Sub-Second Dispatch)
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 overflow-x-auto max-h-64">
                    <pre>{JSON.stringify(responseLog, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  <Send className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-60" />
                  Click <strong>Fire Transactional Message Trigger</strong> to test how external applications invoke SFMC transactional emails.
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> High Priority Queue Active
            </span>
            <span className="text-[11px] text-slate-500">Latency &lt; 250ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

