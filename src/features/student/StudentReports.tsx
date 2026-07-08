import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../../components/ui/Card';
import { 
  FileSpreadsheet, Download, Printer, Share2, 
  Search, Eye, CheckCircle2, FileText, AlertCircle 
} from 'lucide-react';

export const StudentReports: React.FC = () => {
  const { user } = useAuth();
  const { evaluations, triggerSystemNotification } = useAppState();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  const studentEvaluations = evaluations.filter(e => 
    e.studentName.toLowerCase().includes(user?.name.toLowerCase() || '') &&
    (e.status === 'published' || e.status === 'pending_review')
  );

  const filteredReports = studentEvaluations.filter(e => 
    e.sendingInstitution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeReport = studentEvaluations.find(e => e.id === activeReportId) || studentEvaluations[0];

  const handleShare = () => {
    triggerSystemNotification('Secure link generated. Link copied to clipboard.', 'success');
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      
      <div className="border-b pb-5 select-none">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Transfer Credit Reports</h1>
        <p className="text-xs text-slate-400 mt-1">Download and print audited transcript mapping evaluations records.</p>
      </div>

      {studentEvaluations.length === 0 ? (
        <Card className="p-16 text-center text-slate-400 space-y-4">
          <FileSpreadsheet className="h-10 w-10 mx-auto text-slate-200" />
          <p className="text-sm font-semibold text-slate-655">No credit reports available</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-normal">
            Your transfer evaluation reports will appear here once parsed transcripts are published.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT: Reports List & Search */}
          <div className="space-y-4 lg:col-span-1">
            <div className="relative select-none">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search institutional reports..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              {filteredReports.map((report) => (
                <Card 
                  key={report.id}
                  onClick={() => setActiveReportId(report.id)}
                  className={`p-4 cursor-pointer transition-all border ${
                    activeReport?.id === report.id 
                      ? 'border-indigo-500 bg-indigo-50/10 shadow-sm' 
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    <FileSpreadsheet className="h-5 w-5 text-indigo-550 flex-shrink-0" />
                    <div className="truncate font-semibold">
                      <span className="text-slate-800 font-bold block truncate">{report.sendingInstitution}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{new Date(report.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* RIGHT: Document Action Dashboard & Preview */}
          {activeReport && (
            <div className="lg:col-span-2 space-y-4">
              
              {/* Document Actions Bar */}
              <Card className="p-4 flex justify-between items-center select-none shadow-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs block">{activeReport.sendingInstitution} Report</h3>
                  <span className="text-[9px] text-slate-405 block font-semibold mt-0.5">Approved Credits Summary Sheet</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => triggerSystemNotification('Initiated PDF compilation sequence...', 'info')}
                    className="p-2 border rounded-xl hover:bg-slate-50 text-slate-500 flex items-center justify-center bg-white shadow-xs"
                    title="Download Report"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2 border rounded-xl hover:bg-slate-50 text-slate-500 flex items-center justify-center bg-white shadow-xs"
                    title="Print Report"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 border rounded-xl hover:bg-slate-50 text-slate-500 flex items-center justify-center bg-white shadow-xs"
                    title="Share Report"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>

              {/* PDF Preview Screen container */}
              <Card className="p-6 space-y-6 bg-slate-900 text-white min-h-[50vh] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-indigo-900 to-slate-950" />
                
                {/* PDF Header block */}
                <div className="relative z-10 flex justify-between items-start border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block font-display">Knot University</span>
                    <h2 className="text-lg font-black text-white mt-1 leading-tight">Official Transfer Audit Transcript</h2>
                  </div>
                  <span className="text-[9px] border border-slate-800 bg-slate-850 px-2 py-0.5 rounded font-mono uppercase tracking-wider text-slate-400">
                    ID: {activeReport.id.substring(0, 8)}
                  </span>
                </div>

                {/* PDF Content body */}
                <div className="relative z-10 space-y-4 flex-grow py-6 text-[10px] leading-relaxed">
                  <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-4 font-semibold text-slate-400">
                    <div>
                      <span className="text-[8px] uppercase block tracking-wider font-bold">Transfer Student</span>
                      <span className="text-white block mt-0.5">{activeReport.studentName}</span>
                      <span>Target: {activeReport.studentProgram}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] uppercase block tracking-wider font-bold">Origin Institution</span>
                      <span className="text-white block mt-0.5">{activeReport.sendingInstitution}</span>
                      <span>Audited on: {new Date(activeReport.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Mapped courses equivalents list inside PDF */}
                  <div className="space-y-2">
                    <span className="text-[8px] text-slate-450 uppercase block tracking-wider font-bold">Equivalent Mappings Granted</span>
                    <div className="space-y-1.5 font-mono text-[9px]">
                      {activeReport.courses.map((course, i) => (
                        <div key={i} className="flex justify-between items-center py-1 border-b border-slate-850/50">
                          <span>{course.code} {course.title}</span>
                          <span className="text-slate-400">⟶</span>
                          <span className="text-indigo-300 font-bold">{course.matchedCourseCode || 'Elective'} ({course.status.toUpperCase()})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PDF Footer signatures */}
                <div className="relative z-10 border-t border-slate-800 pt-4 flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Authorized by registrar office</span>
                  <span>Knot Mapping matrix v2.0</span>
                </div>
              </Card>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
export { StudentReports as default };
