import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  FileText, Clock, CheckCircle2, XCircle, Sparkles, 
  ArrowRight, UploadCloud, HelpCircle, FileSpreadsheet, Activity, 
  Plus, Inbox, AlertCircle, FileSearch, Compass
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { evaluations } = useAppState();

  const studentEvaluations = evaluations.filter(e => 
    e.studentName.toLowerCase().includes(user?.name.toLowerCase() || '')
  );

  const totalEvaluations = studentEvaluations.length;
  const pendingCount = studentEvaluations.filter(e => e.status === 'processing' || e.status === 'pending_review').length;
  const completedCount = studentEvaluations.filter(e => e.status === 'published').length;

  let approvedCredits = 0;
  let rejectedCourses = 0;
  let alternativeRecommendations = 0;

  studentEvaluations.forEach(ev => {
    ev.courses.forEach(c => {
      if (c.status === 'approved') {
        approvedCredits += c.receivingCredits || 0;
      } else if (c.status === 'rejected') {
        rejectedCourses += 1;
        if (c.alternativeSuggestions && c.alternativeSuggestions.length > 0) {
          alternativeRecommendations += c.alternativeSuggestions.length;
        }
      }
    });
  });

  const recentActivities = [
    { text: 'Transcript ingested via AI Magic Scan', date: 'Just now', icon: <FileSearch className="h-3 w-3 text-indigo-500" /> },
    { text: 'Mapping comparison rules checked', date: '2 mins ago', icon: <Activity className="h-3 w-3 text-indigo-500" /> },
    { text: 'Student profile verified', date: '10 mins ago', icon: <CheckCircle2 className="h-3 w-3 text-emerald-500" /> }
  ];

  const upcomingTasks = [
    { title: 'Upload missing CS Syllabus', desc: 'Required by advisor to resolve credit match overlaps.', due: 'Due in 2 days', action: 'Upload' },
    { title: 'Schedule Advisor meeting', desc: 'Verify elective credits calculations.', due: 'Optional', action: 'Meet' }
  ];

  return (
    <div className="space-y-8 pb-10 font-sans text-xs">
      
      {/* Welcome Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5 select-none">
        <div>
          <span className="text-[10px] text-indigo-650 font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border">
            Transfer Account Workspace
          </span>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight mt-3">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-slate-400 mt-1">Track your transfer credits evaluation progress and alternatives in real-time.</p>
        </div>
        
        <div className="flex gap-2">
          <Link to="/student/upload">
            <Button className="flex items-center gap-1.5 shadow-sm text-[10px]" leftIcon={<UploadCloud className="h-4 w-4" />}>
              Upload Transcript
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        <Card className="p-4 flex flex-col justify-between hover:border-slate-350 transition-colors">
          <div className="flex justify-between items-start select-none">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Total Scans</span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50/50 flex items-center justify-center"><FileText className="h-4 w-4 text-indigo-650" /></div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-display font-black text-slate-900 tracking-tight">{totalEvaluations}</span>
            <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">Parsed transcripts</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between hover:border-slate-350 transition-colors">
          <div className="flex justify-between items-start select-none">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Pending Audits</span>
            <div className="h-7 w-7 rounded-lg bg-amber-50/50 flex items-center justify-center"><Clock className="h-4 w-4 text-amber-600 animate-pulse" /></div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-display font-black text-slate-900 tracking-tight">{pendingCount}</span>
            <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">Awaiting advisor checks</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between hover:border-slate-350 transition-colors">
          <div className="flex justify-between items-start select-none">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Completed Audits</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50/50 flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-display font-black text-slate-900 tracking-tight">{completedCount}</span>
            <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">Published mapping sets</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between hover:border-slate-350 transition-colors">
          <div className="flex justify-between items-start select-none">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Credits Earned</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50/50 flex items-center justify-center"><Plus className="h-4 w-4 text-emerald-600" /></div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-display font-black text-slate-900 tracking-tight">{approvedCredits}</span>
            <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">Granted equivalents</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between hover:border-slate-350 transition-colors">
          <div className="flex justify-between items-start select-none">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Closed Courses</span>
            <div className="h-7 w-7 rounded-lg bg-rose-50/50 flex items-center justify-center"><XCircle className="h-4 w-4 text-rose-600" /></div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-display font-black text-slate-900 tracking-tight">{rejectedCourses}</span>
            <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">Unmapped/rejected units</p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between hover:border-slate-350 transition-colors">
          <div className="flex justify-between items-start select-none">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Alternatives</span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50/50 flex items-center justify-center"><Compass className="h-4 w-4 text-indigo-650" /></div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-display font-black text-slate-900 tracking-tight">{alternativeRecommendations}</span>
            <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">Recover pathways</p>
          </div>
        </Card>

      </div>

      {/* Main Grid: Upcoming Tasks, Latest Reports, Quick Actions, Progress graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1: Progress Timeline & Activity logs */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Circular Progression mock graphs */}
          <Card className="p-6">
            <div className="flex justify-between items-center select-none border-b pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-950">AI Evaluation Progress</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Vector checks tracking</p>
              </div>
              <span className="text-[10px] text-indigo-655 font-bold uppercase bg-indigo-50 border rounded px-2 py-0.5">Target: {user?.program}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Circular Bar simulation */}
              <div className="flex items-center gap-4 border-r border-slate-100 pr-4">
                <div className="relative h-20 w-20 flex-shrink-0 select-none">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center font-display font-black text-slate-800 text-sm">
                    {approvedCredits ? '85%' : '0%'}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Mapping Complete Ratio</span>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
                    Your parsed transcript is completed and matched against 9/11 core requirements.
                  </p>
                </div>
              </div>

              {/* Progress items */}
              <div className="space-y-3 font-semibold text-[10px] text-slate-500 uppercase tracking-wider">
                <div className="flex justify-between border-b pb-1.5">
                  <span>AI Magic Scan</span>
                  <span className="text-emerald-600 font-bold">100% Correct</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>Syllabus vector math</span>
                  <span className="text-emerald-600 font-bold">Completed</span>
                </div>
                <div className="flex justify-between">
                  <span>Admissions review</span>
                  <span className="text-indigo-650 font-bold">Published</span>
                </div>
              </div>

            </div>
          </Card>

          {/* Table of Latest Reports */}
          <Card className="p-6">
            <div className="flex justify-between items-center select-none border-b pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-950">Latest Evaluations</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Recently analyzed college transcripts</p>
              </div>
              <Link to="/student/evaluations" className="text-indigo-650 hover:underline font-bold text-[10px]">View all history</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-semibold text-slate-650">
                <thead>
                  <tr className="border-b text-slate-455 uppercase tracking-widest text-[9px]">
                    <th className="pb-2">Institution</th>
                    <th className="pb-2">Target Program</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentEvaluations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 italic">No reports found.</td>
                    </tr>
                  ) : (
                    studentEvaluations.slice(0, 3).map((ev, i) => (
                      <tr key={i} className="hover:bg-slate-50/20">
                        <td className="py-2.5 font-bold text-slate-800">{ev.sendingInstitution}</td>
                        <td className="py-2.5 text-slate-500">{ev.studentProgram}</td>
                        <td className="py-2.5 text-slate-450">{new Date(ev.uploadedAt).toLocaleDateString()}</td>
                        <td className="py-2.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                            ev.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {ev.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* Col 2: Tasks, Activity, Quick Actions */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-950 border-b pb-2 select-none">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link to="/student/upload">
                <Button className="w-full justify-start text-[10px]" leftIcon={<UploadCloud className="h-4 w-4" />}>
                  Upload Transcript File
                </Button>
              </Link>
              <Link to="/student/reports">
                <Button variant="outline" className="w-full justify-start text-[10px]" leftIcon={<FileSpreadsheet className="h-4 w-4" />}>
                  View Transfer Reports
                </Button>
              </Link>
              <Link to="/student/alternatives">
                <Button variant="outline" className="w-full justify-start text-[10px]" leftIcon={<HelpCircle className="h-4 w-4" />}>
                  Explore Credit Recoveries
                </Button>
              </Link>
            </div>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-950 border-b pb-2 select-none">Upcoming Tasks</h3>
            <div className="space-y-3">
              {upcomingTasks.map((t, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border rounded-xl space-y-2 font-semibold">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800 text-xs">{t.title}</span>
                    <span className="text-[8px] bg-amber-50 border rounded px-1.5 py-0.5 text-amber-700 font-bold uppercase">{t.due}</span>
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">{t.desc}</p>
                  <button onClick={() => alert(`${t.action} clicked`)} className="text-[9px] text-indigo-650 hover:underline font-black uppercase">
                    {t.action} Task
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity timeline */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-950 border-b pb-2 select-none">Timeline Logs</h3>
            <div className="space-y-3 text-xs font-semibold text-slate-600">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="h-6 w-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {act.icon}
                  </div>
                  <div className="flex-grow flex justify-between items-center gap-1 leading-normal font-semibold">
                    <span className="text-slate-700">{act.text}</span>
                    <span className="text-[9px] text-slate-400 flex-shrink-0">{act.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};
export { StudentDashboard as default };
