import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/context/AppStateContext';
import { Search, Printer, Download, Eye, Calendar, Award, BookOpen, Clock, AlertCircle } from 'lucide-react';

export const StudentReports: React.FC = () => {
  const navigate = useNavigate();
  const { evaluations, triggerSystemNotification } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter evaluations
  const filteredReports = evaluations.filter(e => {
    const matchesSearch = e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.sendingInstitution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const publishedCount = evaluations.filter(e => e.status === 'published').length;
  const pendingCount = evaluations.filter(e => e.status === 'pending_review').length;
  const avgTransferRate = '84.8%';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/50">
          Document archives
        </span>
        <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight mt-3">Student Reports</h1>
        <p className="text-xs text-slate-400 mt-1">Audit, print, and download compiled credit equivalence matrices.</p>
      </div>

      {/* Stats summaries cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Published reports</span>
            <p className="text-xl font-display font-extrabold text-slate-800 mt-0.5">{publishedCount} Files</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Awaiting Audits</span>
            <p className="text-xl font-display font-extrabold text-slate-800 mt-0.5">{pendingCount} Files</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Avg Transfer success</span>
            <p className="text-xl font-display font-extrabold text-slate-800 mt-0.5">{avgTransferRate}</p>
          </div>
        </div>
      </div>

      {/* Control filters bar */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-450" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student name or origin school..."
            className="w-full pl-10 pr-4 py-2 text-[10px] border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-slate-50/50"
          />
        </div>

        {/* Status filters */}
        <div className="flex gap-1.5 flex-wrap w-full sm:w-auto font-bold select-none text-[9px] uppercase tracking-wider">
          {['All', 'published', 'pending_review', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === status
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-555 hover:bg-slate-100'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table List */}
      <div className="bg-white border border-slate-200/60 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.015)] overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold">
                <th className="p-4">Student</th>
                <th className="p-4">Sending School</th>
                <th className="p-4">Transfer Course Count</th>
                <th className="p-4 text-center">Avg Confidence</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 italic">No matching reports found in database archive.</td>
                </tr>
              ) : (
                filteredReports.map(report => {
                  const transferrableCredits = report.courses
                    .filter(c => c.status === 'approved')
                    .reduce((sum, c) => sum + (c.receivingCredits || 0), 0);

                  return (
                    <tr key={report.id} className="hover:bg-slate-50/30">
                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">{report.studentName}</span>
                        <span className="text-[10px] text-slate-450 mt-0.5 block font-semibold flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(report.uploadedAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{report.sendingInstitution}</td>
                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">{report.courses.length} courses scanned</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{transferrableCredits} credits transferrable</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          report.confidenceScore >= 85 ? 'bg-emerald-50 text-emerald-700' :
                          report.confidenceScore >= 70 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {report.confidenceScore}%
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          report.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' :
                          report.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100/50' :
                          'bg-amber-50 text-amber-700 border border-amber-100/50'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => navigate(`/admin/evaluations/${report.id}`)}
                            className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-lg shadow-sm bg-white"
                            title="Inspect mappings"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-400" />
                          </button>
                          <button
                            onClick={() => triggerSystemNotification('Initiated PDF compilation sequence...', 'info')}
                            className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-lg shadow-sm bg-white"
                            title="Download PDF"
                          >
                            <Download className="h-3.5 w-3.5 text-slate-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
