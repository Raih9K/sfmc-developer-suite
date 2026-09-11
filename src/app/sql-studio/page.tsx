'use client';

import React, { useState } from 'react';
import { Database, Play, Copy, Check, Info, Code2, AlertCircle } from 'lucide-react';

interface SQLTemplate {
  id: string;
  name: string;
  category: string;
  targetDE: string;
  description: string;
  query: string;
  simulatedOutput: Record<string, unknown>[];
}

const templates: SQLTemplate[] = [
  {
    id: 'unengaged-subscribers',
    name: 'Find Subscribers Sent Emails But Never Opened (Last 30 Days)',
    category: 'Engagement & Hygiene',
    targetDE: 'Unengaged_Subscribers_30d',
    description: 'Queries _Sent joined with _Subscribers and filters out any contacts existing in _Open.',
    query: `SELECT 
    sub.SubscriberKey,
    sub.EmailAddress,
    sent.JobID,
    sent.EventDate AS SentDate,
    sub.Status
FROM _Subscribers sub
JOIN _Sent sent 
    ON sub.SubscriberKey = sent.SubscriberKey
LEFT JOIN _Open open 
    ON sent.JobID = open.JobID 
    AND sent.ListID = open.ListID 
    AND sent.BatchID = open.BatchID 
    AND sent.SubscriberKey = open.SubscriberKey
WHERE open.SubscriberKey IS NULL
  AND sent.EventDate >= DATEADD(day, -30, GETDATE())`,
    simulatedOutput: [
      { SubscriberKey: 'CUST-10492', EmailAddress: 'david.b@example.com', JobID: 90218, SentDate: '2026-09-02 11:20:00', Status: 'Active' },
      { SubscriberKey: 'CUST-39102', EmailAddress: 'linda.k@domain.org', JobID: 90218, SentDate: '2026-09-02 11:20:00', Status: 'Active' },
      { SubscriberKey: 'CUST-55190', EmailAddress: 'raj.patel@webmail.com', JobID: 90441, SentDate: '2026-09-05 16:45:10', Status: 'Active' }
    ]
  },
  {
    id: 'click-rate-by-job',
    name: 'Click-Through Analysis by Job with URLs',
    category: 'Campaign Performance',
    targetDE: 'Job_Click_Metrics_Summary',
    description: 'Aggregates clicks per URL and counts distinct subscribers who interacted.',
    query: `SELECT 
    click.JobID,
    click.URL,
    COUNT(click.SubscriberKey) AS TotalClicks,
    COUNT(DISTINCT click.SubscriberKey) AS UniqueClicks,
    MAX(click.EventDate) AS LatestClickTime
FROM _Click click
WHERE click.IsUnique = 1
  AND click.EventDate >= DATEADD(day, -7, GETDATE())
GROUP BY 
    click.JobID, 
    click.URL`,
    simulatedOutput: [
      { JobID: 90218, URL: 'https://myshop.com/promo/flash-sale', TotalClicks: 1420, UniqueClicks: 1105, LatestClickTime: '2026-09-10 18:22:15' },
      { JobID: 90218, URL: 'https://myshop.com/account/settings', TotalClicks: 210, UniqueClicks: 195, LatestClickTime: '2026-09-10 14:10:00' },
      { JobID: 90441, URL: 'https://myshop.com/checkout/recover', TotalClicks: 890, UniqueClicks: 740, LatestClickTime: '2026-09-11 02:40:50' }
    ]
  },
  {
    id: 'bounced-status',
    name: 'Hard Bounces Log with Error Codes',
    category: 'Deliverability & Health',
    targetDE: 'Hard_Bounces_Audit_Log',
    description: 'Filters _Bounce for Hard Bounces and extracts SMTP status codes to cleanse list.',
    query: `SELECT 
    b.SubscriberKey,
    sub.EmailAddress,
    b.JobID,
    b.EventDate AS BounceDate,
    b.BounceCategory,
    b.SMTPCode,
    b.SMTPReason
FROM _Bounce b
JOIN _Subscribers sub 
    ON b.SubscriberKey = sub.SubscriberKey
WHERE b.BounceCategory = 'Hard bounce'
  AND b.EventDate >= DATEADD(day, -14, GETDATE())`,
    simulatedOutput: [
      { SubscriberKey: 'CUST-99210', EmailAddress: 'bad-email@doesnotexist.co', JobID: 90218, BounceDate: '2026-09-02 11:21:05', BounceCategory: 'Hard bounce', SMTPCode: 550, SMTPReason: 'User mailbox not found' },
      { SubscriberKey: 'CUST-41289', EmailAddress: 'old-inbox@terminated-domain.net', JobID: 90441, BounceDate: '2026-09-05 16:46:22', BounceCategory: 'Hard bounce', SMTPCode: 554, SMTPReason: 'Host domain not found' }
    ]
  }
];

export default function SQLStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<SQLTemplate>(templates[0]);
  const [queryCode, setQueryCode] = useState(templates[0].query);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [outputData, setOutputData] = useState<Record<string, unknown>[]>(templates[0].simulatedOutput);

  const handleSelectTemplate = (tmpl: SQLTemplate) => {
    setSelectedTemplate(tmpl);
    setQueryCode(tmpl.query);
    setOutputData(tmpl.simulatedOutput);
  };

  const handleRunQuery = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setOutputData(selectedTemplate.simulatedOutput);
    }, 600);
  };

  const copyQuery = () => {
    navigator.clipboard.writeText(queryCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <Database className="w-4 h-4" />
          Automation Studio SQL Query Activity Studio
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Data Views Query Workbench</h1>
        <p className="text-slate-400 text-sm mt-1">
          Write and test SQL queries joining audience Data Extensions with hidden SFMC Data Views (_Sent, _Open, _Click, _Bounce, _Subscribers).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queries Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
          <div className="p-4 bg-slate-850 font-semibold text-sm text-slate-200 flex items-center justify-between">
            <span>Essential SFMC SQL Recipes</span>
            <span className="text-xs text-slate-400 font-normal">{templates.length} recipes</span>
          </div>
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTemplate(t)}
              className={`w-full text-left p-4 transition flex flex-col gap-1 ${
                selectedTemplate.id === t.id
                  ? 'bg-emerald-500/15 border-l-4 border-emerald-500'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-semibold uppercase">{t.category}</span>
                <span className="text-[11px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                  {t.targetDE}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-200 mt-0.5">{t.name}</span>
            </button>
          ))}

          <div className="p-4 bg-slate-950/70 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              SFMC SQL Rules to Remember:
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>No <code>SELECT *</code> permitted (must name fields explicitly).</li>
              <li>Queries time out strictly after 30 minutes in Automation Studio.</li>
              <li>Data Views hold up to 6 months (180 days) of historical events.</li>
            </ul>
          </div>
        </div>

        {/* Query Editor & Output */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  {selectedTemplate.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedTemplate.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyQuery}
                  className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Query'}
                </button>
                <button
                  onClick={handleRunQuery}
                  disabled={isRunning}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition shadow-md flex items-center gap-1.5"
                >
                  <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
                  {isRunning ? 'Executing...' : 'Run Query'}
                </button>
              </div>
            </div>

            {/* SQL Code Block */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Target Action: Update / Overwrite Data Extension: <code className="text-emerald-300">{selectedTemplate.targetDE}</code></span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">T-SQL 2016</span>
              </div>
              <textarea
                value={queryCode}
                onChange={(e) => setQueryCode(e.target.value)}
                rows={10}
                className="w-full bg-slate-950 p-4 text-xs font-mono text-emerald-300 focus:outline-none resize-y"
              />
            </div>

            {/* Output Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Query Result Preview ({outputData.length} records returned)
                </span>
                <span className="text-[11px] text-slate-500">Query execution time: 0.12s</span>
              </div>

              <div className="border border-slate-800 rounded-lg overflow-x-auto max-h-60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      {outputData.length > 0 &&
                        Object.keys(outputData[0]).map((col) => (
                          <th key={col} className="px-3.5 py-2 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {outputData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        {Object.values(row).map((val, colIdx) => (
                          <td key={colIdx} className="px-3.5 py-2 font-mono whitespace-nowrap text-slate-300">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

