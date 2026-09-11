'use client';

import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Table, 
  GitFork, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Key, 
  Layers, 
  Clock, 
  Search, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import { SFMCDataExtension, JourneyActivityExecutionLog } from '@/lib/sfmc-mock';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<string>('');
  const [dataExtensions, setDataExtensions] = useState<SFMCDataExtension[]>([]);
  const [selectedDE, setSelectedDE] = useState<SFMCDataExtension | null>(null);
  const [activityLogs, setActivityLogs] = useState<JourneyActivityExecutionLog[]>([]);
  const [activeTab, setActiveTab] = useState<'schema' | 'logs'>('schema');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredDEs = dataExtensions.filter(
    (de) =>
      de.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      de.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Hero Banner with Modern Gradient Mesh & Glow */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-white/[0.08] p-7 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-300" />
                Salesforce Labs App
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {mode === 'MOCK_SANDBOX' ? 'Sandbox API Active' : 'Live SFMC Connected'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Marketing Cloud Schema Explorer
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Visualize Data Extensions, map relational subscriber models, inspect field metadata, and monitor Journey Activity executions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSchemaData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.07] hover:bg-white/[0.12] text-slate-100 border border-white/[0.1] text-xs font-semibold rounded-xl transition duration-200 shadow-sm hover:scale-105 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Schema
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/70 border border-white/[0.08] p-6 backdrop-blur-xl shadow-lg hover:border-blue-500/40 transition duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Data Extensions
            </span>
            <div className="p-2.5 bg-blue-500/15 text-blue-400 rounded-xl group-hover:scale-110 transition duration-300 border border-blue-500/20">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3 tracking-tight">
            {dataExtensions.length}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>Registered in Contact Model</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-900/70 border border-white/[0.08] p-6 backdrop-blur-xl shadow-lg hover:border-indigo-500/40 transition duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Contact Rows
            </span>
            <div className="p-2.5 bg-indigo-500/15 text-indigo-400 rounded-xl group-hover:scale-110 transition duration-300 border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3 tracking-tight">
            {dataExtensions.reduce((a, b) => a + b.rowCount, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Synced across all tables</div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-900/70 border border-white/[0.08] p-6 backdrop-blur-xl shadow-lg hover:border-purple-500/40 transition duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Custom Activity Executions
            </span>
            <div className="p-2.5 bg-purple-500/15 text-purple-400 rounded-xl group-hover:scale-110 transition duration-300 border border-purple-500/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3 tracking-tight">
            {activityLogs.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Live webhook events processed</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveTab('schema')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
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
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
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
          <div className="rounded-2xl bg-slate-900/80 border border-white/[0.08] overflow-hidden shadow-xl flex flex-col h-[650px]">
            <div className="p-4 bg-white/[0.02] border-b border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  Data Extensions
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {filteredDEs.length} tables
                </span>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter tables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="divide-y divide-white/[0.04] overflow-y-auto flex-1">
              {filteredDEs.map((de) => (
                <button
                  key={de.id}
                  onClick={() => setSelectedDE(de)}
                  className={`w-full text-left p-4 transition-all duration-200 flex flex-col gap-1.5 ${
                    selectedDE?.id === de.id
                      ? 'bg-blue-600/15 border-l-4 border-blue-500 shadow-inner'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-100 truncate">{de.name}</span>
                    {de.isSendable && (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        Sendable
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <FolderOpen className="w-3 h-3 text-slate-500" />
                    <span className="truncate">{de.folder}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1 pt-1 border-t border-white/[0.04]">
                    <span>{de.fields.length} fields</span>
                    <span className="font-mono text-slate-300">{de.rowCount.toLocaleString()} rows</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DE Details & Fields */}
          <div className="lg:col-span-2 space-y-6">
            {selectedDE && (
              <div className="rounded-2xl bg-slate-900/80 border border-white/[0.08] p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/[0.08] pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-white">{selectedDE.name}</h2>
                      {selectedDE.isSendable && (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                          Sendable DE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{selectedDE.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">CustomerKey</span>
                    <code className="text-xs text-blue-300 bg-slate-950 px-2.5 py-1 rounded-lg font-mono border border-white/[0.08]">
                      {selectedDE.customerKey}
                    </code>
                  </div>
                </div>

                {/* Relationships / Entity Links */}
                {selectedDE.relatedDEs.length > 0 && (
                  <div className="rounded-xl bg-purple-950/20 border border-purple-500/20 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
                      <GitFork className="w-4 h-4 text-purple-400" />
                      Entity Relationship Graph (Schema Links)
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedDE.relatedDEs.map((rel, idx) => (
                        <div
                          key={idx}
                          className="bg-purple-900/30 border border-purple-700/40 text-xs px-3 py-2 rounded-xl text-purple-200 flex items-center gap-2 shadow-sm"
                        >
                          <span className="font-bold text-white">{selectedDE.name}.{rel.sourceField}</span>
                          <span className="text-purple-400 font-bold">➔</span>
                          <span className="font-bold text-white">{rel.targetDE}.{rel.targetField}</span>
                          <span className="text-[10px] bg-purple-500/30 text-purple-200 font-semibold px-2 py-0.5 rounded-full border border-purple-400/30">
                            {rel.relationshipType}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fields Table */}
                <div>
                  <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                    <Table className="w-4 h-4 text-blue-400" />
                    Field Definitions ({selectedDE.fields.length})
                  </h3>
                  <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-slate-950/40">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/[0.03] text-slate-400 font-bold uppercase tracking-wider border-b border-white/[0.08]">
                        <tr>
                          <th className="px-4 py-3">Field Name</th>
                          <th className="px-4 py-3">Data Type</th>
                          <th className="px-4 py-3 text-center">Primary Key</th>
                          <th className="px-4 py-3 text-center">Required</th>
                          <th className="px-4 py-3">Length / Config</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-slate-300">
                        {selectedDE.fields.map((f, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition">
                            <td className="px-4 py-3 font-semibold text-slate-100 flex items-center gap-2">
                              {f.isPrimaryKey && <Key className="w-3.5 h-3.5 text-amber-400 inline" />}
                              {f.name}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.06] font-mono text-slate-300 text-[11px]">
                                {f.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {f.isPrimaryKey ? (
                                <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                  PK
                                </span>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {f.isRequired ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
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
        /* Journey Activity Execution Logs */
        <div className="rounded-2xl bg-slate-900/80 border border-white/[0.08] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Custom Journey Activity Execution Audit Trail
            </h2>
            <span className="text-xs text-slate-400">Updates live when contacts pass through custom activity</span>
          </div>

          <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-slate-950/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 font-bold uppercase tracking-wider border-b border-white/[0.08]">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Contact Key</th>
                  <th className="px-4 py-3">Journey</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3">InArguments</th>
                  <th className="px-4 py-3">OutArguments / Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-300">
                {activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap flex items-center gap-1.5 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-blue-300 font-semibold">{log.contactKey}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{log.journeyName}</td>
                    <td className="px-4 py-3 text-center">
                      {log.status === 'SUCCESS' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[11px]">
                          SUCCESS
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold text-[11px] flex items-center gap-1 justify-center">
                          <AlertCircle className="w-3 h-3" /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <pre className="bg-slate-950 p-2 rounded-lg border border-white/[0.06] text-[11px] font-mono text-slate-300 max-w-xs overflow-x-auto">
                        {JSON.stringify(log.inArguments, null, 2)}
                      </pre>
                    </td>
                    <td className="px-4 py-3">
                      <pre className="bg-slate-950 p-2 rounded-lg border border-white/[0.06] text-[11px] font-mono text-emerald-300 max-w-xs overflow-x-auto">
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
