import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitPullRequest, GitMerge, GitCommit, MessageSquare,
  AlertTriangle, Calendar, Search, ArrowRight, Inbox,
  FileText, Mail, Check, X, Edit, Download, RefreshCw,
  Sparkles, Clock, CheckSquare, Send, ShieldAlert, Activity,
  BookOpen, BarChart2, ChevronDown, ChevronRight, Upload, Star,
  Eye, Globe, Printer, QrCode, Zap, User2, Flag, Bell, Archive
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabKey = 'queue' | 'appeals' | 'publish' | 'communications' | 'activity' | 'audit' | 'feedback';

interface AppealItem {
  id: string;
  student: string;
  evalId: string;
  reason: string;
  file: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected' | 'Additional Info Required';
  submittedAt: string;
  notes: string;
}

interface AuditEntry {
  user: string;
  action: string;
  oldVal: string;
  newVal: string;
  ip: string;
  date: string;
  reason: string;
}

interface ActivityEvent {
  id: string;
  type: 'upload' | 'ocr' | 'ai' | 'review' | 'override' | 'appeal' | 'publish' | 'message' | 'reprocess';
  label: string;
  detail: string;
  user: string;
  date: string;
}

interface LearningOverride {
  original: string;
  human: string;
  reason: string;
  confidence: number;
  count: number;
}

interface PublishTarget {
  id: string;
  studentName: string;
  evalId: string;
  institution: string;
  program: string;
  confidenceScore: number;
  status: string;
  version: number;
}

interface MsgItem {
  id: string;
  sender: string;
  text: string;
  date: string;
  isStudent: boolean;
}

// ─── Mock data seeds ──────────────────────────────────────────────────────────

const INITIAL_APPEALS: AppealItem[] = [
  { id: 'ap_1', student: 'Sarah Jenkins', evalId: 'eval_2', reason: 'CS 10A covers full Java OOP inheritance models including polymorphism and encapsulation. The rejection was incorrect.', file: 'CS10A_Syllabus_BU.pdf', status: 'Submitted', submittedAt: '2026-07-05 10:14', notes: '' },
  { id: 'ap_2', student: 'Mark Brody', evalId: 'eval_3', reason: 'Credits for Discrete Math were calculated as 3 instead of 4. Our institution awards 4 credits for this course.', file: 'Math_Catalog_BU.pdf', status: 'Under Review', submittedAt: '2026-07-04 15:32', notes: 'Waiting for department confirmation.' },
  { id: 'ap_3', student: 'Elena Voss', evalId: 'eval_1', reason: 'PHYS 201 includes lab component worth additional credit. The lab syllabus was not submitted initially.', file: 'PHYS201_Lab.pdf', status: 'Accepted', submittedAt: '2026-07-01 09:00', notes: 'Lab credits confirmed by dept.' },
];

const INITIAL_AUDIT: AuditEntry[] = [
  { user: 'Dr. Evelyn Martinez', action: 'Manual Override Course Mapping', oldVal: 'Unmapped Elective', newVal: 'CS 101 – Java Programming', ip: '192.168.1.104', date: '2026-07-06 14:15', reason: 'Syllabus content confirms OOP curriculum match' },
  { user: 'AI Magic Ingestion', action: 'AI Magic Scan Completed', oldVal: 'Raw PDF Binary', newVal: 'Structured JSON Object (14 courses)', ip: '10.0.0.12', date: '2026-07-06 14:12', reason: 'Automated pipeline stage' },
  { user: 'Prof. Aaron Patel', action: 'Evaluation Published', oldVal: 'pending_review', newVal: 'published', ip: '192.168.2.221', date: '2026-07-06 13:00', reason: 'All courses verified and approved' },
  { user: 'Dr. Evelyn Martinez', action: 'Override Credits', oldVal: '3 Credits', newVal: '4 Credits', ip: '192.168.1.104', date: '2026-07-05 16:40', reason: 'Institution awards 4 credits for this course level' },
  { user: 'System AI Engine', action: 'Semantic Matching Completed', oldVal: 'Unmatched: MATH 80', newVal: 'Matched: MATH 101 Calculus I (87% confidence)', ip: '10.0.0.15', date: '2026-07-05 14:22', reason: 'Automated AI pipeline result' },
];

const ACTIVITY_LOG: ActivityEvent[] = [
  { id: 'a1', type: 'upload', label: 'Transcript Uploaded', detail: 'sarah_jenkins_transcript.pdf uploaded by student', user: 'Sarah Jenkins', date: '2026-07-05 09:14' },
  { id: 'a2', type: 'ocr', label: 'AI Magic Scan', detail: '14 courses parsed from 2-page transcript', user: 'AI Magic Engine', date: '2026-07-05 09:15' },
  { id: 'a3', type: 'ai', label: 'AI Evaluation Completed', detail: 'Semantic matching returned 87% overall confidence score', user: 'System AI Engine', date: '2026-07-05 09:16' },
  { id: 'a4', type: 'review', label: 'Manual Review Initiated', detail: 'Assigned to Dr. Evelyn Martinez for final review', user: 'System Scheduler', date: '2026-07-05 09:30' },
  { id: 'a5', type: 'override', label: 'Manual Override Applied', detail: 'CS 10A remapped to CS 101 – Java Programming (4 credits)', user: 'Dr. Evelyn Martinez', date: '2026-07-05 14:40' },
  { id: 'a6', type: 'appeal', label: 'Student Appeal Submitted', detail: 'Sarah Jenkins submitted an appeal for CS 10A credit mapping', user: 'Sarah Jenkins', date: '2026-07-05 16:00' },
  { id: 'a7', type: 'publish', label: 'Report Published', detail: 'Evaluation report v1.2 published and emailed to student', user: 'Prof. Aaron Patel', date: '2026-07-06 13:00' },
];

const LEARNING_OVERRIDES: LearningOverride[] = [
  { original: 'Unmapped Elective', human: 'CS 101 – Java Programming', reason: 'Syllabus includes full OOP paradigm instruction', confidence: 95, count: 8 },
  { original: 'MATH 80 (3 Credits)', human: 'MATH 101 Calculus I (4 Credits)', reason: 'Origin institution awards equivalent content at 4-credit weight', confidence: 92, count: 5 },
  { original: 'ENG 10 – Writing Skills', human: 'ENG 101 – Composition & Rhetoric', reason: 'Equivalent writing outcomes per department agreement', confidence: 89, count: 3 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function activityIcon(type: ActivityEvent['type']) {
  const map: Record<ActivityEvent['type'], React.ReactNode> = {
    upload: <Upload className="h-3.5 w-3.5 text-blue-500" />,
    ocr: <FileText className="h-3.5 w-3.5 text-violet-500" />,
    ai: <Sparkles className="h-3.5 w-3.5 text-indigo-500" />,
    review: <Eye className="h-3.5 w-3.5 text-amber-500" />,
    override: <Edit className="h-3.5 w-3.5 text-orange-500" />,
    appeal: <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />,
    publish: <Globe className="h-3.5 w-3.5 text-emerald-500" />,
    message: <MessageSquare className="h-3.5 w-3.5 text-sky-500" />,
    reprocess: <RefreshCw className="h-3.5 w-3.5 text-teal-500" />,
  };
  return map[type] ?? <Activity className="h-3.5 w-3.5 text-slate-400" />;
}

function appealStatusBadge(status: AppealItem['status']) {
  const map: Record<AppealItem['status'], string> = {
    'Submitted': 'bg-amber-50 text-amber-700 border-amber-100',
    'Under Review': 'bg-blue-50 text-blue-700 border-blue-100',
    'Accepted': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Rejected': 'bg-rose-50 text-rose-700 border-rose-100',
    'Additional Info Required': 'bg-violet-50 text-violet-700 border-violet-100',
  };
  return `px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${map[status]}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ReviewCenter: React.FC = () => {
  const navigate = useNavigate();
  const { evaluations, triggerSystemNotification, publishEvaluation, rejectEvaluation } = useAppState();

  const [activeTab, setActiveTab] = useState<TabKey>('queue');

  // Queue tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [confidenceFilter, setConfidenceFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  // Appeals tab
  const [appeals, setAppeals] = useState<AppealItem[]>(INITIAL_APPEALS);
  const [appealNote, setAppealNote] = useState<Record<string, string>>({});

  // Communications tab
  const [replyText, setReplyText] = useState('');
  const [msgList, setMsgList] = useState<MsgItem[]>([
    { id: 'm1', sender: 'Alex Johnson', text: 'Will my Math 80 credits count toward Calculus II requirement?', date: '2:10 PM', isStudent: true },
    { id: 'm2', sender: 'Advisor Evelyn', text: 'Hi Alex, Calculus I matches well. Calculus II needs a direct syllabus match — can you upload the course description?', date: '2:15 PM', isStudent: false },
    { id: 'm3', sender: 'Alex Johnson', text: 'Sure, I will upload the full syllabus from my university portal right now.', date: '2:18 PM', isStudent: true },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState('Evaluation Completed');
  const [emailSubject, setEmailSubject] = useState('Your Knot Transfer Credit Report is Ready');
  const [emailBody, setEmailBody] = useState(
    'Hello {Student Name},\n\nYour transfer credit evaluation #{Evaluation Number} has been completed.\n\nView your full report here:\n{Report Link}\n\nIf you have questions, please contact your admissions advisor.\n\nBest regards,\n{Reviewer Name}\nKnot Admissions Office'
  );

  // Publish tab
  const [publishPreview, setPublishPreview] = useState<PublishTarget | null>(null);
  const [includeSignature, setIncludeSignature] = useState(true);
  const [includeQR, setIncludeQR] = useState(true);
  const [includeWatermark, setIncludeWatermark] = useState(false);
  const [coverTitle, setCoverTitle] = useState('Official Transfer Credit Evaluation Report');

  // Filtered evaluations for queue
  const filteredList = evaluations.filter(e => {
    const matchSearch =
      e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.sendingInstitution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'pending' && e.status === 'pending_review') ||
      (statusFilter === 'published' && e.status === 'published') ||
      (statusFilter === 'rejected' && e.status === 'rejected');
    const matchConf =
      confidenceFilter === 'All' ||
      (confidenceFilter === 'high' && e.confidenceScore >= 85) ||
      (confidenceFilter === 'low' && e.confidenceScore < 85);
    return matchSearch && matchStatus && matchConf;
  });

  // Bulk handlers
  const toggleSelect = (id: string) =>
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const toggleSelectAll = () =>
    setSelectedIds(selectedIds.length === filteredList.length ? [] : filteredList.map(e => e.id));

  const handleBulkApprove = () => {
    if (!selectedIds.length) return;
    selectedIds.forEach(id => publishEvaluation(id, 'Bulk approved via Review Center'));
    triggerSystemNotification(`Bulk published ${selectedIds.length} evaluations.`, 'success');
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    if (!selectedIds.length) return;
    triggerSystemNotification(`CSV export of ${selectedIds.length} records dispatched.`, 'success');
  };

  // Individual decision handlers
  const handleApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    publishEvaluation(id, 'Approved via Review Center');
    triggerSystemNotification('Evaluation approved and published.', 'success');
  };

  const handleReject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    rejectEvaluation(id, 'Rejected via Review Center');
    triggerSystemNotification('Evaluation rejected.', 'info');
  };

  // Appeals handlers
  const handleResolveAppeal = (id: string, action: 'Accepted' | 'Rejected') => {
    setAppeals(prev => prev.map(a => (a.id === id ? { ...a, status: action } : a)));
    triggerSystemNotification(`Appeal ${action.toLowerCase()} successfully.`, 'success');
  };

  // Message send
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setMsgList(prev => [
      ...prev,
      { id: `m_${Date.now()}`, sender: 'Advisor Evelyn', text: replyText, date: 'Just now', isStudent: false },
    ]);
    setReplyText('');
    triggerSystemNotification('Message sent to student.', 'success');
  };

  // Publish handlers
  const handlePublish = () => {
    if (!publishPreview) return;
    publishEvaluation(publishPreview.evalId, 'Published via Report Publishing workflow');
    triggerSystemNotification('Report published and email dispatched to student.', 'success');
    setPublishPreview(null);
  };

  // Tabs config
  const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'queue', label: 'Review Queue', icon: <GitPullRequest className="h-3.5 w-3.5" /> },
    { key: 'appeals', label: 'Appeals', icon: <ShieldAlert className="h-3.5 w-3.5" /> },
    { key: 'publish', label: 'Publishing', icon: <Globe className="h-3.5 w-3.5" /> },
    { key: 'communications', label: 'Communications', icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { key: 'activity', label: 'Activity', icon: <Activity className="h-3.5 w-3.5" /> },
    { key: 'audit', label: 'Audit Logs', icon: <BookOpen className="h-3.5 w-3.5" /> },
    { key: 'feedback', label: 'AI Feedback', icon: <BarChart2 className="h-3.5 w-3.5" /> },
  ];

  // Ready-to-publish evaluations (pending_review with confidence ≥ 70)
  const readyToPublish: PublishTarget[] = evaluations
    .filter(e => e.status === 'pending_review')
    .map(e => ({
      id: e.id,
      studentName: e.studentName,
      evalId: e.id,
      institution: e.sendingInstitution,
      program: e.studentProgram,
      confidenceScore: e.confidenceScore,
      status: e.status,
      version: 1,
    }));

  return (
    <div className="space-y-5 pb-16 text-xs font-sans">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            Admissions Command Center
          </span>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight mt-3">
            Review Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit AI evaluations · resolve appeals · publish reports · track every action.
          </p>
        </div>

        {/* KPI pills */}
        <div className="flex gap-3 flex-wrap">
          <div className="bg-amber-50 border border-amber-100 px-3.5 py-2 rounded-xl text-center min-w-[70px]">
            <span className="text-[8px] text-amber-600 font-bold uppercase block">Pending</span>
            <span className="text-xl font-display font-black text-amber-700">
              {evaluations.filter(e => e.status === 'pending_review').length}
            </span>
          </div>
          <div className="bg-rose-50 border border-rose-100 px-3.5 py-2 rounded-xl text-center min-w-[70px]">
            <span className="text-[8px] text-rose-600 font-bold uppercase block">Appeals</span>
            <span className="text-xl font-display font-black text-rose-700">
              {appeals.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length}
            </span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 px-3.5 py-2 rounded-xl text-center min-w-[70px]">
            <span className="text-[8px] text-emerald-600 font-bold uppercase block">Published</span>
            <span className="text-xl font-display font-black text-emerald-700">
              {evaluations.filter(e => e.status === 'published').length}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl w-fit flex-wrap select-none">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all ${
              activeTab === t.key
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════════════════════════════════════════════════════════════
            TAB 1: REVIEW QUEUE
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'queue' && (
          <motion.div key="queue" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-4">

            {/* Filters bar */}
            <Card className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search student or institution…"
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 w-52"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold bg-white focus:outline-none text-slate-600"
                  >
                    <option value="All">All Statuses</option>
                    <option value="pending">Pending Review</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select
                    value={confidenceFilter}
                    onChange={e => setConfidenceFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold bg-white focus:outline-none text-slate-600"
                  >
                    <option value="All">All Confidence</option>
                    <option value="high">High (≥ 85%)</option>
                    <option value="low">Low (&lt; 85%)</option>
                  </select>
                </div>

                {selectedIds.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleBulkApprove}
                      className="py-1.5 px-3.5 text-[10px] font-bold"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Approve {selectedIds.length} Selected
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleBulkExport}
                      className="py-1.5 px-3.5 text-[10px] font-bold"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export CSV
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Queue Table */}
            <Card className="overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[9px] text-slate-400 font-bold uppercase tracking-wider select-none">
                  <tr>
                    <th className="p-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredList.length && filteredList.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="p-3">Evaluation ID</th>
                    <th className="p-3">Student</th>
                    <th className="p-3">Institution</th>
                    <th className="p-3">Target Program</th>
                    <th className="p-3 text-center">Confidence</th>
                    <th className="p-3 text-center">Priority</th>
                    <th className="p-3 text-center">Reviewer</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.length === 0 && (
                    <tr>
                      <td colSpan={10} className="p-16 text-center text-slate-400">
                        <Inbox className="h-10 w-10 mx-auto text-slate-200 mb-3" />
                        <p className="text-sm font-bold text-slate-600">No evaluations in this view</p>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Try clearing your filters or wait for new transcripts to arrive.</p>
                      </td>
                    </tr>
                  )}
                  {filteredList.map(ev => {
                    const isSelected = selectedIds.includes(ev.id);
                    const isExpanded = expandedReviewId === ev.id;
                    const warnings = ev.courses.filter(c => c.confidence < 70 || c.grade === 'D').length;
                    const priority = ev.confidenceScore < 70 ? 'High' : ev.confidenceScore < 85 ? 'Medium' : 'Normal';

                    return (
                      <React.Fragment key={ev.id}>
                        <tr
                          className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/20' : ''} ${isExpanded ? 'bg-slate-50/40' : ''}`}
                          onClick={() => setExpandedReviewId(isExpanded ? null : ev.id)}
                        >
                          <td className="p-3" onClick={e => { e.stopPropagation(); toggleSelect(ev.id); }}>
                            <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(ev.id)} className="rounded" />
                          </td>
                          <td className="p-3 font-mono font-bold text-[9px] text-slate-400">#{ev.id.slice(0, 8)}</td>
                          <td className="p-3 font-bold text-slate-900">{ev.studentName}</td>
                          <td className="p-3 text-slate-500 font-medium">{ev.sendingInstitution}</td>
                          <td className="p-3 text-slate-600">{ev.studentProgram}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${ev.confidenceScore >= 85 ? 'bg-emerald-50 text-emerald-700' : ev.confidenceScore >= 70 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                              {ev.confidenceScore}%
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${priority === 'High' ? 'bg-rose-50 text-rose-600' : priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                              {priority}
                            </span>
                          </td>
                          <td className="p-3 text-center text-slate-500 font-medium">Dr. Evelyn</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${ev.status === 'published' ? 'bg-emerald-50 text-emerald-700' : ev.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700 animate-pulse'}`}>
                              {ev.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex gap-1.5 justify-end">
                              {ev.status === 'pending_review' && (
                                <>
                                  <button
                                    onClick={e => handleApprove(ev.id, e)}
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-100 transition-colors"
                                    title="Approve"
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={e => handleReject(ev.id, e)}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-100 transition-colors"
                                    title="Reject"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={e => { e.stopPropagation(); navigate(`/admin/evaluations/${ev.id}`); }}
                                className="p-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-lg border border-slate-200 transition-colors"
                                title="Open Workspace"
                              >
                                <Eye className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded inline reviewer panel */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={10} className="p-4 bg-slate-50/60 border-b border-slate-200/60">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                              >
                                {/* AI Summary */}
                                <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-3">
                                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> AI Summary
                                  </h4>
                                  <div className="space-y-2 text-[11px]">
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Courses Evaluated</span>
                                      <span className="font-bold text-slate-800">{ev.courses.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Approved</span>
                                      <span className="font-bold text-emerald-700">{ev.courses.filter(c => c.status === 'approved').length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Rejected</span>
                                      <span className="font-bold text-rose-700">{ev.courses.filter(c => c.status === 'rejected').length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Warnings</span>
                                      <span className={`font-bold ${warnings > 0 ? 'text-amber-700' : 'text-slate-500'}`}>{warnings}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Reviewer Notes */}
                                <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-3">
                                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Edit className="h-3.5 w-3.5 text-amber-500" /> Reviewer Notes
                                  </h4>
                                  <textarea
                                    rows={4}
                                    placeholder="Add internal review notes here…"
                                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:bg-white resize-none font-medium text-slate-700"
                                  />
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-2.5">
                                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Zap className="h-3.5 w-3.5 text-violet-500" /> Quick Actions
                                  </h4>
                                  <button
                                    onClick={() => navigate(`/admin/evaluations/${ev.id}`)}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 transition-colors text-[11px] font-bold"
                                  >
                                    <Eye className="h-3.5 w-3.5" /> Open Full Workspace
                                  </button>
                                  <button
                                    onClick={() => { setPublishPreview({ id: ev.id, studentName: ev.studentName, evalId: ev.id, institution: ev.sendingInstitution, program: ev.studentProgram, confidenceScore: ev.confidenceScore, status: ev.status, version: 1 }); setActiveTab('publish'); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors text-[11px] font-bold"
                                  >
                                    <Globe className="h-3.5 w-3.5" /> Publish Report
                                  </button>
                                  <button
                                    onClick={e => handleReject(ev.id, e as any)}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors text-[11px] font-bold"
                                  >
                                    <X className="h-3.5 w-3.5" /> Reject Evaluation
                                  </button>
                                  <button
                                    onClick={() => triggerSystemNotification('Reprocessing queued for next AI cycle.', 'info')}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-[11px] font-bold"
                                  >
                                    <RefreshCw className="h-3.5 w-3.5" /> Request Reprocessing
                                  </button>
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
            </Card>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 2: APPEALS
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'appeals' && (
          <motion.div key="appeals" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-4">

            {/* Status summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 select-none">
              {(['Submitted', 'Under Review', 'Accepted', 'Rejected', 'Additional Info Required'] as AppealItem['status'][]).map(s => (
                <Card key={s} className="p-3 text-center">
                  <span className="text-[8px] font-bold uppercase text-slate-400 block">{s}</span>
                  <span className="text-lg font-display font-black text-slate-900 mt-1 block">
                    {appeals.filter(a => a.status === s).length}
                  </span>
                </Card>
              ))}
            </div>

            {/* Appeal cards */}
            <div className="space-y-3">
              {appeals.map(appeal => (
                <Card key={appeal.id} className="p-5">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-grow space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">{appeal.student}</span>
                            <span className={appealStatusBadge(appeal.status)}>{appeal.status}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                            Evaluation #{appeal.evalId} · Submitted {appeal.submittedAt}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs font-medium text-slate-700 leading-relaxed">
                        {appeal.reason}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-650 bg-indigo-50 px-3 py-1.5 rounded-xl w-fit">
                        <FileText className="h-3.5 w-3.5" />
                        {appeal.file}
                      </div>

                      {appeal.notes && (
                        <p className="text-[10px] font-semibold text-slate-500 italic border-l-2 border-amber-300 pl-2.5">
                          Reviewer Note: {appeal.notes}
                        </p>
                      )}

                      {/* Internal note area */}
                      <textarea
                        rows={2}
                        value={appealNote[appeal.id] ?? ''}
                        onChange={e => setAppealNote(prev => ({ ...prev, [appeal.id]: e.target.value }))}
                        placeholder="Add internal reviewer note…"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:bg-white resize-none font-medium text-slate-700"
                      />
                    </div>

                    {/* Sidebar actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {(appeal.status === 'Submitted' || appeal.status === 'Under Review') && (
                        <>
                          <Button onClick={() => handleResolveAppeal(appeal.id, 'Accepted')} className="py-2 text-[10px] font-bold">
                            <Check className="h-3 w-3 mr-1" /> Accept Appeal
                          </Button>
                          <Button variant="outline" onClick={() => handleResolveAppeal(appeal.id, 'Rejected')} className="py-2 text-[10px] font-bold">
                            <X className="h-3 w-3 mr-1" /> Reject Appeal
                          </Button>
                          <button
                            onClick={() => {
                              setAppeals(prev => prev.map(a => a.id === appeal.id ? { ...a, status: 'Additional Info Required' } : a));
                              triggerSystemNotification('Student notified to provide additional documents.', 'info');
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 transition-colors text-[10px] font-bold flex items-center gap-1.5"
                          >
                            <Bell className="h-3 w-3" /> Request More Info
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => navigate(`/admin/evaluations/${appeal.evalId}`)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors text-[10px] font-bold flex items-center gap-1.5"
                      >
                        <Eye className="h-3 w-3" /> View Evaluation
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 3: REPORT PUBLISHING
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'publish' && (
          <motion.div key="publish" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

              {/* Ready to publish list */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 select-none">
                  <Clock className="h-4 w-4 text-amber-500" /> Ready to Publish ({readyToPublish.length})
                </h3>

                {readyToPublish.length === 0 && (
                  <Card className="p-10 text-center">
                    <CheckSquare className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-600">All clear!</p>
                    <p className="text-xs text-slate-400 mt-1">No evaluations waiting to be published.</p>
                  </Card>
                )}

                {readyToPublish.map(pt => (
                  <Card
                    key={pt.id}
                    onClick={() => setPublishPreview(pt)}
                    className={`p-4 cursor-pointer hover:border-indigo-300 transition-all ${publishPreview?.id === pt.id ? 'border-indigo-400 bg-indigo-50/20 shadow-sm' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900">{pt.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{pt.institution} · {pt.program}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${pt.confidenceScore >= 85 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {pt.confidenceScore}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-[9px] font-bold text-indigo-650 bg-indigo-50 px-2 py-1 rounded-lg w-fit">
                      <FileText className="h-3 w-3" />
                      Evaluation v{pt.version}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Publish Config Panel */}
              <div className="lg:col-span-7">
                {publishPreview ? (
                  <Card className="p-6 space-y-5">
                    <div className="border-b pb-4">
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Publishing Workflow</span>
                      <h3 className="text-base font-black text-slate-900 mt-2">{publishPreview.studentName}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">{publishPreview.institution} · {publishPreview.program}</p>
                    </div>

                    {/* Cover config */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Report Cover Title</label>
                      <input
                        type="text"
                        value={coverTitle}
                        onChange={e => setCoverTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:bg-white"
                      />
                    </div>

                    {/* Options toggles */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Report Components</span>
                      {[
                        { label: 'Include Reviewer Signature', icon: <Edit className="h-3.5 w-3.5" />, value: includeSignature, set: setIncludeSignature },
                        { label: 'Include QR Code (secure link)', icon: <QrCode className="h-3.5 w-3.5" />, value: includeQR, set: setIncludeQR },
                        { label: 'Include Official Watermark', icon: <Star className="h-3.5 w-3.5" />, value: includeWatermark, set: setIncludeWatermark },
                      ].map(opt => (
                        <button
                          key={opt.label}
                          onClick={() => opt.set(!opt.value)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${opt.value ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >
                          <span className="flex items-center gap-2">{opt.icon} {opt.label}</span>
                          <div className={`w-8 h-4 rounded-full flex items-center transition-all ${opt.value ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                            <div className={`w-3 h-3 bg-white rounded-full shadow mx-0.5 transition-all ${opt.value ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Publish actions */}
                    <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
                      <Button onClick={handlePublish} className="w-full py-2.5 font-bold text-sm">
                        <Globe className="h-4 w-4 mr-2" /> Publish & Email to Student
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => triggerSystemNotification('PDF generated and downloading…', 'success')}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-bold text-slate-700 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" /> Download PDF
                        </button>
                        <button
                          onClick={() => triggerSystemNotification('Secure share link copied to clipboard.', 'success')}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-bold text-slate-700 transition-colors"
                        >
                          <Globe className="h-3.5 w-3.5" /> Share Secure Link
                        </button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-16 text-center h-full flex flex-col items-center justify-center">
                    <FileText className="h-12 w-12 text-slate-200 mb-4" />
                    <p className="text-sm font-bold text-slate-500">Select an evaluation to configure publishing</p>
                    <p className="text-xs text-slate-400 mt-1">Set cover title, signature, QR code, and watermark options before publishing.</p>
                  </Card>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 4: COMMUNICATIONS
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'communications' && (
          <motion.div key="comm" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

              {/* Chat Panel */}
              <Card className="lg:col-span-6 flex flex-col h-[480px]">
                <div className="p-4 border-b flex items-center gap-2 select-none flex-shrink-0">
                  <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User2 className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Alex Johnson</span>
                    <span className="text-[9px] text-emerald-600 font-bold">Online</span>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-3.5">
                  {msgList.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isStudent ? 'justify-start' : 'justify-end'}`}>
                      <div className={`p-3 rounded-2xl max-w-[80%] space-y-1 ${msg.isStudent ? 'bg-slate-100 text-slate-800 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'}`}>
                        <div className={`flex justify-between gap-6 text-[8px] font-bold ${msg.isStudent ? 'text-slate-400' : 'text-indigo-200'}`}>
                          <span>{msg.sender}</span>
                          <span>{msg.date}</span>
                        </div>
                        <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendReply} className="p-3 border-t flex gap-2 flex-shrink-0">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type a message…"
                    className="flex-grow px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:bg-white font-medium"
                  />
                  <Button type="submit" className="py-2 px-3.5">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </Card>

              {/* Email Template Panel */}
              <Card className="lg:col-span-6 p-5 flex flex-col gap-4 h-[480px]">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 select-none border-b pb-3">
                  <Mail className="h-4 w-4 text-indigo-500" /> Email Template Editor
                </h3>
                <select
                  value={selectedTemplate}
                  onChange={e => setSelectedTemplate(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  {['Evaluation Completed', 'Appeal Decision', 'Admissions Invitation', 'Reprocessing Started', 'Report Published', 'Reminder: Pending Documents'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none"
                  />
                </div>
                <div className="flex-grow">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Body · Variables: {`{Student Name}`} {`{Evaluation Number}`} {`{Report Link}`} {`{Reviewer Name}`}
                  </label>
                  <textarea
                    value={emailBody}
                    onChange={e => setEmailBody(e.target.value)}
                    className="w-full h-36 p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end border-t pt-3">
                  <button
                    onClick={() => triggerSystemNotification('Test email dispatched to admin inbox.', 'info')}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold transition-colors"
                  >
                    Test Send
                  </button>
                  <Button
                    onClick={() => triggerSystemNotification('Email template saved successfully.', 'success')}
                    className="py-2 px-3.5 text-[10px] font-bold"
                  >
                    Save Template
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 5: ACTIVITY TIMELINE
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'activity' && (
          <motion.div key="activity" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Card className="p-6">
              <h3 className="text-xs font-bold text-slate-700 mb-6 select-none flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-indigo-500" /> Full Activity Timeline — All Evaluations
              </h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[18px] top-0 bottom-0 w-px bg-slate-200" />
                <div className="space-y-5">
                  {ACTIVITY_LOG.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex gap-4 relative"
                    >
                      {/* Icon node */}
                      <div className="flex-shrink-0 w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-xs z-10">
                        {activityIcon(event.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-grow pb-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-xs font-bold text-slate-900">{event.label}</span>
                            <p className="text-[10px] font-semibold text-slate-500 mt-0.5 leading-relaxed">{event.detail}</p>
                            <span className="text-[9px] font-bold text-slate-400 block mt-1">by {event.user}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-semibold whitespace-nowrap mt-0.5 flex-shrink-0">{event.date}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 6: AUDIT LOGS
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'audit' && (
          <motion.div key="audit" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Card className="overflow-hidden">
              <div className="px-5 py-4 border-b bg-slate-50/50 flex items-center justify-between select-none">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-violet-500" /> Immutable Audit Log
                  </h3>
                  <p className="text-[9px] font-semibold text-slate-400 mt-0.5">Every action is permanently recorded. Tamper-proof.</p>
                </div>
                <button
                  onClick={() => triggerSystemNotification('Audit log exported as CSV.', 'success')}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-3 w-3" /> Export
                </button>
              </div>
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead className="bg-slate-100/60 border-b border-slate-200 text-[9px] text-slate-400 font-bold uppercase tracking-wider select-none">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Previous Value</th>
                    <th className="p-3">New Value</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INITIAL_AUDIT.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30">
                      <td className="p-3 font-bold text-slate-900">{log.user}</td>
                      <td className="p-3 text-slate-600 font-medium">{log.action}</td>
                      <td className="p-3 font-mono text-[9px] text-rose-600 bg-rose-50/30">{log.oldVal}</td>
                      <td className="p-3 font-mono text-[9px] text-emerald-700 bg-emerald-50/30">{log.newVal}</td>
                      <td className="p-3 text-slate-500 font-medium">{log.reason}</td>
                      <td className="p-3 font-mono text-slate-400 text-[9px]">{log.ip}</td>
                      <td className="p-3 text-right text-slate-400">{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 7: AI LEARNING FEEDBACK LOOP
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'feedback' && (
          <motion.div key="feedback" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-5">

            {/* KPI strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
              <Card className="p-4 text-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">AI Accuracy Gain</span>
                <span className="text-2xl font-display font-black text-emerald-600 mt-1.5 block">+12.4%</span>
                <span className="text-[8px] text-slate-400 font-semibold mt-0.5 block">Incremental improvement</span>
              </Card>
              <Card className="p-4 text-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Overrides Logged</span>
                <span className="text-2xl font-display font-black text-slate-900 mt-1.5 block">142</span>
                <span className="text-[8px] text-slate-400 font-semibold mt-0.5 block">Human correction vectors</span>
              </Card>
              <Card className="p-4 text-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Auto-Approval Rate</span>
                <span className="text-2xl font-display font-black text-indigo-700 mt-1.5 block">82.5%</span>
                <span className="text-[8px] text-slate-400 font-semibold mt-0.5 block">Passed AI thresholds</span>
              </Card>
              <Card className="p-4 text-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Avg. Confidence</span>
                <span className="text-2xl font-display font-black text-slate-900 mt-1.5 block">88.3%</span>
                <span className="text-[8px] text-slate-400 font-semibold mt-0.5 block">Across all evaluations</span>
              </Card>
            </div>

            {/* Override patterns table */}
            <Card className="overflow-hidden">
              <div className="px-5 py-4 border-b bg-slate-50/50 select-none">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-500" /> AI Learning Feedback – Override Pattern Library
                </h3>
                <p className="text-[9px] font-semibold text-slate-400 mt-0.5">Captured override vectors used to fine-tune semantic similarity models.</p>
              </div>
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead className="bg-slate-100/60 border-b border-slate-200 text-[9px] text-slate-400 font-bold uppercase tracking-wider select-none">
                  <tr>
                    <th className="p-3">Original AI Decision</th>
                    <th className="p-3">Human Correction</th>
                    <th className="p-3">Correction Rationale</th>
                    <th className="p-3 text-center">Confidence</th>
                    <th className="p-3 text-right">Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {LEARNING_OVERRIDES.map((ov, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30">
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 rounded font-bold text-[9px]">{ov.original}</span>
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold text-[9px]">{ov.human}</span>
                      </td>
                      <td className="p-3 text-slate-500 font-medium">{ov.reason}</td>
                      <td className="p-3 text-center">
                        <span className="font-bold text-indigo-700">{ov.confidence}%</span>
                      </td>
                      <td className="p-3 text-right text-slate-400">{ov.count}× observed</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default ReviewCenter;
