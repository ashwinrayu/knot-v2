import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppState } from '@/context/AppStateContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  FileText, Clock, AlertTriangle, Users, CheckCircle2, GitPullRequest, 
  ArrowRight, Activity, Plus, Globe, Shield, RefreshCw, Cpu, ActivitySquare
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { evaluations, leads, auditLogs, institution } = useAppState();

  // Aggregate stats
  const totalUploads = evaluations.length;
  const pendingReviews = evaluations.filter(e => e.status === 'pending_review').length;
  const publishedReports = evaluations.filter(e => e.status === 'published').length;
  
  // Calculate average confidence
  const avgConfidence = totalUploads > 0 
    ? Math.round(evaluations.reduce((sum, e) => sum + e.confidenceScore, 0) / totalUploads * 10) / 10
    : 0;

  // Pie chart data: Leads conversion
  const leadsData = [
    { name: 'New', value: leads.filter(l => l.status === 'new').length, color: '#6366f1' },
    { name: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: '#3b82f6' },
    { name: 'Evaluating', value: leads.filter(l => l.status === 'evaluating').length, color: '#f59e0b' },
    { name: 'Won', value: leads.filter(l => l.status === 'won').length, color: '#10b981' },
    { name: 'Lost', value: leads.filter(l => l.status === 'lost').length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Area chart data: Volume over past 7 days
  const trendData = [
    { day: 'Mon', transcripts: 2 },
    { day: 'Tue', transcripts: 4 },
    { day: 'Wed', transcripts: 3 },
    { day: 'Thu', transcripts: 6 },
    { day: 'Fri', transcripts: 5 },
    { day: 'Sat', transcripts: 1 },
    { day: 'Sun', transcripts: 3 }
  ];

  // System nodes mock status
  const systemNodes = [
    { name: 'AI Magic Ingest Engine', latency: '240ms', load: '12%', status: 'nominal', description: 'Scans and parses transcript files' },
    { name: 'AI Magic Mapping Core', latency: '94ms', load: '8%', status: 'nominal', description: 'Maps equivalents and similarities' },
    { name: 'AI Magic Alignment Core', latency: '40ms', load: '3%', status: 'nominal', description: 'Validates grades and credit thresholds' }
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Top dashboard summary header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/50">
            Executive Control Workspace
          </span>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight mt-3">What's happening today?</h1>
          <p className="text-xs text-slate-400 mt-1">Live credit mapping operations and prospective students pipeline for {institution.name}.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/scraper"
            className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all flex items-center gap-1.5"
          >
            <Globe className="h-3.5 w-3.5 text-slate-450" />
            Ingest Catalog
          </Link>
          <Link
            to="/admin/catalog"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Register Course
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid (Premium minimal card look) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Transcripts Done */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Transcripts Done</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50/50 flex items-center justify-center"><FileText className="h-4.5 w-4.5 text-indigo-600" /></div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">{publishedReports}</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Transcripts fully mapped & published</p>
          </div>
        </div>

        {/* Card 2: Total Potential Leads */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Potential Leads</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50/50 flex items-center justify-center"><Users className="h-4.5 w-4.5 text-indigo-600" /></div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                {leads.filter(l => l.status === 'new' || l.status === 'contacted').length}
              </span>
            </div>
            <p className="text-[10px] text-slate-450 mt-1 font-bold">
              New: {leads.filter(l => l.status === 'new').length} · Contacted: {leads.filter(l => l.status === 'contacted').length}
            </p>
          </div>
        </div>

        {/* Card 3: Review Queue */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Review Queue</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50/50 flex items-center justify-center"><GitPullRequest className="h-4.5 w-4.5 text-amber-600 animate-pulse" /></div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">{pendingReviews}</span>
              {pendingReviews > 0 && <span className="text-[9px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Review Required</span>}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Files awaiting manual mapping audit</p>
          </div>
        </div>

        {/* Card 4: AI Magic Accuracy */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:border-slate-350 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">AI Magic Accuracy</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50/50 flex items-center justify-center"><Cpu className="h-4.5 w-4.5 text-indigo-600" /></div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">{avgConfidence}%</span>
              <span className="text-[10px] text-indigo-650 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">Confidence</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Average semantic mapping confidence</p>
          </div>
        </div>

      </div>

      {/* Main Charts & Diagnostics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart (2/3 width) */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)] lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Transfer Scanning Load</h3>
              <p className="text-[10px] text-slate-400">Weekly metric volume parameters</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-555 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50/50">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>Past 7 Days</span>
            </div>
          </div>
          
          <div className="h-64 text-xs font-semibold text-slate-400">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.001}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                />
                <Area type="monotone" dataKey="transcripts" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" name="Evaluations Complete" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Conversion Pipeline Chart (1/3 width) */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Lead Conversion Pipeline</h3>
            <p className="text-[10px] text-slate-400">Prospect students transfer stages</p>
          </div>
          
          <div className="h-44 relative flex items-center justify-center my-4 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {leadsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-display font-black text-slate-800">{leads.length}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Leads</span>
            </div>
          </div>

          {/* Legends list */}
          <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 font-semibold border-t border-slate-50 pt-4">
            {leadsData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Middle Grid: Active queue & system statuses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active evaluations list table (2/3 width) */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)] lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today's Evaluations queue</h3>
              <p className="text-[10px] text-slate-400">Incoming transfer files processing queue</p>
            </div>
            <Link 
              to="/admin/review" 
              className="text-xs font-bold text-indigo-600 hover:text-indigo-755 flex items-center gap-1 transition-colors"
            >
              Open Inbox
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          
          <div className="overflow-x-auto text-xs flex-grow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold pb-2 bg-slate-50/50">
                  <th className="p-3">Student</th>
                  <th className="p-3">Sending Institution</th>
                  <th className="p-3 text-center">Confidence</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluations.slice(0, 3).map((evalItem) => (
                  <tr key={evalItem.id} className="hover:bg-slate-50/30">
                    <td className="p-3">
                      <span className="font-semibold text-slate-800 block">{evalItem.studentName}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{evalItem.studentProgram}</span>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{evalItem.sendingInstitution}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        evalItem.confidenceScore >= 85 ? 'bg-emerald-50 text-emerald-700' :
                        evalItem.confidenceScore >= 70 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {evalItem.confidenceScore}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase ${
                        evalItem.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' :
                        evalItem.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100/50' :
                        'bg-amber-50 text-amber-700 border border-amber-100/50'
                      }`}>
                        {evalItem.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/evaluations/${evalItem.id}`)}
                        className="px-3.5 py-1.5 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-[10px] font-bold text-slate-700 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all"
                      >
                        Audit Matches
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI health visualizer panel (1/3 width) */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)] space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Shield className="h-4.5 w-4.5 text-indigo-500" />
              AI Model Diagnostics
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Live status logs of active neural nodes</p>
          </div>

          <div className="space-y-3.5">
            {systemNodes.map((node, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between gap-1 text-xs">
                <div className="flex justify-between items-center font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5 truncate">
                    <ActivitySquare className="h-3.5 w-3.5 text-slate-400" />
                    {node.name}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">{node.description}</p>
                <div className="flex gap-4 mt-2 pt-2 border-t border-slate-100/50 text-[10px] text-slate-500">
                  <span>Latency: <strong className="text-slate-700">{node.latency}</strong></span>
                  <span>CPU: <strong className="text-slate-700">{node.load}</strong></span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[9px] text-slate-400 leading-normal text-center bg-slate-50 p-2.5 border border-slate-100 rounded-lg">
            System load averages: <strong className="text-slate-650">0.08</strong>. AI Magic Ingest compilation running normal.
          </p>
        </div>

      </div>

      {/* Bottom Row: Recent audits logs activity flow */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)] space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Platform Activity Audit Log</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Logs of recent settings, configurations, and decisions overrides</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {auditLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-4 rounded-xl border border-slate-150 bg-slate-50/20 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-800">{log.action}</span>
                  <span className="text-[9px] text-slate-400 font-semibold">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[10px] text-slate-550 leading-relaxed font-medium">{log.details}</p>
              </div>
              <div className="border-t border-slate-100/50 pt-2.5 mt-3 flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                <span>By: {log.userName}</span>
                <span>Role: {log.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
