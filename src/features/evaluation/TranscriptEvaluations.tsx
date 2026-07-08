import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Upload } from '../../components/ui/Upload';
import { Stepper } from '../../components/ui/Stepper';
import { simulateAIEvaluation } from '../../services/aiService';
import { 
  FileText, Sparkles, Search, Plus, Calendar, Award, 
  ArrowLeft, ArrowRight, RefreshCw, CheckCircle2, ChevronRight, AlertTriangle 
} from 'lucide-react';

export const TranscriptEvaluations: React.FC = () => {
  const navigate = useNavigate();
  const { evaluations, addEvaluation, triggerSystemNotification } = useAppState();

  // Wizard state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [wizardStep, setWizardStep] = useState(1); // 1: Info, 2: Upload, 3: Processing, 4: Verify
  
  // Form states
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('(555) 012-3456');
  const [studentProgram, setStudentProgram] = useState('B.S. in Computer Science');
  const [sendingInstitution, setSendingInstitution] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // AI Processing simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedResult, setCompletedResult] = useState<any>(null);

  // List view search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const stepsList = [
    'Secure Ingestion',
    'AI Magic Scan',
    'Structure Analysis',
    'Course Parsing',
    'Catalog Lookup',
    'AI Magic Mapping',
    'Credit Validation',
    'Alignment Score',
    'Alternative Routing',
    'Report Compilation'
  ];

  const handleAutoFill = () => {
    setStudentName('James Wilson');
    setStudentEmail('j.wilson@statecollege.edu');
    setSendingInstitution('State Community College');
    setFile(new File(['mock_binary'], 'state_transcript_jwilson.pdf', { type: 'application/pdf' }));
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentEmail || !sendingInstitution) {
      triggerSystemNotification('Please fill in all student info fields.', 'warning');
      return;
    }
    setWizardStep(2);
  };

  const handleStartAIProcessing = async () => {
    if (!file) {
      triggerSystemNotification('Please select a transcript file first.', 'warning');
      return;
    }
    setWizardStep(3);
    setIsProcessing(true);
    setActiveStepIndex(0);

    try {
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

      setCompletedResult(mockResult);
      setIsProcessing(false);
      setWizardStep(4);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      triggerSystemNotification('AI Ingestion processing encountered an issue.', 'warning');
    }
  };

  const handleCompleteWizard = (status: 'published' | 'pending_review') => {
    if (!completedResult) return;

    const finalEvaluation = {
      ...completedResult,
      status,
      uploadedAt: new Date().toISOString()
    };

    addEvaluation(finalEvaluation);
    triggerSystemNotification(
      status === 'published' 
        ? 'Evaluation report published immediately.' 
        : 'Evaluation saved to manual audit queue.', 
      'success'
    );

    // Reset wizard state
    setIsAddingNew(false);
    setWizardStep(1);
    setStudentName('');
    setStudentEmail('');
    setSendingInstitution('');
    setFile(null);
    setCompletedResult(null);
  };

  // Filter evaluations list
  const filteredList = evaluations.filter(e => {
    const matchSearch =
      e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.sendingInstitution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.studentProgram.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'pending' && e.status === 'pending_review') ||
      (statusFilter === 'published' && e.status === 'published') ||
      (statusFilter === 'rejected' && e.status === 'rejected');

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-12 font-sans text-xs">
      
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5 select-none">
        <div>
          <span className="text-[10px] text-indigo-650 font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-150">
            Admissions Processing Workspace
          </span>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight mt-3">
            Transcript Evaluations
          </h1>
          <p className="text-xs text-slate-405 mt-1">
            Ingest new transfer transcripts and manage automated mapping pipelines.
          </p>
        </div>

        {!isAddingNew && (
          <Button 
            onClick={() => setIsAddingNew(true)} 
            leftIcon={<Plus className="h-4 w-4" />}
            className="shadow-md shadow-indigo-100 hover:shadow-lg transition-all"
          >
            Upload New
          </Button>
        )}
      </div>

      {isAddingNew ? (
        /* ── WIZARD LAYOUT ─────────────────────────────────────────────────── */
        <div className="space-y-6">
          <div className="flex items-center gap-2 select-none">
            <button
              onClick={() => {
                if (wizardStep > 1 && wizardStep < 3) {
                  setWizardStep(wizardStep - 1);
                } else if (wizardStep === 4) {
                  // Prompt to go back
                  if (window.confirm('Discard processed AI mappings and restart?')) {
                    setWizardStep(1);
                    setCompletedResult(null);
                  }
                } else {
                  setIsAddingNew(false);
                }
              }}
              className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-655 rounded-xl transition-all flex items-center gap-1 font-bold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to List</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Evaluation Ingestion Wizard · Step {wizardStep} of 4
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side content card */}
            <Card className="lg:col-span-8 p-6 space-y-6">
              
              {wizardStep === 1 && (
                /* Step 1: Info Form */
                <form onSubmit={handleNextStep1} className="space-y-5">
                  <div className="flex justify-between items-center select-none border-b pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Student & Program Info</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Define student target coordinates</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-150 text-[9px] font-black text-indigo-700 hover:bg-indigo-100/50 transition-colors shadow-xs"
                    >
                      <Sparkles className="h-3 w-3" />
                      Auto-fill Mock Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 uppercase text-slate-500 font-bold">Student Name</label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. James Wilson"
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 uppercase text-slate-500 font-bold">Student Email</label>
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="e.g. james.w@example.com"
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 uppercase text-slate-500 font-bold">Sending College</label>
                      <input
                        type="text"
                        required
                        value={sendingInstitution}
                        onChange={(e) => setSendingInstitution(e.target.value)}
                        placeholder="e.g. State Community College"
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 uppercase text-slate-500 font-bold">Target Program</label>
                      <select
                        value={studentProgram}
                        onChange={(e) => setStudentProgram(e.target.value)}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option>B.S. in Computer Science</option>
                        <option>B.S. in Business Administration</option>
                        <option>B.S. in Mechanical Engineering</option>
                        <option>B.A. in Psychology</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <Button type="submit" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Continue to Document Ingestion
                    </Button>
                  </div>
                </form>
              )}

              {wizardStep === 2 && (
                /* Step 2: Upload File */
                <div className="space-y-5">
                  <div className="border-b pb-2 select-none">
                    <h3 className="text-sm font-bold text-slate-900">Document Ingestion</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Select unofficial transcript PDF to start scanning</p>
                  </div>

                  <div className="space-y-4">
                    {!file ? (
                      <Upload onFileSelect={(f) => setFile(f)} />
                    ) : (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center font-bold">
                        <div className="flex items-center gap-3 text-slate-750">
                          <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-650">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="block truncate text-xs">{file.name}</span>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                              {(file.size / 1024 || 150).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setFile(null)} 
                          className="px-3 py-1.5 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors border text-[10px]"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center select-none">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2 border rounded-xl hover:bg-slate-50 font-bold"
                    >
                      Back
                    </button>
                    <Button
                      disabled={!file}
                      onClick={handleStartAIProcessing}
                      rightIcon={<Sparkles className="h-4 w-4" />}
                      className="shadow-md shadow-indigo-100"
                    >
                      Start AI Magic Scan
                    </Button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                /* Step 3: AI Processing Stepper progress */
                <div className="p-4 text-center space-y-8 flex flex-col items-center select-none">
                  <div className="space-y-2">
                    <RefreshCw className="h-10 w-10 text-indigo-650 animate-spin mx-auto mb-3" />
                    <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">
                      AI Ingestion Workspace
                    </h2>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-normal">
                      Running AI Magic Scan and matching alignments against catalog requirements...
                    </p>
                  </div>

                  {/* Stepper progress component */}
                  <div className="w-full pt-4">
                    <Stepper steps={stepsList} activeStep={activeStepIndex} />
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-[10px] font-mono text-slate-500 w-full max-w-md">
                    Process Status: <span className="text-indigo-650 font-bold uppercase">{stepsList[activeStepIndex]}...</span>
                  </div>
                </div>
              )}

              {wizardStep === 4 && completedResult && (
                /* Step 4: Verification results */
                <div className="space-y-6">
                  <div className="border-b pb-2 select-none flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">AI Magic Mapped Report Results</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Please verify curriculum equivalents before saving</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 font-bold uppercase text-[9px]">
                      Auto Match Complete
                    </span>
                  </div>

                  {/* Overview details list */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Student</span>
                      <span className="text-xs font-bold text-slate-850 block mt-1 truncate">{completedResult.studentName}</span>
                    </div>
                    <div className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Sending College</span>
                      <span className="text-xs font-bold text-slate-850 block mt-1 truncate">{completedResult.sendingInstitution}</span>
                    </div>
                    <div className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Match Score</span>
                      <span className="text-xs font-bold text-emerald-600 block mt-1 font-mono">{completedResult.confidenceScore}%</span>
                    </div>
                    <div className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Mapped Courses</span>
                      <span className="text-xs font-bold text-slate-800 block mt-1">{completedResult.courses?.length ?? 0} courses</span>
                    </div>
                  </div>

                  {/* Course Equivalents Table mockup */}
                  <div className="border border-slate-150 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11px] font-semibold text-slate-600">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-155 text-slate-400 text-[10px] uppercase font-bold">
                          <th className="p-3">Source Course</th>
                          <th className="p-3">Equivalence</th>
                          <th className="p-3 text-center">Outcome</th>
                          <th className="p-3 text-right">Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {completedResult.courses?.map((course: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/20">
                            <td className="p-3">
                              <span className="font-bold text-slate-800 block">{course.code}</span>
                              <span className="text-[9px] text-slate-400 block mt-0.5 truncate max-w-[150px]">{course.title} ({course.credits} Credits)</span>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-indigo-655 block">{course.matchedCourseCode || 'Unmapped'}</span>
                              <span className="text-[9px] text-slate-450 block mt-0.5 truncate max-w-[150px]">{course.matchedCourseTitle || 'Elective Only'}</span>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                course.status === 'mapped' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' : 'bg-amber-50 text-amber-700 border border-amber-100/50'
                              }`}>
                                {course.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3 text-right text-slate-700 font-mono font-bold">{course.confidence}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-5 border-t flex flex-col sm:flex-row gap-3 justify-end select-none">
                    <button
                      onClick={() => {
                        if (window.confirm('Discard and restart?')) {
                          setWizardStep(1);
                          setCompletedResult(null);
                        }
                      }}
                      className="px-4 py-2 border rounded-xl hover:bg-slate-50 text-slate-650 font-bold"
                    >
                      Discard & Restart
                    </button>
                    <button
                      onClick={() => handleCompleteWizard('pending_review')}
                      className="px-4 py-2 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl"
                    >
                      Save to Review Queue
                    </button>
                    <Button
                      onClick={() => handleCompleteWizard('published')}
                      leftIcon={<CheckCircle2 className="h-4 w-4" />}
                      className="shadow-md shadow-indigo-100"
                    >
                      Publish Immediately
                    </Button>
                  </div>
                </div>
              )}

            </Card>

            {/* Right side summary cards */}
            <Card className="lg:col-span-4 p-5 space-y-4 select-none">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2 uppercase tracking-wider">
                Wizard State Check
              </h4>
              <div className="space-y-3 font-semibold text-slate-500">
                <div className="flex justify-between items-center">
                  <span>Student Name:</span>
                  <span className="text-slate-800 font-bold">{studentName || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Email:</span>
                  <span className="text-slate-800 font-bold truncate max-w-[120px]" title={studentEmail}>{studentEmail || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sending College:</span>
                  <span className="text-slate-800 font-bold truncate max-w-[120px]">{sendingInstitution || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Target Program:</span>
                  <span className="text-slate-800 font-bold">{studentProgram}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Transcript file:</span>
                  <span className="text-indigo-650 font-bold truncate max-w-[120px]">{file ? file.name : 'No file selected'}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-2 items-start mt-2">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 leading-normal">
                  All processed mappings will run against target criteria configured in the AI Settings coefficients panel.
                </p>
              </div>
            </Card>

          </div>
        </div>
      ) : (
        /* ── QUEUE LIST VIEW LAYOUT ────────────────────────────────────────── */
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, sending institution or program..."
                className="w-full pl-8 pr-3 py-1.5 text-[10px] border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-slate-50/55 font-semibold text-slate-750"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] bg-white focus:outline-none font-bold text-slate-650"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Evaluations list Card */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto text-xs font-semibold">
              <table className="w-full text-left text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase font-bold text-[9px] tracking-wider">
                    <th className="p-4">Student</th>
                    <th className="p-4">Sending Institution</th>
                    <th className="p-4">Target Program</th>
                    <th className="p-4 text-center">Score</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        No transcript evaluations found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((evalItem) => (
                      <tr key={evalItem.id} className="hover:bg-slate-50/30">
                        <td className="p-4">
                          <span className="font-bold text-slate-800 block">{evalItem.studentName}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-semibold">{evalItem.studentEmail}</span>
                        </td>
                        <td className="p-4 text-slate-700">{evalItem.sendingInstitution}</td>
                        <td className="p-4 text-slate-650">{evalItem.studentProgram}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                            evalItem.confidenceScore >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/55' :
                            evalItem.confidenceScore >= 70 ? 'bg-amber-50 text-amber-700 border border-amber-100/55' : 'bg-rose-50 text-rose-700 border border-rose-100/55'
                          }`}>
                            {evalItem.confidenceScore}%
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            evalItem.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            evalItem.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                            'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {evalItem.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => navigate(`/admin/evaluations/${evalItem.id}`)}
                            className="px-3.5 py-1.5 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-650 hover:border-indigo-200 rounded-lg shadow-xs transition-all flex items-center gap-1 font-bold inline-flex bg-white"
                          >
                            <span>Audit Matches</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};
export { TranscriptEvaluations as default };
