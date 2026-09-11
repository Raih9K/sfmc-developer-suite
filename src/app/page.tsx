'use client';

import React, { useEffect, useState } from 'react';
import { Database, Table, GitFork, Activity, CheckCircle, AlertCircle, RefreshCw, Key, Layers, Clock } from 'lucide-react';
import { SFMCDataExtension, JourneyActivityExecutionLog } from '@/lib/sfmc-mock';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<string>('');
  const [dataExtensions, setDataExtensions] = useState<SFMCDataExtension[]>([]);
  const [selectedDE, setSelectedDE] = useState<SFMCDataExtension | null>(null);
  const [activityLogs, setActivityLogs] = useState<JourneyActivityExecutionLog[]>([]);
  const [activeTab, setActiveTab] = useState<'schema' | 'logs'>('schema');

  const fetchSchemaData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sfmc/schema');
      const data = await res.json();
      if (data.success) {
        setDataExtensions(data.dataExtensions);
        setActivityLogs(data.recentActivityLogs);
        setMode(data.mode);
        if (data.dataExtensions.length > 0 && !selectedDE) {
          setSelectedDE(data.dataExtensions[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load SFMC schema', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemaData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner / SFMC App Info */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950 border border-blue-800/40 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Marketing Cloud Schema Explorer</h1>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {mode === 'MOCK_SANDBOX' ? 'Sandbox API Mode' : 'Connected to SFMC'}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Salesforce Marketing Cloud AppExchange Component (Embedded Dashboard in iFrame)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSchemaData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Extensions</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{dataExtensions.length}</div>
          <div className="text-xs text-slate-500 mt-1">Registered in Contact Model</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Records</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {dataExtensions.reduce((a, b) => a + b.rowCount, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Synced contacts & rows</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Custom Activity Hits</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{activityLogs.length}</div>
          <div className="text-xs text-slate-500 mt-1">Journey executions logged</div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('schema')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'schema'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-4 h-4" />
          Data Extensions & Schema Graph
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Live Journey Activity Executions ({activityLogs.length})
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'schema' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DE List Sidebar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-800 font-semibold text-sm text-slate-200 flex items-center justify-between">
              <span>Data Extensions</span>
              <span className="text-xs text-slate-400 font-normal">{dataExtensions.length} tables</span>
            </div>
            <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto">
              {dataExtensions.map((de) => (
                <button
                  key={de.id}
                  onClick={() => setSelectedDE(de)}
                  className={`w-full text-left px-4 py-3 transition flex flex-col gap-1 ${
                    selectedDE?.id === de.id ? 'bg-blue-600/15 border-l-4 border-blue-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-slate-200 truncate">{de.name}</span>
                    {de.isSendable && (
                      <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] px-1.5 py-0.2 rounded">
                        Sendable
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{de.fields.length} fields</span>
                    <span>{de.rowCount.toLocaleString()} rows</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DE Details & Fields */}
          <div className="lg:col-span-2 space-y-6">
            {selectedDE && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-400" />
                      {selectedDE.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedDE.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">CustomerKey:</span>
                    <code className="text-xs text-blue-300 bg-slate-800 px-2 py-0.5 rounded font-mono">
                      {selectedDE.customerKey}
                    </code>
                  </div>
                </div>

                {/* Relationships section */}
                {selectedDE.relatedDEs.length > 0 && (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                      <GitFork className="w-4 h-4 text-purple-400" />
                      Entity Relationships (Schema Graph Link)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedDE.relatedDEs.map((rel, idx) => (
                        <div
                          key={idx}
                          className="bg-purple-950/40 border border-purple-800/40 text-xs px-3 py-1.5 rounded-md text-purple-300 flex items-center gap-2"
                        >
                          <span className="font-semibold">{selectedDE.name}.{rel.sourceField}</span>
                          <span className="text-slate-500">➔</span>
                          <span className="font-semibold text-purple-200">{rel.targetDE}.{rel.targetField}</span>
                          <span className="text-[10px] bg-purple-900/60 px-1 rounded text-purple-400">
                            {rel.relationshipType}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fields Table */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <Table className="w-4 h-4 text-slate-400" />
                    Field Definitions ({selectedDE.fields.length})
                  </h3>
                  <div className="border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="px-3.5 py-2.5">Field Name</th>
                          <th className="px-3.5 py-2.5">Data Type</th>
                          <th className="px-3.5 py-2.5 text-center">Primary Key</th>
                          <th className="px-3.5 py-2.5 text-center">Required</th>
                          <th className="px-3.5 py-2.5">Length / Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {selectedDE.fields.map((f, i) => (
                          <tr key={i} className="hover:bg-slate-800/30">
                            <td className="px-3.5 py-2.5 font-medium text-slate-200 flex items-center gap-1.5">
                              {f.isPrimaryKey && <Key className="w-3.5 h-3.5 text-amber-400 inline" />}
                              {f.name}
                            </td>
                            <td className="px-3.5 py-2.5">
                              <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                                {f.type}
                              </span>
                            </td>
                            <td className="px-3.5 py-2.5 text-center">
                              {f.isPrimaryKey ? (
                                <span className="text-amber-400 font-semibold">PK</span>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="px-3.5 py-2.5 text-center">
                              {f.isRequired ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mx-auto" />
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="px-3.5 py-2.5 text-slate-400">
                              {f.length ? `${f.length} chars` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Journey Activity Execution Logs View */
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Custom Journey Activity Execution Audit Trail
            </h2>
            <span className="text-xs text-slate-400">Updates live when contacts pass through custom activity</span>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-3.5 py-2.5">Timestamp</th>
                  <th className="px-3.5 py-2.5">Contact Key</th>
                  <th className="px-3.5 py-2.5">Journey</th>
                  <th className="px-3.5 py-2.5 text-center">Status</th>
                  <th className="px-3.5 py-2.5">InArguments</th>
                  <th className="px-3.5 py-2.5">OutArguments / Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="px-3.5 py-2.5 text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-blue-300">{log.contactKey}</td>
                    <td className="px-3.5 py-2.5">{log.journeyName}</td>
                    <td className="px-3.5 py-2.5 text-center">
                      {log.status === 'SUCCESS' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                          SUCCESS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1 justify-center">
                          <AlertCircle className="w-3 h-3" /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <pre className="bg-slate-950 p-1.5 rounded text-[11px] font-mono text-slate-300 max-w-xs overflow-x-auto">
                        {JSON.stringify(log.inArguments, null, 2)}
                      </pre>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <pre className="bg-slate-950 p-1.5 rounded text-[11px] font-mono text-emerald-300 max-w-xs overflow-x-auto">
                        {JSON.stringify(log.outArguments, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
