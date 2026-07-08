import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Upload } from '../../components/ui/Upload';
import { Stepper } from '../../components/ui/Stepper';
import { simulateAIEvaluation } from '../../services/aiService';
import { 
  Sparkles, ArrowRight, RefreshCw, FileText, Camera, 
  Trash2, FileCode, CheckCircle2, History, ChevronRight 
} from 'lucide-react';

const RECOMMENDED_TARGET_COURSES: Record<string, Array<{ code: string; title: string; credits: number }>> = {
  'B.S. in Computer Science': [
    { code: 'CS 101', title: 'Introduction to Computer Science', credits: 4 },
    { code: 'CS 102', title: 'Data Structures & Algorithms', credits: 4 },
    { code: 'MATH 101', title: 'Calculus I', credits: 4 },
    { code: 'ENG 101', title: 'Academic Writing & Rhetoric', credits: 3 }
  ],
  'B.S. in Business Administration': [
    { code: 'BUS 101', title: 'Introduction to Business', credits: 3 },
    { code: 'BUS 310', title: 'Global Supply Chain Management', credits: 3 },
    { code: 'MATH 101', title: 'Calculus I', credits: 4 },
    { code: 'PSYCH 101', title: 'General Psychology', credits: 3 }
  ],
  'B.S. in Mechanical Engineering': [
    { code: 'MATH 101', title: 'Calculus I', credits: 4 },
    { code: 'PHYS 101', title: 'General Physics I', credits: 4 },
    { code: 'CS 101', title: 'Introduction to Computer Science', credits: 4 }
  ],
  'B.A. in Psychology': [
    { code: 'PSYCH 101', title: 'General Psychology', credits: 3 },
    { code: 'ENG 101', title: 'Academic Writing & Rhetoric', credits: 3 },
    { code: 'MATH 101', title: 'Calculus I', credits: 4 }
  ]
};

export const StudentUpload: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addEvaluation, triggerSystemNotification } = useAppState();

  const passedFile = location.state?.file as File | undefined;

  // Student background profile info
  const [studentName, setStudentName] = useState(user?.name || '');
  const [studentEmail, setStudentEmail] = useState(user?.email || '');
  const [studentPhone, setStudentPhone] = useState('(555) 012-3456');
  const [studentProgram, setStudentProgram] = useState(user?.program || 'B.S. in Computer Science');
  const [sendingInstitution, setSendingInstitution] = useState('Bay Area Community College');
  
  const [file, setFile] = useState<File | null>(passedFile || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedResult, setCompletedResult] = useState<any>(null);

  // V2 target course suggestions & selection states
  const [selectedTargetCourses, setSelectedTargetCourses] = useState<string[]>([]);

  // Automatically preselect all recommended courses when target program changes
  React.useEffect(() => {
    const defaults = RECOMMENDED_TARGET_COURSES[studentProgram]?.map(c => c.code) || [];
    setSelectedTargetCourses(defaults);
  }, [studentProgram]);

  const handleTargetCourseToggle = (code: string) => {
    setSelectedTargetCourses(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // 10-Stage Stepper
  const stepsList = [
    'Uploaded',
    'AI Magic Scan',
    'Segmentation',
    'Course Parsing',
    'Catalog Lookup',
    'Semantic Similarity',
    'Rule Validation',
    'Confidence Check',
    'Alternatives Match',
    'Report Ready'
  ];

  const handleAutoFill = () => {
    setStudentName('Jane Doe');
    setStudentEmail('jane.doe@example.com');
    setSendingInstitution('De Anza College');
    setFile(new File(['binary_stub'], 'deanza_unofficial.pdf', { type: 'application/pdf' }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !studentName || !studentEmail) return;

    setIsProcessing(true);
    setActiveStepIndex(0);

    try {
      // Wire simulateAIEvaluation's steps directly to our stepper
      const mockResult = await simulateAIEvaluation(
        {
          studentName,
          studentEmail,
          studentPhone,
          studentProgram,
          sendingInstitution,
          fileName: file.name
        },
        (progressSteps) => {
          // Find the index of the first step that is running or the last completed one
          const runningIdx = progressSteps.findIndex(s => s.status === 'running');
          if (runningIdx !== -1) {
            setActiveStepIndex(runningIdx);
          } else {
            const lastCompleted = progressSteps.map(s => s.status).lastIndexOf('completed');
            if (lastCompleted !== -1) {
              setActiveStepIndex(lastCompleted);
            }
          }
        }
      );

      addEvaluation(mockResult);
      triggerSystemNotification('AI Transcript extraction complete.', 'success');
      setIsProcessing(false);
      setCompletedResult(mockResult);

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-xs">
      
      {/* 1. INITIAL UPLOAD FORM */}
      {!isProcessing && !completedResult && (
        <Card className="p-8 space-y-6">
          <div className="text-center mb-4 select-none">
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Evaluate Transcript</h2>
            <p className="text-xs text-slate-400 mt-1">Submit your unofficial academic files for vector comparison checks.</p>
            
            <button
              type="button"
              onClick={handleAutoFill}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-150 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100/50 transition-colors shadow-sm cursor-pointer font-bold"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Sandbox Auto-fill Mock PDF
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6 text-xs font-semibold text-slate-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 uppercase">Sending College</label>
                <input
                  type="text"
                  required
                  value={sendingInstitution}
                  onChange={(e) => setSendingInstitution(e.target.value)}
                  placeholder="De Anza College"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 uppercase">Target Transfer Program</label>
                <select
                  value={studentProgram}
                  onChange={(e) => setStudentProgram(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-755 focus:outline-none"
                >
                  <option>B.S. in Computer Science</option>
                  <option>B.S. in Business Administration</option>
                  <option>B.S. in Mechanical Engineering</option>
                  <option>B.A. in Psychology</option>
                </select>
              </div>
            </div>

            {/* Target Course Suggestions & Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center select-none">
                <label className="uppercase">Target Courses to Satisfy</label>
                <span className="text-[10px] text-indigo-650 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  College Recommended
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                Based on your target program, the college suggests evaluating equivalents for these courses. Select which ones you want to satisfy:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RECOMMENDED_TARGET_COURSES[studentProgram]?.map(course => {
                  const isChecked = selectedTargetCourses.includes(course.code);
                  return (
                    <label 
                      key={course.code}
                      className={`p-3.5 border rounded-xl flex items-start gap-3 cursor-pointer select-none transition-all ${
                        isChecked 
                          ? 'border-indigo-500 bg-indigo-50/20 shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTargetCourseToggle(course.code)}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div>
                        <span className="block font-bold text-slate-800 text-[11px]">{course.code}</span>
                        <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">{course.title} ({course.credits} Credits)</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Custom file selection dropzone */}
            <div className="space-y-3">
              <label className="block uppercase">Select Transcript PDF/Image Sheet</label>
              
              {!file ? (
                <div className="space-y-2">
                  <Upload onFileSelect={(f) => setFile(f)} />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => alert('Mobile camera mock click')}
                      className="flex-1 py-2 border rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-50 font-bold"
                    >
                      <Camera className="h-4 w-4 text-slate-400" />
                      Scan via Camera
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border rounded-xl flex justify-between items-center font-bold">
                  <div className="flex items-center gap-2 text-slate-750">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    <div>
                      <span className="block truncate text-xs">{file.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{(file.size / 1024 || 150).toFixed(1)} KB</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setFile(null)} 
                    className="p-1.5 hover:bg-rose-50 text-slate-450 hover:text-rose-600 rounded-lg transition-colors border"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={!file}
              className="w-full py-3 text-xs"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Analyze Transcript Mappings
            </Button>
          </form>
        </Card>
      )}

      {/* 2. STEPPER PROGRESS LOADER */}
      {isProcessing && (
        <Card className="p-8 space-y-8 text-center flex flex-col items-center select-none animate-fade-in">
          <div className="space-y-2">
            <RefreshCw className="h-10 w-10 text-indigo-650 animate-spin mx-auto mb-3" />
            <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">AI Transcript Extraction Workspace</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-normal">
              Running AI Magic Scan and matching alignments against local catalogs.
            </p>
          </div>

          {/* Stepper progress component */}
          <div className="w-full pt-4">
            <Stepper steps={stepsList} activeStep={activeStepIndex} />
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-[10px] font-mono text-slate-500 w-full max-w-sm">
            Node status: <span className="text-indigo-650 font-bold uppercase">{stepsList[activeStepIndex]}...</span>
          </div>
        </Card>
      )}

      {/* SUCCESS CARD — shown after processing, no login needed */}
      {completedResult && !isProcessing && (
        <Card className="p-8 space-y-6 animate-fade-in border-emerald-200">
          <div className="flex flex-col items-center text-center space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">Evaluation Complete!</h2>
            <p className="text-xs text-slate-500 max-w-sm">
              Your transcript has been analyzed. Here's a summary of the results.
            </p>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs font-semibold">
            <div className="flex justify-between p-3.5 bg-slate-50">
              <span className="text-slate-500">Student</span>
              <span className="text-slate-800 font-bold">{completedResult.studentName}</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span className="text-slate-500">Sending Institution</span>
              <span className="text-slate-800 font-bold">{completedResult.sendingInstitution}</span>
            </div>
            <div className="flex justify-between p-3.5 bg-slate-50">
              <span className="text-slate-500">Target Program</span>
              <span className="text-slate-800 font-bold">{completedResult.studentProgram}</span>
            </div>
            <div className="flex justify-between p-3.5">
              <span className="text-slate-500">Courses Extracted</span>
              <span className="text-indigo-600 font-bold">{completedResult.courses?.length ?? 0} courses</span>
            </div>
            <div className="flex justify-between p-3.5 bg-slate-50">
              <span className="text-slate-500">Credits Granted</span>
              <span className="text-emerald-600 font-bold">
                {completedResult.courses
                  ?.filter((c: any) => c.status === 'approved')
                  .reduce((sum: number, c: any) => sum + (c.receivingCredits || 0), 0) ?? 0} / {completedResult.courses?.reduce((sum: number, c: any) => sum + c.credits, 0) ?? 0} Units
              </span>
            </div>
            <div className="flex justify-between p-3.5">
              <span className="text-slate-500">Overall Match Score</span>
              <span className="text-emerald-650 font-bold">{completedResult.confidenceScore ?? 87}%</span>
            </div>
            <div className="flex justify-between p-3.5 bg-slate-50">
              <span className="text-slate-500">Status</span>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border font-bold uppercase text-[9px]">Pending Review</span>
            </div>
          </div>

          {/* Mapped Courses Detail List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Transcript Course Alignments</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b text-slate-450 font-bold uppercase tracking-wider text-[9px] select-none">
                  <tr>
                    <th className="p-3">Sending Course</th>
                    <th className="p-3">Knot Equivalent</th>
                    <th className="p-3 text-center">Credits</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                  {completedResult.courses?.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50/30">
                      <td className="p-3">
                        <span className="block font-bold text-slate-800">{c.code}</span>
                        <span className="block text-[10px] text-slate-450 font-medium">{c.title}</span>
                      </td>
                      <td className="p-3 text-indigo-650">
                        {c.matchedCourseCode ? (
                          <>
                            <span className="block font-bold">{c.matchedCourseCode}</span>
                            <span className="block text-[10px] text-slate-450 font-medium">{c.matchedCourseTitle}</span>
                          </>
                        ) : (
                          <span className="text-slate-400 font-medium italic">Unmapped</span>
                        )}
                      </td>
                      <td className="p-3 text-center font-bold text-slate-700">
                        {c.status === 'approved' ? `${c.receivingCredits} / ${c.credits}` : `0 / ${c.credits}`}
                      </td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          c.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                          c.status === 'rejected' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Target Course Suggestions & Selection Results */}
          <div className="space-y-4 pt-4 border-t border-slate-100 select-none">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
              Transfer Suggestions & Next Steps
            </h3>
            <p className="text-[10px] text-slate-450 font-semibold leading-normal">
              Based on your selected target courses and evaluation status, here are your personalized recommendations:
            </p>
            
            <div className="space-y-2.5 font-semibold">
              {RECOMMENDED_TARGET_COURSES[studentProgram]?.map(course => {
                const isSelected = selectedTargetCourses.includes(course.code);
                // Find if this target course was matched in the results
                const matchedExtracted = completedResult.courses?.find((c: any) => c.matchedCourseCode === course.code);
                
                let recommendationTitle = '';
                let recommendationDesc = '';
                let statusColor = '';
                let statusText = '';
                
                if (!isSelected) {
                  statusText = 'Not Selected';
                  statusColor = 'bg-slate-50 text-slate-450 border-slate-200';
                  recommendationTitle = `Include ${course.code} for evaluation`;
                  recommendationDesc = `You have not selected ${course.code} to satisfy. If you have taken an equivalent, re-run with it checked to earn ${course.credits} units.`;
                } else if (matchedExtracted && matchedExtracted.status === 'approved') {
                  statusText = 'Satisfied';
                  statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-150';
                  recommendationTitle = `Perfect Match for ${course.code}`;
                  recommendationDesc = `Your course ${matchedExtracted.code} (${matchedExtracted.title}) is a 96% match. Credits are fully transferable!`;
                } else if (matchedExtracted && matchedExtracted.status === 'pending') {
                  statusText = 'Pending Audit';
                  statusColor = 'bg-amber-50 text-amber-750 border-amber-150';
                  recommendationTitle = `Manual review for ${course.code}`;
                  recommendationDesc = `Your course ${matchedExtracted.code} has 88% similarity but requires admissions audit. An advisor will contact you.`;
                } else {
                  statusText = 'Missing / Rejected';
                  statusColor = 'bg-rose-50 text-rose-700 border-rose-150';
                  recommendationTitle = `Complete substitute at Knot for ${course.code}`;
                  recommendationDesc = `No valid passing equivalent found. We recommend enrolling in ${course.code} (${course.title}) next semester.`;
                }

                return (
                  <div key={course.code} className="p-3.5 border border-slate-150 rounded-xl bg-slate-50/30 flex justify-between gap-4 items-start">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                        {recommendationTitle}
                      </span>
                      <p className="text-[10px] text-slate-500 font-semibold leading-normal">{recommendationDesc}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded border text-[8px] font-bold uppercase tracking-wider ${statusColor}`}>
                      {statusText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 font-semibold text-center">
            An admissions advisor will review and confirm your credit mappings shortly.
            You'll receive an email at <strong>{completedResult.studentEmail}</strong>.
          </div>

          <Button
            onClick={() => { setCompletedResult(null); setFile(null); }}
            variant="outline"
            className="w-full py-2.5 text-xs"
          >
            Evaluate Another Transcript
          </Button>
        </Card>
      )}

    </div>
  );
};
export { StudentUpload as default };
