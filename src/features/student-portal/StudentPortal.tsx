import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppState } from '@/context/AppStateContext';
import { simulateAIEvaluation, ProgressStep, PROCESSING_STEPS } from '@/services/aiService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, 
  HelpCircle, ChevronDown, Award, Sparkles, BookOpen, Clock, 
  Download, Printer, PhoneCall, ArrowLeft, RefreshCw, Star
} from 'lucide-react';

// ==========================================
// FAQ Section Mock
// ==========================================
const FAQS = [
  {
    q: 'How does the AI credit evaluator work?',
    a: 'Our AI engine reads your unofficial transcript using AI Magic Scan, extracts the courses you completed, and aligns them against our institution catalog. It validates parameters like minimum grades and credit difference thresholds automatically.'
  },
  {
    q: 'Is this evaluation official?',
    a: 'This self-service evaluation provides an instant estimation based on current course mappings. Official evaluations are finalized by the Office of Admissions after you submit your official transcripts during your application.'
  },
  {
    q: 'What if a course doesn\'t match?',
    a: 'If the AI confidence is below the threshold or the course isn\'t mapped, it will suggest alternative courses. In the Admin portal, admissions officers can review the comparison and apply a manual override to award credit.'
  },
  {
    q: 'What grade is required for credit transfer?',
    a: 'Generally, courses with a grade of C (2.0) or higher are eligible for transfer, provided they match a course in our curriculum and meet credit requirements.'
  }
];

// ==========================================
// MAIN LANDING VIEW
// ==========================================
export const StudentLanding: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 glass py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
            K
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-900">KNOT</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Staff Portal
          </Link>
          <Link 
            to="/upload" 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-md shadow-indigo-100 hover:shadow-lg transition-all"
          >
            Evaluate Transcript
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto grid md:grid-size grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="h-3 w-3" />
            AI-Powered Transfer Mappings
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
            Evaluate your transfer credits <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">in 60 seconds</span>.
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Upload your unofficial college transcript and let KNOT's AI map your courses, check equivalents, and generate an instant credit report. No fees, no forms, no waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/upload" 
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
            >
              Start Free Evaluation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a 
              href="#how-it-works" 
              className="px-6 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium shadow-sm transition-all text-center"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Hero Visual Mock */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-3xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                <span className="text-xs font-semibold text-slate-700">transcript_unofficial.pdf</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-700">AI Magic Scan Completed</span>
            </div>
            {/* Visual mapping items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-700">CS-101 Python Introduction</p>
                  <p className="text-[10px] text-slate-400">Grade: A • 4 Credits</p>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <div className="text-right">
                  <p className="font-semibold text-indigo-600">CS 101 Intro to CS</p>
                  <p className="text-[10px] text-emerald-600">4 Credits Granted</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-700">MATH-121 Calculus I</p>
                  <p className="text-[10px] text-slate-400">Grade: B+ • 4 Credits</p>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <div className="text-right">
                  <p className="font-semibold text-indigo-600">MATH 101 Calculus I</p>
                  <p className="text-[10px] text-emerald-600">4 Credits Granted</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                <div>
                  <p className="font-semibold text-slate-700">ENG-110 College Writing</p>
                  <p className="text-[10px] text-slate-400">Grade: D • 3 Credits</p>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <div className="text-right">
                  <p className="font-semibold text-amber-700">ENG 101 Composition</p>
                  <p className="text-[10px] text-rose-600 font-medium">Grade Threshold Alert</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Match Confidence Score</span>
              <span className="text-xs font-bold text-slate-700">91.3%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="bg-white border-y border-slate-200/80 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-display font-bold text-indigo-600">99.4%</p>
            <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">AI Scan Accuracy</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-indigo-600">&lt; 2 Mins</p>
            <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">Evaluation Time</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-indigo-600">10,000+</p>
            <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">Courses Mapped</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-indigo-600">100%</p>
            <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">Self-Service</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-center text-slate-900 mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold mb-6">1</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Transcript</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Drag and drop your unofficial PDF transcript. Select your target program at Knot University.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold mb-6">2</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Ingestion & Mapping</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our AI Magic Alignment model reads your classes, maps credits, checks grades, and estimates transferable credits.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold mb-6">3</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Receive Report</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              View your evaluation report, download a PDF copy, and request admissions officers to review edge cases.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-slate-200/80 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-slate-50/50"
                    >
                      <p className="p-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 md:px-12 text-center text-xs border-t border-slate-800">
        <p>© 2026 Knot University. All rights reserved. Built using advanced semantic AI mappings.</p>
      </footer>
    </div>
  );
};

// ==========================================
// TRANSCRIPT UPLOAD & PROGRESS SCREEN
// ==========================================
export const StudentUpload: React.FC = () => {
  const navigate = useNavigate();
  const { addEvaluation } = useAppState();

  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentProgram, setStudentProgram] = useState('B.S. in Computer Science');
  const [sendingInstitution, setSendingInstitution] = useState('Bay Area Community College');
  
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAutoFillDemo = () => {
    setStudentName('Jane Doe');
    setStudentEmail('jane.doe@example.com');
    setStudentPhone('(555) 012-3456');
    setSendingInstitution('De Anza College');
    setStudentProgram('B.S. in Computer Science');
    setFile(new File(['mock_pdf_binary_content'], 'deanza_transcript.pdf', { type: 'application/pdf' }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !studentName || !studentEmail) return;

    setIsProcessing(true);
    try {
      const evaluation = await simulateAIEvaluation(
        {
          studentName,
          studentEmail,
          studentPhone,
          studentProgram,
          sendingInstitution,
          fileName: file.name
        },
        (steps) => {
          setProgressSteps(steps);
          // Find currently active step
          const activeIdx = steps.findIndex(s => s.status === 'running');
          if (activeIdx !== -1) {
            setActiveStepIndex(activeIdx);
          } else {
            // Check last completed index
            const lastCompletedIdx = [...steps].reverse().findIndex(s => s.status === 'completed');
            if (lastCompletedIdx !== -1) {
              setActiveStepIndex(steps.length - 1 - lastCompletedIdx);
            }
          }
        }
      );

      // Add to global state
      addEvaluation(evaluation);
      
      // Delay slightly before showing results
      setTimeout(() => {
        navigate(`/results/${evaluation.id}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6 flex items-center justify-center">
      <Link to="/" className="absolute top-6 left-6 text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 font-medium transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="max-w-2xl w-full">
        {!isProcessing ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-slate-900">Upload Transcript</h2>
              <p className="text-sm text-slate-500 mt-1">Provide your details to analyze unofficial transcript mappings</p>
              
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100/50 transition-colors shadow-sm cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Click to Auto-fill Demo Transcript
              </button>
            </div>

            <form onSubmit={startEvaluation} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="jane.doe@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="(555) 012-3456"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sending Institution</label>
                  <input
                    type="text"
                    required
                    value={sendingInstitution}
                    onChange={(e) => setSendingInstitution(e.target.value)}
                    placeholder="Community College Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Target Program</label>
                <select
                  value={studentProgram}
                  onChange={(e) => setStudentProgram(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  <option>B.S. in Computer Science</option>
                  <option>B.S. in Business Administration</option>
                  <option>B.S. in Mechanical Engineering</option>
                  <option>B.A. in Psychology</option>
                </select>
              </div>

              {/* Uploader Box */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:bg-slate-50/50 transition-all ${
                  file ? 'border-indigo-400 bg-indigo-50/10' : 'border-slate-300'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                />
                
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 shadow-inner">
                      <FileText className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • Click to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                      <UploadCloud className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Drag and drop your transcript here</p>
                    <p className="text-xs text-slate-400 mt-1">Supports unofficial transcripts (PDF, PNG, JPG)</p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs shadow-sm transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!file || !studentName || !studentEmail}
                className={`w-full py-3.5 text-center text-sm font-semibold rounded-xl transition-all shadow-md ${
                  file && studentName && studentEmail
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 hover:shadow-lg'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                Start AI Magic Mapping
              </button>
            </form>
          </motion.div>
        ) : (
          /* Processing Screen with Live Animated Timeline */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-600 mb-4 animate-pulse">
                <RefreshCw className="h-3 w-3 animate-spin" />
                AI Model Running
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900">AI Magic Ingest & Catalog Lookup Queue</h2>
              <p className="text-sm text-slate-400 mt-1">Executing semantic mapping on transcript nodes...</p>
            </div>

            {/* Current Active Progress Value */}
            <div className="mb-8 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Operation</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {progressSteps[activeStepIndex]?.label || 'Initializing Neural Layers...'}
                </p>
              </div>
              <span className="text-2xl font-display font-extrabold text-indigo-600">
                {progressSteps[activeStepIndex]?.percent || 0}%
              </span>
            </div>

            {/* Progress Gauge */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-8 border border-slate-200">
              <motion.div
                className="bg-indigo-600 h-full rounded-full"
                animate={{ width: `${progressSteps[activeStepIndex]?.percent || 0}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Timelines List */}
            <div className="space-y-4">
              {progressSteps.length === 0 ? (
                // Skeleton loading steps
                PROCESSING_STEPS.map((s, i) => (
                  <div key={i} className="flex gap-4 items-start opacity-30">
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300 bg-white" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{s.label}</p>
                    </div>
                  </div>
                ))
              ) : (
                progressSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {step.status === 'completed' && (
                        <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-100">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                      )}
                      {step.status === 'running' && (
                        <div className="h-5 w-5 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />
                        </div>
                      )}
                      {step.status === 'idle' && (
                        <div className="h-5 w-5 rounded-full border-2 border-slate-200 bg-white" />
                      )}
                      {step.status === 'error' && (
                        <div className="h-5 w-5 rounded-full bg-rose-500 flex items-center justify-center text-white">
                          <AlertCircle className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className={`text-sm font-semibold ${
                          step.status === 'completed' ? 'text-slate-800' :
                          step.status === 'running' ? 'text-indigo-600 font-bold' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </p>
                        {step.status === 'completed' && <span className="text-[10px] text-emerald-600 font-bold">OK</span>}
                      </div>
                      {(step.status === 'running' || step.status === 'completed') && (
                        <motion.p
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-slate-400 mt-0.5 leading-relaxed"
                        >
                          {step.detail}
                        </motion.p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// EVALUATION RESULTS REPORT & LEAD GENERATION
// ==========================================
export const StudentResults: React.FC<{ id?: string }> = ({ id }) => {
  const navigate = useNavigate();
  const { evaluations, leads, updateLeadStatus, addLeadNote, triggerSystemNotification } = useAppState();
  
  // Find report
  const evaluationId = id || window.location.hash.split('/').pop() || '';
  const evalReport = evaluations.find(e => e.id === evaluationId);

  // Lead contact form states
  const [commentText, setCommentText] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  if (!evalReport) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-16 w-16 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Evaluation Report Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">We couldn't load the specified credit evaluation.</p>
        <Link to="/upload" className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md">
          Create New Evaluation
        </Link>
      </div>
    );
  }

  // Find associated CRM lead
  const associatedLead = leads.find(l => l.evaluationId === evalReport.id);

  const handlePrint = () => {
    window.print();
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !associatedLead) return;

    setIsSubmittingLead(true);
    setTimeout(() => {
      // Update lead pipeline in CRM
      updateLeadStatus(associatedLead.id, 'evaluating');
      addLeadNote(associatedLead.id, `Student requested admissions review: "${commentText}"`);
      setIsSubmittingLead(false);
      setLeadSubmitted(true);
      triggerSystemNotification('Admissions review request sent!', 'success');
    }, 800);
  };

  // Math totals
  const totalAttempted = evalReport.courses.length;
  const approvedCourses = evalReport.courses.filter(c => c.status === 'approved');
  const rejectedCourses = evalReport.courses.filter(c => c.status === 'rejected');
  const pendingCourses = evalReport.courses.filter(c => c.status === 'pending');

  const creditsTransferrable = approvedCourses.reduce((sum, c) => sum + (c.receivingCredits || 0), 0);
  const creditsAttempted = evalReport.courses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6 md:px-12 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Actions Panel */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link to="/upload" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Upload Another
          </Link>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Report Canvas */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden print:border-none print:shadow-none mb-8">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                  KNOT Estimated Report
                </span>
                <span className="text-slate-400 text-xs">• Generated by KNOT AI</span>
              </div>
              <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">{evalReport.studentName}</h1>
              <p className="text-sm text-slate-400 mt-1">
                Target: <span className="text-white font-medium">{evalReport.studentProgram}</span>
              </p>
            </div>
            
            {/* Aggregate Dashboard on Banner */}
            <div className="flex gap-8 border-t border-slate-800 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
              <div>
                <p className="text-2xl font-display font-black text-indigo-400">{creditsTransferrable} / {creditsAttempted}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Credits Transferred</p>
              </div>
              <div>
                <p className="text-2xl font-display font-black text-emerald-400">{approvedCourses.length} / {totalAttempted}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Courses Approved</p>
              </div>
              <div>
                <p className="text-2xl font-display font-black text-slate-200">{evalReport.confidenceScore}%</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Match Confidence</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Details Sheet */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Academic Mappings Summary</h3>
                  <div className="rounded-xl border border-slate-200/80 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold">
                          <th className="p-3">Sending Course</th>
                          <th className="p-3 text-center">Grade</th>
                          <th className="p-3">Apex Equivalent</th>
                          <th className="p-3 text-center">Credits</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {evalReport.courses.map((course) => (
                          <React.Fragment key={course.id}>
                            <tr className="hover:bg-slate-50/50">
                              <td className="p-3">
                                <span className="font-semibold text-slate-800 block">{course.code}</span>
                                <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">{course.title}</span>
                              </td>
                              <td className="p-3 text-center font-medium text-slate-600">{course.grade}</td>
                              <td className="p-3">
                                {course.matchedCourseCode ? (
                                  <>
                                    <span className="font-semibold text-indigo-600 block">{course.matchedCourseCode}</span>
                                    <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">{course.matchedCourseTitle}</span>
                                  </>
                                ) : (
                                  <span className="text-slate-400 italic">No Equivalent Mapped</span>
                                )}
                              </td>
                              <td className="p-3 text-center font-semibold text-slate-800">{course.receivingCredits ?? 0}</td>
                              <td className="p-3 text-right">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  course.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                                  course.status === 'rejected' ? 'bg-rose-50 text-rose-700' :
                                  'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                  {course.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                            {/* AI Rationale dropdown row */}
                            <tr className="bg-slate-50/40">
                              <td colSpan={5} className="p-3 text-[11px] text-slate-500 border-b border-slate-100">
                                <div className="flex items-start gap-1">
                                  <Sparkles className="h-3 w-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                                  <p>
                                    <strong className="text-slate-700">AI Logic ({course.confidence}% confidence):</strong> {course.reason}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Processing Metadata */}
                <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>Evaluation processed in <strong className="text-slate-700">{evalReport.processingTime}</strong></span>
                  </div>
                  <span>•</span>
                  <span>Sending Institution: <strong className="text-slate-700">{evalReport.sendingInstitution}</strong></span>
                </div>
              </div>

              {/* Right Side Panel - Transcript Visual Outline & Lead Generation */}
              <div className="space-y-6">
                
                {/* Visual SVG Transcript Mapping representation */}
                <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Transcript AI Magic Scan Map</h4>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 relative h-48 overflow-hidden flex items-center justify-center select-none shadow-inner">
                    {/* Fake page mockup */}
                    <div className="absolute top-2 left-2 text-[8px] font-bold text-slate-400 uppercase">Page 1 of 1</div>
                    <div className="w-11/12 h-5/6 flex flex-col justify-between py-2 border-r border-slate-100">
                      <div className="h-1 bg-slate-200 w-1/3 rounded-full" />
                      <div className="h-1 bg-slate-200 w-1/4 rounded-full" />
                      <div className="h-0.5 bg-slate-100 w-full" />
                      
                      {/* Highlighted items */}
                      <div className="space-y-1.5 my-2">
                        <div className="relative h-4 bg-indigo-50 border border-indigo-200/40 rounded flex items-center px-1">
                          <span className="text-[7px] text-indigo-600 font-bold uppercase">CS-101 Python Mapped</span>
                          <span className="absolute right-1 top-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <div className="relative h-4 bg-indigo-50 border border-indigo-200/40 rounded flex items-center px-1">
                          <span className="text-[7px] text-indigo-600 font-bold uppercase">CS-202 Java Mapped</span>
                          <span className="absolute right-1 top-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        </div>
                        <div className="relative h-4 bg-indigo-50 border border-indigo-200/40 rounded flex items-center px-1">
                          <span className="text-[7px] text-indigo-600 font-bold uppercase">MATH-121 Calc Mapped</span>
                          <span className="absolute right-1 top-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <div className="relative h-4 bg-rose-50 border border-rose-200/40 rounded flex items-center px-1">
                          <span className="text-[7px] text-rose-600 font-bold uppercase">ENG-110 Grade D Mapped</span>
                          <span className="absolute right-1 top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
                        </div>
                      </div>
                      <div className="h-1 bg-slate-200 w-1/2 rounded-full" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-center">AI successfully bounded 4 regions of structural course coordinates.</p>
                </div>

                {/* Lead Capture form for Admissions */}
                <div className="border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-indigo-100/10 rounded-xl p-5 print:hidden">
                  <div className="flex gap-2 items-center text-indigo-800 font-bold text-sm mb-2">
                    <PhoneCall className="h-4 w-4" />
                    <span>Talk to an Admissions Advisor</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Have questions about warnings or unmatched courses? Submit a review request, and an advisor will audit your transcript mappings.
                  </p>

                  {!leadSubmitted ? (
                    <form onSubmit={handleLeadSubmit} className="space-y-3">
                      <textarea
                        required
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="E.g., I would like to check if my ENG-110 course syllabus can transfer for credit, or talk about my Fall enrollment timeline."
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                      >
                        {isSubmittingLead ? 'Sending...' : 'Request Admissions Review'}
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 text-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <p className="text-xs font-bold text-emerald-800">Review Request Sent!</p>
                      <p className="text-[10px] text-emerald-600 mt-1">An admissions representative has been assigned to your lead file. We will email you shortly.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
