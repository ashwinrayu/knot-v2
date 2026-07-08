import React from 'react';
import { useAppState } from '@/context/AppStateContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { Sparkles, Calendar, TrendingUp, Cpu, Award } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { evaluations, leads } = useAppState();

  // Aggregate evaluations volume
  const totalReports = evaluations.length;
  const publishedCount = evaluations.filter(e => e.status === 'published').length;

  const monthlyVolumeData = [
    { month: 'Jan', volume: 15, accuracy: 88 },
    { month: 'Feb', volume: 22, accuracy: 89 },
    { month: 'Mar', volume: 28, accuracy: 91 },
    { month: 'Apr', volume: 35, accuracy: 90 },
    { month: 'May', volume: 42, accuracy: 92 },
    { month: 'Jun', volume: 48, accuracy: 93 },
    { month: 'Jul', volume: totalReports, accuracy: 94 }
  ];

  // Sending colleges distribution
  const sendingCollegesData = [
    { name: 'Bay Area CC', count: 8, credits: 32 },
    { name: 'State Metro', count: 5, credits: 20 },
    { name: 'Northern Lakes', count: 4, credits: 12 },
    { name: 'Pasadena City', count: 3, credits: 16 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Executive Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Review system automation rates and credit mapping performance metrics</p>
      </div>

      {/* KPI summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Transcripts Mapped</span>
            <p className="text-2xl font-display font-extrabold text-slate-900 mt-0.5">{totalReports}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">AI Auto-Publish Rate</span>
            <p className="text-2xl font-display font-extrabold text-slate-900 mt-0.5">
              {totalReports > 0 ? Math.round((publishedCount / totalReports) * 100) : 0}%
            </p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Average Match Accuracy</span>
            <p className="text-2xl font-display font-extrabold text-slate-900 mt-0.5">91.3%</p>
          </div>
        </div>
      </div>

      {/* Charts panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Area: Monthly scans */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Historical Scans Volume</h3>
              <p className="text-[10px] text-slate-400">Monthly evaluation requests</p>
            </div>
          </div>
          <div className="h-64 text-xs font-semibold text-slate-400">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" name="Evaluations Complete" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar: Mapped Colleges */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Sending Institutions</h3>
              <p className="text-[10px] text-slate-400">Schools representing highest credit transfers</p>
            </div>
          </div>
          <div className="h-64 text-xs font-semibold text-slate-400">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sendingCollegesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} name="Transcripts Sent" />
                <Bar dataKey="credits" fill="#10b981" radius={[4, 4, 0, 0]} name="Transferred Credits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
