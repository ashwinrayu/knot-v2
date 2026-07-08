import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppState } from '@/context/AppStateContext';
import { ExtractedCourse, Course } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, ZoomIn, ZoomOut, RotateCw, Download, 
  Sparkles, CheckCircle2, AlertTriangle, AlertCircle, Trash2, 
  MessageSquare, History, Plus, RefreshCw, Send, Check, X, Edit3,
  ChevronDown, ChevronRight, FileText, Settings, Award, ArrowUp, ArrowDown
} from 'lucide-react';

export const EvaluationWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    evaluations, receivingCourses, updateExtractedCourse, 
    addComment, publishEvaluation, rejectEvaluation, triggerSystemNotification,
    institution
  } = useAppState();

  // Find evaluation record
  const evaluation = evaluations.find(e => e.id === id);

  // States
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [activePage, setActivePage] = useState<number>(1);
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [activeTab, setActiveTab] = useState<'ai' | 'comments' | 'history'>('ai');
  
  // Table search & filter & sorting states
  const [tableSearch, setTableSearch] = useState('');
  const [tableStatusFilter, setTableStatusFilter] = useState('All');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<'code' | 'confidence' | 'credits'>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Manual Overrides inline states (temporary buffer per course row)
  const [overrideCourseId, setOverrideCourseId] = useState<string | null>(null);
  const [tempMatchedCourseId, setTempMatchedCourseId] = useState<string>('');
  const [tempCredits, setTempCredits] = useState<number>(0);
  const [tempReason, setTempReason] = useState<string>('');

  if (!evaluation) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-16 w-16 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Evaluation File Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The selected transcript database index was not found.</p>
        <Link to="/admin/evaluations" className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md">
          Back to Evaluations List
        </Link>
      </div>
    );
  }

  // Zoom / Rotate helpers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 70));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  // Sorting helper
  const handleSort = (field: 'code' | 'confidence' | 'credits') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Expand row toggle
  const toggleRow = (courseId: string) => {
    setExpandedRows(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  // Set initial data buffer when editing mapping
  const startOverride = (course: ExtractedCourse) => {
    setOverrideCourseId(course.id);
    setTempMatchedCourseId(course.matchedCourseId || '');
    setTempCredits(course.receivingCredits || 0);
    setTempReason(course.reason);
  };

  const saveOverride = (courseId: string) => {
    const isMatched = tempMatchedCourseId !== '';
    updateExtractedCourse(evaluation.id, courseId, {
      matchedCourseId: isMatched ? tempMatchedCourseId : null,
      receivingCredits: tempCredits,
      reason: tempReason,
      status: isMatched ? 'approved' : 'rejected',
      confidence: 100 // Manual mapping override is certified 100%
    });
    setOverrideCourseId(null);
    triggerSystemNotification('Manual mapping override applied successfully', 'success');
  };

  const handlePublish = () => {
    publishEvaluation(evaluation.id);
    triggerSystemNotification('Credit evaluation approved & published.', 'success');
    navigate('/admin/dashboard');
  };

  const handleReject = () => {
    rejectEvaluation(evaluation.id);
    triggerSystemNotification('Evaluation report marked as rejected.', 'warning');
    navigate('/admin/dashboard');
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(evaluation.id, commentInput);
    setCommentInput('');
  };

  // Math metrics
  const totalCourses = evaluation.courses.length;
  const approvedCount = evaluation.courses.filter(c => c.status === 'approved').length;
  const rejectedCount = evaluation.courses.filter(c => c.status === 'rejected').length;
  const pendingCount = evaluation.courses.filter(c => c.status === 'pending').length;

  const totalCreditsEarned = evaluation.courses
    .filter(c => c.status === 'approved')
    .reduce((sum, c) => sum + (c.receivingCredits || 0), 0);

  const totalCreditsAttempted = evaluation.courses.reduce((sum, c) => sum + c.credits, 0);

  // Warnings list
  const warningsList: string[] = [];
  evaluation.courses.forEach(c => {
    if (c.grade === 'D' || c.grade === 'F') {
      warningsList.push(`${c.code} grade is ${c.grade}, falls below minimum required threshold of C.`);
    }
    if (c.matchedCourseId && c.credits !== c.receivingCredits) {
      warningsList.push(`${c.code} credits mismatch: local equivalent is ${c.receivingCredits} but transferred was ${c.credits}.`);
    }
    if (c.confidence < 70 && c.status === 'pending') {
      warningsList.push(`${c.code} similarity confidence is ${c.confidence}%, requires manual pairing.`);
    }
  });

  // Filter table courses
  const filteredCourses = evaluation.courses.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(tableSearch.toLowerCase()) || 
                          c.title.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesStatus = tableStatusFilter === 'All' || c.status === tableStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort table courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];
    
    // Sort logic fallback
    if (sortField === 'code') {
      aVal = a.code;
      bVal = b.code;
    } else if (sortField === 'confidence') {
      aVal = a.confidence;
      bVal = b.confidence;
    } else if (sortField === 'credits') {
      aVal = a.credits;
      bVal = b.credits;
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // GitHub diff style matching keywords highlighter helper
  const getHighlighterDiff = (text1: string, text2: string) => {
    const commonKeywords = ['programming', 'calculus', 'data', 'structures', 'algorithms', 'python', 'java', 'writing', 'analysis', 'logic', 'business', 'financial', 'marketing', 'psychology'];
    let highlighted1 = text1;
    let highlighted2 = text2;

    commonKeywords.forEach(word => {
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      highlighted1 = highlighted1.replace(regex, '<span class="bg-emerald-50 text-emerald-800 font-bold border border-emerald-100/50 px-1 rounded">$1</span>');
      highlighted2 = highlighted2.replace(regex, '<span class="bg-emerald-50 text-emerald-800 font-bold border border-emerald-100/50 px-1 rounded">$1</span>');
    });

    return { text1: highlighted1, text2: highlighted2 };
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Breadcrumbs & Actions Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5 print:hidden">
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/review" 
            className="p-2 border border-slate-200 hover:border-slate-350 rounded-xl bg-white text-slate-500 transition-all shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/50 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                PR review center
              </span>
              <span className="text-[10px] text-slate-400 font-bold">#{evaluation.id}</span>
            </div>
            <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight mt-1">{evaluation.studentName}</h1>
            <p className="text-xs text-slate-450 font-medium">Origin: <strong className="text-slate-700">{evaluation.sendingInstitution}</strong></p>
          </div>
        </div>

        {/* Global Action Decision buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold rounded-xl text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors"
          >
            Reject Transcript
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 hover:shadow-lg transition-all"
          >
            Approve & Publish
          </button>
        </div>
      </div>

      {/* THREE COLUMN SPLIT LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* ==========================================
            LEFT PANEL: TRANSCRIPT PDF VIEW WITH THUMBNAILS
           ========================================== */}
        <div className="xl:col-span-5 bg-white border border-slate-200/60 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.015)] overflow-hidden flex flex-col min-h-[480px]">
          {/* Header Controls */}
          <div className="bg-slate-50 border-b border-slate-100 p-3.5 flex justify-between items-center text-[10px] text-slate-500">
            <span className="font-semibold text-slate-700 truncate max-w-[150px]">transcript_unofficial.pdf</span>
            <div className="flex items-center gap-1.5 font-bold">
              <button onClick={handleZoomOut} className="p-1 hover:bg-slate-200 rounded"><ZoomOut className="h-3.5 w-3.5" /></button>
              <span className="min-w-[32px] text-center">{zoom}%</span>
              <button onClick={handleZoomIn} className="p-1 hover:bg-slate-200 rounded"><ZoomIn className="h-3.5 w-3.5" /></button>
              <div className="h-3 w-px bg-slate-200 mx-1" />
              <button onClick={handleRotate} className="p-1 hover:bg-slate-200 rounded"><RotateCw className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          {/* Double Column inside left panel: Thumbnails Navigation + Document Canvas */}
          <div className="flex-1 flex items-stretch overflow-hidden bg-slate-100/50">
            {/* Thumbnails Navigation (Simulated pages) */}
            <div className="w-16 bg-slate-50 border-r border-slate-150 p-2 space-y-3 flex flex-col items-center select-none flex-shrink-0">
              <button 
                onClick={() => setActivePage(1)}
                className={`w-full aspect-[3/4] border rounded overflow-hidden p-1 bg-white relative transition-all ${
                  activePage === 1 ? 'border-indigo-500 ring-2 ring-indigo-50 shadow-sm' : 'border-slate-200 hover:border-slate-350'
                }`}
              >
                <div className="w-full h-full bg-slate-50 flex flex-col justify-between py-1 px-0.5">
                  <div className="h-0.5 bg-slate-200 w-1/2 rounded-full" />
                  <div className="space-y-0.5">
                    <div className="h-0.5 bg-slate-200 w-full rounded-full" />
                    <div className="h-0.5 bg-slate-200 w-3/4 rounded-full" />
                  </div>
                  <span className="text-[6px] text-slate-400 font-bold block text-center">Pg 1</span>
                </div>
              </button>
              <button 
                onClick={() => setActivePage(2)}
                className={`w-full aspect-[3/4] border rounded overflow-hidden p-1 bg-white relative transition-all ${
                  activePage === 2 ? 'border-indigo-500 ring-2 ring-indigo-50 shadow-sm' : 'border-slate-200 hover:border-slate-350'
                }`}
              >
                <div className="w-full h-full bg-slate-50 flex flex-col justify-between py-1 px-0.5 opacity-55">
                  <div className="h-0.5 bg-slate-200 w-1/3 rounded-full" />
                  <div className="space-y-0.5">
                    <div className="h-0.5 bg-slate-200 w-5/6 rounded-full" />
                  </div>
                  <span className="text-[6px] text-slate-400 font-bold block text-center">Pg 2</span>
                </div>
              </button>
            </div>

            {/* Document Canvas Page representation */}
            <div className="flex-grow p-4 overflow-auto flex items-center justify-center">
              <div 
                style={{ 
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`, 
                  transition: 'transform 0.15s ease-out'
                }}
                className="bg-white border border-slate-300 w-[340px] h-[450px] p-5 shadow-lg rounded-sm relative text-[8px] text-slate-800 select-none flex flex-col justify-between"
              >
                {activePage === 1 ? (
                  <div>
                    {/* Header */}
                    <div className="text-center border-b border-slate-900 pb-2 mb-3">
                      <h4 className="font-bold text-[9px] uppercase tracking-wide">{evaluation.sendingInstitution.toUpperCase()}</h4>
                      <p className="text-[6px] text-slate-450 mt-0.5 font-bold">ACADEMIC EVALUATION DOCUMENT FILE</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[6px] text-slate-500 mb-3 font-semibold">
                      <p>Student: <strong className="text-slate-800">{evaluation.studentName}</strong></p>
                      <p className="text-right">Generated: <strong>07/02/2026</strong></p>
                    </div>

                    {/* Courses highlighting nodes */}
                    <div className="space-y-3">
                      <p className="font-bold text-slate-800 border-b border-slate-200 pb-0.5 text-[7px] uppercase tracking-wider">Courses Record</p>
                      <div className="space-y-1">
                        {evaluation.courses.map(c => {
                          const isHovered = hoveredCourseId === c.id;
                          return (
                            <div
                              key={c.id}
                              onMouseEnter={() => setHoveredCourseId(c.id)}
                              onMouseLeave={() => setHoveredCourseId(null)}
                              className={`p-1 rounded flex justify-between items-center transition-all cursor-pointer border ${
                                isHovered 
                                  ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                                  : 'border-transparent hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <span className="font-bold text-indigo-650">{c.code}</span>
                                <span className="text-slate-550 font-medium ml-1.5">{c.title}</span>
                              </div>
                              <div className="flex gap-3 font-bold text-slate-800">
                                <span>CR: {c.credits}</span>
                                <span>GRD: {c.grade}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-450 text-[9px] italic">
                    [End of scanned records block. Back side is blank.]
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 text-center text-[6px] text-slate-400 font-semibold uppercase tracking-wider">
                  Verified structural extraction bounds
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            CENTER PANEL: AI TIMELINE & MATCH LOGS
           ========================================== */}
        <div className="xl:col-span-4 bg-white border border-slate-200/60 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.015)] overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 bg-slate-50 flex text-[10px] select-none font-bold">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'ai' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              AI Extract Stages
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'comments' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Admissions Chat
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'history' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Audit Log
            </button>
          </div>

          <div className="flex-grow p-5 overflow-y-auto">
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Neural pipeline log</h4>
                  <div className="border-l border-slate-200 pl-4 space-y-4 text-[11px] font-semibold text-slate-650">
                    <div className="relative">
                      <div className="absolute -left-[20.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                      <p className="text-slate-800 font-bold">AI Mapped Alignment</p>
                      <p className="text-[10px] text-slate-400 font-medium">Analyzed coordinates bounding boxes successfully.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[20.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                      <p className="text-slate-800 font-bold">Course Parsing Parser</p>
                      <p className="text-[10px] text-slate-400 font-medium">Mapped {totalCourses} course records.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[20.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                      <p className="text-slate-800 font-bold">Semantic Catalog Vectoring</p>
                      <p className="text-[10px] text-slate-400 font-medium">Scanned Knot core indexes mapping equivalents.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[20.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 ring-4 ring-indigo-50" />
                      <p className="text-indigo-650 font-extrabold">Auto-Decision Rules</p>
                      <p className="text-[10px] text-slate-400 font-medium">Min grade check C. {approvedCount} accepted, {pendingCount} pending.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-indigo-50 bg-indigo-50/10 text-xs space-y-2 leading-relaxed">
                  <span className="font-bold text-indigo-900 flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
                    KNOT Matching Weights
                  </span>
                  <p className="text-slate-500">
                    Auto-approvals are locked when match confidence exceeds <strong className="text-slate-700">{institution.aiConfig.autoPublishThreshold}%</strong> and grades meet bounds.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                  {evaluation.comments.map(comm => (
                    <div key={comm.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center font-semibold text-slate-800">
                        <span>{comm.author}</span>
                        <span className="text-[9px] text-slate-400">{new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-550 leading-relaxed font-medium">{comm.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendComment} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Type comments log..."
                    className="flex-grow px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:bg-white"
                  />
                  <button type="submit" className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm">
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="border-l border-slate-100 pl-4 space-y-4 text-xs max-h-72 overflow-y-auto pr-1 font-semibold text-slate-650">
                {evaluation.history.map(item => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[20.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-slate-350" />
                    <div>
                      <div className="flex justify-between items-center text-slate-800">
                        <span>{item.action}</span>
                        <span className="text-[9px] text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-medium">{item.user}</p>
                      {item.details && <p className="text-[9px] text-indigo-500 italic font-medium mt-0.5">{item.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            RIGHT PANEL: SCORECARD SUMMARY & ACTIONS
           ========================================== */}
        <div className="xl:col-span-3 bg-white border border-slate-200/60 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.015)] p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Credit Scorecard</span>
              <h3 className="text-xl font-display font-black text-slate-900 tracking-tight mt-1">AI Recommendation</h3>
            </div>

            {/* Circular Progress Gauge using simple SVG */}
            <div className="flex items-center justify-center p-4">
              <div className="relative h-28 w-28 flex items-center justify-center select-none">
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="48" 
                    stroke="#6366f1" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * evaluation.confidenceScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-display font-black text-slate-800">{evaluation.confidenceScore}%</span>
                  <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">AI MATCH</span>
                </div>
              </div>
            </div>

            {/* Status Recommendation badges */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">Evaluation status</span>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border uppercase ${
                evaluation.status === 'published' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                evaluation.status === 'rejected' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                'bg-amber-50 border-amber-100 text-amber-700 animate-pulse'
              }`}>
                {evaluation.status.replace('_', ' ')}
              </span>
            </div>

            {/* Transfer total mapping metrics */}
            <div className="space-y-2 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Credits Mapped</span>
                <span className="text-slate-800 font-bold">{totalCreditsEarned} / {totalCreditsAttempted}</span>
              </div>
              <div className="flex justify-between">
                <span>Courses Scanned</span>
                <span className="text-slate-800 font-bold">{totalCourses}</span>
              </div>
            </div>
          </div>

          {/* Warnings Log list */}
          {warningsList.length > 0 && (
            <div className="p-3 rounded-xl border border-rose-100 bg-rose-50/30 space-y-2 text-[10px]">
              <span className="font-bold text-rose-800 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-550" />
                System Alerts ({warningsList.length})
              </span>
              <div className="space-y-1.5 text-rose-700/80 leading-normal max-h-24 overflow-y-auto">
                {warningsList.map((warn, i) => (
                  <p key={i} className="font-medium">• {warn}</p>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ==========================================
          BOTTOM ROW: ENTERPRISE DATA TABLE WITH EXPANDABLE DIFF VIEWER
         ========================================== */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)] space-y-5 print:hidden">
        
        {/* Table Filters header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Transfer equivalence matrix</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Click any course row to expand it and compare descriptions in a split-screen diff workspace</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-450" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search code..."
                className="w-full pl-7 pr-3 py-1.5 text-[10px] border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>
            
            {/* Filter */}
            <select
              value={tableStatusFilter}
              onChange={(e) => setTableStatusFilter(e.target.value)}
              className="px-2 py-1 border border-slate-200 rounded-lg text-[10px] bg-white focus:outline-none"
            >
              <option value="All">All statuses</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Comparison Data Grid Table */}
        <div className="overflow-x-auto text-[11px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50/40 select-none">
                <th className="p-3"></th>
                <th className="p-3 cursor-pointer hover:text-slate-800" onClick={() => handleSort('code')}>
                  <span className="flex items-center gap-1.5">
                    Sending Course
                    {sortField === 'code' && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </span>
                </th>
                <th className="p-3 text-center">Transferred Grade</th>
                <th className="p-3">Knot Equivalency</th>
                <th className="p-3 text-center">Credits Granted</th>
                <th className="p-3 text-center cursor-pointer hover:text-slate-800" onClick={() => handleSort('confidence')}>
                  <span className="flex items-center justify-center gap-1.5">
                    Confidence
                    {sortField === 'confidence' && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </span>
                </th>
                <th className="p-3 text-center">Approved Status</th>
                <th className="p-3 text-right">Mapping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
              {sortedCourses.map(course => {
                const isExpanded = expandedRows[course.id] || false;
                const isHovered = hoveredCourseId === course.id;

                // Find local equivalent description
                const receivingCourse = receivingCourses.find(rc => rc.id === course.matchedCourseId);

                // Run side-by-side highlighting simulation
                const diffHighlight = getHighlighterDiff(
                  course.reason, 
                  receivingCourse ? receivingCourse.description : 'No curriculum description mapping.'
                );

                return (
                  <React.Fragment key={course.id}>
                    {/* Primary Row */}
                    <tr 
                      onMouseEnter={() => setHoveredCourseId(course.id)}
                      onMouseLeave={() => setHoveredCourseId(null)}
                      onClick={() => toggleRow(course.id)}
                      className={`hover:bg-slate-50/40 cursor-pointer transition-colors ${
                        isHovered ? 'bg-indigo-50/10' : ''
                      } ${isExpanded ? 'bg-slate-50/30' : ''}`}
                    >
                      <td className="p-3 text-slate-400">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </td>
                      <td className="p-3 text-slate-800">
                        <span className="font-bold">{course.code}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">{course.title}</span>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-850">{course.grade}</td>
                      <td className="p-3">
                        {course.matchedCourseCode ? (
                          <div>
                            <span className="text-indigo-650 font-bold block">{course.matchedCourseCode}</span>
                            <span className="text-[10px] text-slate-450 font-semibold block mt-0.5">{course.matchedCourseTitle}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No Equivalence mapped</span>
                        )}
                      </td>
                      <td className="p-3 text-center text-slate-800 font-bold">{course.receivingCredits ?? 0}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          course.confidence >= 85 ? 'bg-emerald-50 text-emerald-700' :
                          course.confidence >= 70 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {course.confidence}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          course.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                          course.status === 'rejected' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-700 border border-amber-100/50'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startOverride(course);
                          }}
                          className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 hover:border-slate-350 rounded-lg text-[10px] text-slate-700 transition-colors shadow-sm bg-white"
                        >
                          Override
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDABLE ROW: GITHUB CODE COMPARISON STYLE DIFF */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} className="p-4 bg-slate-50/50 border-y border-slate-200/60">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4"
                          >
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">AI Mappings Detail Diff comparison</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              
                              {/* Left Column (Original/Scraped Course) */}
                              <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                  <span className="font-bold text-slate-700">Sending Course Specification</span>
                                  <span className="text-[9px] font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded uppercase">{course.code}</span>
                                </div>
                                <div className="space-y-2">
                                  <p>Title: <strong className="text-slate-800">{course.title}</strong></p>
                                  <p>Credits Attempted: <strong className="text-slate-800">{course.credits} Credits</strong></p>
                                  <p>Grade Earned: <strong className="text-slate-850">{course.grade}</strong></p>
                                  <div className="pt-2 border-t border-slate-50">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Syllabus Analysis:</p>
                                    <p 
                                      className="text-slate-550 leading-relaxed font-medium mt-1" 
                                      dangerouslySetInnerHTML={{ __html: diffHighlight.text1 }} 
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Right Column (Apex Target Equivalent Course) */}
                              <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                  <span className="font-bold text-slate-700">Knot Equivalent Target Course</span>
                                  {receivingCourse ? (
                                    <span className="text-[9px] font-bold text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded uppercase">{receivingCourse.code}</span>
                                  ) : (
                                    <span className="text-[9px] font-bold text-rose-650 bg-rose-50 px-2 py-0.5 rounded uppercase">Unassigned</span>
                                  )}
                                </div>
                                {receivingCourse ? (
                                  <div className="space-y-2">
                                    <p>Local Title: <strong className="text-slate-800">{receivingCourse.title}</strong></p>
                                    <p>Baseline Credits: <strong className="text-slate-800">{receivingCourse.credits} Credits</strong></p>
                                    <p>Department: <strong className="text-slate-800">{receivingCourse.department}</strong></p>
                                    <div className="pt-2 border-t border-slate-50">
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Curriculum Description Mapping:</p>
                                      <p 
                                        className="text-slate-550 leading-relaxed font-medium mt-1" 
                                        dangerouslySetInnerHTML={{ __html: diffHighlight.text2 }} 
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="h-full flex items-center justify-center text-slate-450 italic p-6">
                                    No equivalent local course paired. Override matching on right actions to map this course code.
                                  </div>
                                )}
                              </div>

                            </div>

                            {/* Diff summary stats */}
                            <div className="p-3 bg-white border border-slate-200/50 rounded-xl flex flex-wrap gap-6 text-[10px] font-bold text-slate-500">
                              <span>Grade Complies: <strong className="text-emerald-600">YES</strong></span>
                              <span>Credit Mismatch: <strong>{receivingCourse ? `${course.credits} to ${receivingCourse.credits} credits` : 'N/A'}</strong></span>
                              <span>Similarity Match Score: <strong className="text-indigo-600">{course.confidence}%</strong></span>
                              <span>AI Mapping Rationale justification: <span className="font-medium text-slate-650">{course.reason}</span></span>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          OVERRIDE MAPPING POPUP DRAWER MODAL
         ========================================== */}
      {overrideCourseId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                Override Course Mapping
              </h3>
              <button onClick={() => setOverrideCourseId(null)} className="text-slate-400 hover:text-slate-650">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase mb-2">Select Knot Catalog Equivalent</label>
                <select
                  value={tempMatchedCourseId}
                  onChange={(e) => setTempMatchedCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none"
                >
                  <option value="">-- No Equivalent / Reject --</option>
                  {receivingCourses.map(rc => (
                    <option key={rc.id} value={rc.id}>{rc.code} - {rc.title} ({rc.credits} CR)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-2">Overridden Transfer Credits</label>
                <input
                  type="number"
                  step={0.5}
                  value={tempCredits}
                  onChange={(e) => setTempCredits(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase mb-2">Override Reason / Rationale</label>
                <textarea
                  rows={3}
                  value={tempReason}
                  onChange={(e) => setTempReason(e.target.value)}
                  placeholder="Justify why this course equivalence was updated manually..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none"
                />
              </div>

              <button
                onClick={() => saveOverride(overrideCourseId)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all"
              >
                Apply Override Mapping
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
