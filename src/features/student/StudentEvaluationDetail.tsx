import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ArrowLeft, FileText, CheckCircle2, AlertTriangle, 
  HelpCircle, Clock, ChevronDown, ChevronUp, Sparkles, Database 
} from 'lucide-react';

export const StudentEvaluationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { evaluations } = useAppState();

  const evaluation = evaluations.find(e => e.id === id);

  // Accordion details active map
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (courseId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  if (!evaluation) {
    return (
      <div className="p-8 text-center text-xs font-semibold">
        <p className="text-slate-400">Evaluation report not found.</p>
        <Link to="/student/evaluations"><Button className="mt-4">Back to History</Button></Link>
      </div>
    );
  }

  // Calculation parameters
  const approvedCredits = evaluation.courses
    .filter(c => c.status === 'approved')
    .reduce((sum, c) => sum + (c.receivingCredits || 0), 0);

  const pendingCount = evaluation.courses.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6 font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5 select-none">
        <div className="flex items-center gap-2">
          <Link to="/student/evaluations" className="p-2 border rounded-xl hover:bg-slate-50 text-slate-500 mr-2"><ArrowLeft className="h-4 w-4" /></Link>
          <div>
            <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Evaluation Details</h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold">{evaluation.sendingInstitution} • Target: {evaluation.studentProgram}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full border font-bold text-[10px] uppercase ${
          evaluation.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-amber-50 text-amber-700 border-amber-150'
        }`}>
          {evaluation.status.replace('_', ' ')}
        </span>
      </div>

      {/* Split Layout: LEFT, CENTER, RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch select-none">
        
        {/* LEFT Panel: Mock Transcript PDF Preview */}
        <Card className="p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
              <FileText className="h-4.5 w-4.5 text-indigo-500" />
              Source Document Sheet
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Parsed unofficial file contents</p>
          </div>

          <div className="flex-grow min-h-36 rounded-xl bg-slate-100 border p-4 font-mono text-[9px] text-slate-500 overflow-y-auto space-y-2 leading-relaxed">
            <div className="border-b pb-2 text-center font-bold text-slate-700 uppercase tracking-widest">{evaluation.sendingInstitution} Transcript</div>
            <div>STUDENT: {evaluation.studentName}</div>
            <div>UNITS EXTRACTED: {evaluation.courses.length} courses</div>
            <div className="border-t pt-2 space-y-1">
              {evaluation.courses.map((c, i) => (
                <div key={i} className="flex justify-between">
                  <span>{c.code} {c.title}</span>
                  <span className="font-bold">Grade: {c.grade || 'A'}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <span className="text-[9px] text-slate-400 font-semibold block">AI Magic scan integrity verified</span>
          </div>
        </Card>

        {/* CENTER Panel: Evaluation Timeline */}
        <Card className="p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-indigo-500" />
              Extraction Timeline
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">AI node comparison sequence logs</p>
          </div>

          <div className="flex-grow space-y-4 pt-2">
            <div className="flex gap-3 items-start">
              <div className="h-4 w-4 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-[9px] font-bold">1</div>
              <div>
                <span className="font-bold text-slate-700 block">AI Magic Scan Finalized</span>
                <span className="text-[9px] text-slate-400">99.4% confidence extraction</span>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="h-4 w-4 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-[9px] font-bold">2</div>
              <div>
                <span className="font-bold text-slate-700 block">Catalog Equivalents Mapped</span>
                <span className="text-[9px] text-slate-400">Neural overlap checks completed</span>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="h-4 w-4 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-[9px] font-bold">3</div>
              <div>
                <span className="font-bold text-slate-700 block">Staff Audit Published</span>
                <span className="text-[9px] text-slate-400">Merged into transfer directory registry</span>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 text-center font-semibold">
            System timestamp: {new Date(evaluation.uploadedAt).toLocaleString()}
          </div>
        </Card>

        {/* RIGHT Panel: Scorecard Summaries */}
        <Card className="p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
              <Database className="h-4.5 w-4.5 text-indigo-500" />
              Transfer Scorecard
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Admitted units breakdown</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-slate-50 border rounded-xl">
              <span className="text-2xl font-display font-black text-slate-800 tracking-tight">{approvedCredits}</span>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Credits Granted</p>
            </div>
            <div className="p-3 bg-slate-50 border rounded-xl">
              <span className="text-2xl font-display font-black text-slate-800 tracking-tight">{evaluation.confidenceScore}%</span>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">AI Confidence</p>
            </div>
          </div>

          <div className="space-y-1.5 text-[10px] font-semibold text-slate-500">
            <div className="flex justify-between border-b pb-1"><span>Target requirement overlap</span> <strong className="text-slate-750">84.2%</strong></div>
            <div className="flex justify-between"><span>Pending staff validation</span> <strong className="text-slate-750">{pendingCount} course units</strong></div>
          </div>
        </Card>

      </div>

      {/* LOWER PANEL: Course Mappings Table with Expandable Row Diffs */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b select-none bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-950">Course Mapping Directory</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Click any equivalent row to expand AI Magic alignment details and overlap weights.</p>
        </div>

        <table className="w-full text-left border-collapse text-xs font-semibold text-slate-650">
          <thead className="bg-slate-100/60 border-b text-slate-400 font-bold uppercase tracking-wider select-none text-[9px]">
            <tr>
              <th className="p-3.5">Sending Course (Origin)</th>
              <th className="p-3.5">Matched Course (Articulate)</th>
              <th className="p-3.5 text-center">Credits</th>
              <th className="p-3.5 text-center">Grade</th>
              <th className="p-3.5 text-center">Confidence</th>
              <th className="p-3.5 text-right">Status</th>
              <th className="p-3.5 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {evaluation.courses.map((course) => {
              const isExpanded = !!expandedRows[course.id];
              return (
                <React.Fragment key={course.id}>
                  <tr 
                    onClick={() => toggleRow(course.id)} 
                    className="hover:bg-slate-50/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5 font-bold text-slate-800">
                      <span>{course.code}</span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{course.title}</span>
                    </td>
                    <td className="p-3.5 text-indigo-655 font-bold">
                      {course.matchedCourseCode ? (
                        <>
                          <span>{course.matchedCourseCode}</span>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{course.matchedCourseTitle}</span>
                        </>
                      ) : (
                        <span className="text-slate-400 font-medium italic">Unmapped</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center font-bold text-slate-700">{course.receivingCredits || course.credits}</td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-550">{course.grade || 'A'}</td>
                    <td className="p-3.5 text-center">
                      <span className="bg-slate-50 border px-2 py-0.5 rounded font-black text-slate-700">
                        {course.confidence}%
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        course.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                        course.status === 'rejected' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-450" /> : <ChevronDown className="h-4 w-4 text-slate-450" />}
                    </td>
                  </tr>

                  {/* Expandable detailed comparison row */}
                  {isExpanded && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={7} className="p-5 border-t border-b border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
                          
                          {/* Left text overlap check */}
                          <div className="space-y-3">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Original Course Syllabus</span>
                              <p className="text-slate-600 font-medium leading-normal bg-white p-3 border rounded-xl shadow-xs">
                                Syllabus objectives covering program structures, data loops, class syntax parameters, and basic program architecture checks.
                              </p>
                            </div>
                            {course.matchedCourseCode && (
                              <div>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1 font-bold">Articulate Catalog Match</span>
                                <p className="text-slate-655 font-medium leading-normal bg-white p-3 border rounded-xl shadow-xs">
                                  Introduces the structural design of program codes, including basic syntax parameters, memory loops, and object configurations.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* AI Magic scorecard and rationale parameters */}
                          <div className="space-y-4 font-semibold text-slate-500">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">AI Analysis Indicators</span>
                              <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                                <div className="p-2.5 bg-white border rounded-xl shadow-xs">
                                  <span className="text-indigo-650 font-black block text-sm">{course.confidence}%</span>
                                  <span className="text-[8px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wider">Similarity weight</span>
                                </div>
                                <div className="p-2.5 bg-white border rounded-xl shadow-xs">
                                  <span className="text-slate-800 font-black block text-sm">0.0 Units</span>
                                  <span className="text-[8px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wider">Credit Difference</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 bg-white border rounded-xl space-y-1.5 shadow-xs text-[10px]">
                              <div className="flex items-center gap-1.5 text-indigo-755 font-bold">
                                <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-500" />
                                <span>AI Explanation rationale</span>
                              </div>
                              <p className="text-slate-600 font-medium leading-normal">
                                Course content overlaps significantly (85% syllabus alignment) with institutional catalog objectives. Credit mappings recommended for direct integration.
                              </p>
                            </div>

                            {course.reason && (
                              <div className="p-3 bg-indigo-50/20 border border-indigo-100 rounded-xl space-y-1">
                                <span className="text-slate-700 font-bold block text-[10px]">Admissions Counselor Override Decision</span>
                                <p className="text-slate-600 font-medium leading-normal text-[10px]">{course.reason}</p>
                              </div>
                            )}
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </Card>

    </div>
  );
};
export { StudentEvaluationDetail as default };
