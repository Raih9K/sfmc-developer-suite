'use client';

import React, { useState } from 'react';
import { GitCommit, Search, Play, Copy, Check, Filter, Layers, Database, ArrowRight } from 'lucide-react';

interface SimulatedJourney {
  id: string;
  name: string;
  status: 'Running' | 'Draft' | 'Paused';
  version: number;
  contactCount: number;
  entrySourceDE: string;
  activities: {
    activityId: string;
    name: string;
    type: string;
    completedCount: number;
  }[];
}

const mockJourneys: SimulatedJourney[] = [
  {
    id: 'e4f21a88-9912-4d11-b0e1-4c1234567890',
    name: 'Cart Abandonment Recovery 2026',
    status: 'Running',
    version: 3,
    contactCount: 14230,
    entrySourceDE: 'Abandoned_Cart_Events',
    activities: [
      { activityId: 'act-001', name: 'Smart Webhook & Loyalty Rewarder', type: 'CUSTOM_ACTIVITY', completedCount: 14190 },
      { activityId: 'act-002', name: 'Recovery Follow-up Email', type: 'EMAIL', completedCount: 12450 },
      { activityId: 'act-003', name: 'VIP Discount SMS Alert', type: 'SMS', completedCount: 3120 }
    ]
  },
  {
    id: 'b1c34d22-1049-4f78-a291-9876543210ab',
    name: 'Welcome & Customer Onboarding Stream',
    status: 'Running',
    version: 1,
    contactCount: 245890,
    entrySourceDE: 'Master_Customer_Profiles',
    activities: [
      { activityId: 'act-101', name: 'Welcome Email 1 (Intro)', type: 'EMAIL', completedCount: 245890 },
      { activityId: 'act-102', name: 'Smart Webhook & Loyalty Rewarder', type: 'CUSTOM_ACTIVITY', completedCount: 198300 }
    ]
  },
  {
    id: 'f9a8b7c6-2233-4455-6677-8899aabbccdd',
    name: 'Re-engagement Winback Campaign',
    status: 'Paused',
    version: 2,
    contactCount: 52100,
    entrySourceDE: 'Unengaged_Subscribers_30d',
    activities: [
      { activityId: 'act-201', name: 'Winback 25% Off Voucher Email', type: 'EMAIL', completedCount: 52100 },
      { activityId: 'act-202', name: 'Wait By Duration (5 Days)', type: 'WAIT', completedCount: 51900 }
    ]
  }
];

export default function JourneyQueryBuilderPage() {
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(mockJourneys[0].id);
  const [metricFilter, setMetricFilter] = useState<'ALL' | 'OPENS' | 'CLICKS' | 'BOUNCES'>('ALL');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [queryResult, setQueryResult] = useState<Record<string, unknown>[] | null>(null);

  const currentJourney = mockJourneys.find((j) => j.id === selectedJourneyId) || mockJourneys[0];

  // Dynamically generate the precise SFMC SQL query combining _Journey, _JourneyActivity, _Sent, _Open, _Click
  const generateSQL = () => {
    return `/* SFMC SQL: Query Analytics & Contacts by Journey ID */
SELECT 
    j.JourneyID,
    j.JourneyName,
    j.VersionNumber,
    ja.ActivityID,
    ja.ActivityName,
    ja.ActivityType,
    sent.SubscriberKey,
    sent.EventDate AS SentTime,
    open.EventDate AS OpenTime,
    click.EventDate AS ClickTime,
    click.URL AS ClickedLink
FROM _Journey j
JOIN _JourneyActivity ja 
    ON j.VersionID = ja.VersionID
JOIN _Sent sent 
    ON ja.JourneyActivityObjectID = sent.TriggererSendDefinitionObjectID
LEFT JOIN _Open open 
    ON sent.JobID = open.JobID 
    AND sent.ListID = open.ListID 
    AND sent.BatchID = open.BatchID 
    AND sent.SubscriberKey = open.SubscriberKey
LEFT JOIN _Click click 
    ON sent.JobID = click.JobID 
    AND sent.SubscriberKey = click.SubscriberKey
WHERE j.JourneyID = '${selectedJourneyId}'
${metricFilter === 'OPENS' ? '  AND open.SubscriberKey IS NOT NULL' : ''}
${metricFilter === 'CLICKS' ? '  AND click.SubscriberKey IS NOT NULL' : ''}
${metricFilter === 'BOUNCES' ? '  AND sent.SubscriberKey IN (SELECT SubscriberKey FROM _Bounce WHERE JobID = sent.JobID)' : ''}
ORDER BY sent.EventDate DESC;`;
  };

  const handleExecuteQuery = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      // Generate realistic sample output based on current journey
      setQueryResult([
        {
          SubscriberKey: 'CUST-98231',
          JourneyName: currentJourney.name,
          ActivityName: currentJourney.activities[0].name,
          SentTime: '2026-09-11 06:45:10',
          OpenTime: '2026-09-11 06:48:22',
          ClickTime: '2026-09-11 06:49:05',
          ClickedLink: 'https://myshop.com/cart/recover?discount=FLASH-20OFF'
        },
        {
          SubscriberKey: 'CUST-44120',
          JourneyName: currentJourney.name,
          ActivityName: currentJourney.activities[0].name,
          SentTime: '2026-09-11 07:10:00',
          OpenTime: '2026-09-11 07:12:40',
          ClickTime: 'NULL',
          ClickedLink: 'NULL'
        },
        {
          SubscriberKey: 'CUST-11002',
          JourneyName: currentJourney.name,
          ActivityName: currentJourney.activities[1]?.name || 'Follow-up Email',
          SentTime: '2026-09-11 07:30:15',
          OpenTime: 'NULL',
          ClickTime: 'NULL',
          ClickedLink: 'NULL'
        }
      ]);
    }, 500);
  };

  const copySQL = () => {
    navigator.clipboard.writeText(generateSQL());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 border border-violet-800/40 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <GitCommit className="w-4 h-4" />
          Journey Builder SQL Query & Analytics Generator
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Journey ID Query Builder</h1>
        <p className="text-slate-400 text-sm mt-1">
          Generate accurate Automation Studio SQL queries joining <code>_Journey</code>, <code>_JourneyActivity</code>, <code>_Sent</code>, and <code>_Open</code> by Journey ID or Version ID.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Selector Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
          <div className="p-4 bg-slate-850 font-semibold text-sm text-slate-200 flex items-center justify-between">
            <span>Select Target Journey</span>
            <span className="text-xs text-slate-400 font-normal">{mockJourneys.length} journeys</span>
          </div>

          {mockJourneys.map((j) => (
            <button
              key={j.id}
              onClick={() => {
                setSelectedJourneyId(j.id);
                setQueryResult(null);
              }}
              className={`w-full text-left p-4 transition flex flex-col gap-1.5 ${
                selectedJourneyId === j.id
                  ? 'bg-violet-600/15 border-l-4 border-violet-500'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-100">{j.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    j.status === 'Running'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {j.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Version {j.version}</span>
                <span>{j.contactCount.toLocaleString()} Contacts</span>
              </div>
              <code className="text-[10px] font-mono text-slate-500 truncate block mt-0.5">
                ID: {j.id}
              </code>
            </button>
          ))}

          {/* Metric Filter */}
          <div className="p-4 bg-slate-950/70 space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-violet-400" />
              Filter By Interaction Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['ALL', 'OPENS', 'CLICKS', 'BOUNCES'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setMetricFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    metricFilter === filter
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic SQL & Execution Panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Journey Snapshot */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-400" />
                  {currentJourney.name}
                </h2>
                <span className="text-xs text-slate-400">Entry Source DE: <code className="text-violet-300">{currentJourney.entrySourceDE}</code></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copySQL}
                  className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Query'}
                </button>
                <button
                  onClick={handleExecuteQuery}
                  disabled={isRunning}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition shadow-md flex items-center gap-1.5"
                >
                  <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
                  {isRunning ? 'Executing...' : 'Run Query'}
                </button>
              </div>
            </div>

            {/* Activities In Journey */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-1.5">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Canvas Steps in Journey:</div>
              <div className="flex flex-wrap gap-2">
                {currentJourney.activities.map((act) => (
                  <span
                    key={act.activityId}
                    className="bg-slate-900 border border-slate-700 text-xs px-2.5 py-1 rounded text-slate-300 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                    {act.name} ({act.completedCount.toLocaleString()} processed)
                  </span>
                ))}
              </div>
            </div>

            {/* Generated SQL Display */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Automation Studio Target: <code className="text-violet-300">_Journey & _JourneyActivity</code></span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">T-SQL 2016</span>
              </div>
              <pre className="bg-slate-950 p-4 text-xs font-mono text-violet-300 overflow-x-auto max-h-72">
                {generateSQL()}
              </pre>
            </div>

            {/* Result Table Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Query Result Preview {queryResult ? `(${queryResult.length} rows)` : ''}
                </span>
                <span className="text-[11px] text-slate-500">Filters applied: {metricFilter}</span>
              </div>

              {queryResult ? (
                <div className="border border-slate-800 rounded-lg overflow-x-auto max-h-60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
                      <tr>
                        {Object.keys(queryResult[0]).map((col) => (
                          <th key={col} className="px-3.5 py-2 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {queryResult.map((row, idx) => (
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
              ) : (
                <div className="p-8 text-center bg-slate-950/40 border border-slate-800/60 rounded-lg text-slate-500 text-xs">
                  Click <strong>Run Query</strong> to execute this query against simulated Journey Data Views.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

