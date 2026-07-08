import React, { useState } from 'react';
import { useAppState } from '@/context/AppStateContext';
import { Lead } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Award, Calendar, Building, Phone, Mail, 
  ChevronRight, ChevronLeft, Plus, X, Search, FileText, StickyNote,
  LayoutGrid, List, KanbanSquare, SlidersHorizontal, MessageSquarePlus, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LeadPipeline: React.FC = () => {
  const { leads, updateLeadStatus, addLeadNote, triggerSystemNotification } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'pipeline' | 'table' | 'card'>('pipeline');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [programFilter, setProgramFilter] = useState('All');

  const stages: Array<{ id: Lead['status']; title: string; color: string; bg: string }> = [
    { id: 'new', title: 'New Leads', color: 'border-indigo-200 text-indigo-700', bg: 'bg-indigo-50/20' },
    { id: 'contacted', title: 'Contacted', color: 'border-blue-200 text-blue-700', bg: 'bg-blue-50/20' },
    { id: 'evaluating', title: 'Evaluating', color: 'border-amber-200 text-amber-700', bg: 'bg-amber-50/20' },
    { id: 'won', title: 'Admitted / Won', color: 'border-emerald-200 text-emerald-700', bg: 'bg-emerald-50/20' },
    { id: 'lost', title: 'Closed / Lost', color: 'border-slate-200 text-slate-700', bg: 'bg-slate-50/40' }
  ];

  // Filter leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.sendingInstitution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = programFilter === 'All' || l.studentProgram === programFilter;
    return matchesSearch && matchesProgram;
  });

  const getLeadsByStage = (stageId: Lead['status']) => {
    return filteredLeads.filter(l => l.status === stageId);
  };

  const handleMoveStage = (leadId: string, currentStatus: Lead['status'], direction: 'forward' | 'backward') => {
    const currentIndex = stages.findIndex(s => s.id === currentStatus);
    let nextIndex = currentIndex;
    
    if (direction === 'forward' && currentIndex < stages.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === 'backward' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }

    if (nextIndex !== currentIndex) {
      const nextStatus = stages[nextIndex].id;
      updateLeadStatus(leadId, nextStatus);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim() || !selectedLeadId) return;

    addLeadNote(selectedLeadId, noteInput);
    setNoteInput('');
    triggerSystemNotification('Admissions advisor note logged successfully.', 'success');
  };

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const handleQuickFollowUpEmail = (lead: Lead) => {
    addLeadNote(lead.id, `Follow-up email sent: "Thanks for inquiring! Your credit report is ready."`);
    triggerSystemNotification(`Follow-up email dispatched to ${lead.studentName}!`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/50">
            Admissions CRM dashboard
          </span>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight mt-3">Student Leads CRM</h1>
          <p className="text-xs text-slate-400 mt-1">Convert prospective transfer inquiries by managing pipeline engagements.</p>
        </div>
        
        {/* Toggle switchers */}
        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 rounded-xl text-slate-500 text-[10px] font-bold uppercase tracking-wider select-none">
          <button
            onClick={() => setViewMode('pipeline')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'pipeline' ? 'bg-white text-slate-800 shadow-sm' : 'hover:text-slate-800'
            }`}
          >
            <KanbanSquare className="h-3.5 w-3.5" />
            Pipeline
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'table' ? 'bg-white text-slate-800 shadow-sm' : 'hover:text-slate-800'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Table List
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'card' ? 'bg-white text-slate-800 shadow-sm' : 'hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Card Grid
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-405" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or school..."
            className="w-full pl-8 pr-3 py-1.5 text-[10px] border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-slate-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] bg-white focus:outline-none font-bold text-slate-650"
          >
            <option value="All">All Programs</option>
            <option>B.S. in Computer Science</option>
            <option>B.S. in Business Administration</option>
            <option>B.S. in Mechanical Engineering</option>
          </select>
        </div>
      </div>

      {/* RENDER DYNAMIC VIEWS */}
      <AnimatePresence mode="wait">
        
        {/* view 1: Kanban Pipeline */}
        {viewMode === 'pipeline' && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 items-start"
          >
            {stages.map(stage => {
              const stageLeads = getLeadsByStage(stage.id);
              
              return (
                <div key={stage.id} className="space-y-4">
                  {/* Column Header */}
                  <div className={`p-3 border-b-2 rounded-t-lg bg-white border border-slate-200/60 flex justify-between items-center text-xs font-bold uppercase tracking-wider ${stage.color}`}>
                    <span>{stage.title}</span>
                    <span className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-500 font-black">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards stack */}
                  <div className={`space-y-3 min-h-[420px] p-2.5 rounded-b-xl border border-dashed border-slate-200/80 ${stage.bg}`}>
                    {stageLeads.length === 0 ? (
                      <p className="text-[10px] text-slate-400 italic text-center py-10 font-semibold">Column empty</p>
                    ) : (
                      stageLeads.map(lead => (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLeadId(lead.id)}
                          className="p-4 bg-white border border-slate-200/60 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:shadow-md cursor-pointer transition-all space-y-3 relative group"
                        >
                          <div className="relative">
                            <span className="font-bold text-slate-800 text-xs block hover:text-indigo-650 transition-colors pr-6">{lead.studentName}</span>
                            <span className="text-[9px] text-slate-400 block font-bold mt-0.5">{lead.studentProgram}</span>
                            
                            {/* Quick Follow-up Email Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickFollowUpEmail(lead);
                              }}
                              className="opacity-0 group-hover:opacity-100 absolute top-0 right-0 p-1.5 border border-indigo-200 rounded-lg bg-indigo-50 text-indigo-650 hover:bg-indigo-100 transition-all cursor-pointer"
                              title="Send Follow-up Email"
                            >
                              <Mail className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex gap-2 items-center text-[10px] text-slate-500 font-semibold">
                            <Building className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{lead.sendingInstitution}</span>
                          </div>

                          {/* Stats footer row */}
                          <div className="flex justify-between items-center border-t border-slate-50 pt-2.5 mt-2.5">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-650">
                              <Award className="h-3.5 w-3.5" />
                              <span>Score: {lead.leadScore}</span>
                            </div>

                            {/* Move handles */}
                            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                              <button
                                disabled={stage.id === 'new'}
                                onClick={() => handleMoveStage(lead.id, lead.status, 'backward')}
                                className="p-0.5 border border-slate-100 rounded hover:bg-slate-50 text-slate-400 disabled:opacity-30"
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </button>
                              <button
                                disabled={stage.id === 'lost'}
                                onClick={() => handleMoveStage(lead.id, lead.status, 'forward')}
                                className="p-0.5 border border-slate-100 rounded hover:bg-slate-50 text-slate-400 disabled:opacity-30"
                              >
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* view 2: Data Grid Table */}
        {viewMode === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-200/60 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.015)] overflow-hidden"
          >
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold">
                    <th className="p-4">Student Name</th>
                    <th className="p-4">School</th>
                    <th className="p-4">Target Program</th>
                    <th className="p-4 text-center">Score</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50/20">
                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">{lead.studentName}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">{lead.studentEmail}</span>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{lead.sendingInstitution}</td>
                      <td className="p-4 text-slate-650">{lead.studentProgram}</td>
                      <td className="p-4 text-center font-extrabold text-indigo-650">{lead.leadScore}%</td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500 uppercase">{lead.status}</span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickFollowUpEmail(lead);
                          }}
                          className="px-3 py-1.5 border border-indigo-200 hover:bg-indigo-50 text-indigo-650 hover:border-indigo-300 rounded-lg text-[10px] shadow-sm font-bold bg-white mr-2 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Mail className="h-3 w-3" />
                          <span>Send Email</span>
                        </button>
                        <button
                          onClick={() => setSelectedLeadId(lead.id)}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] text-slate-700 shadow-sm font-bold bg-white inline-flex items-center"
                        >
                          Logs Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* view 3: Card Grid */}
        {viewMode === 'card' && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredLeads.map(lead => (
              <div
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-md cursor-pointer transition-shadow space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs block">{lead.studentName}</h4>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{lead.studentProgram}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[9px] font-bold text-slate-500 uppercase">{lead.status}</span>
                </div>
                <div className="space-y-2 text-[10px] text-slate-500 font-semibold">
                  <div className="flex items-center gap-2"><Building className="h-3.5 w-3.5 text-slate-400" /> <span>{lead.sendingInstitution}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-slate-400" /> <span>Evaluated: {lead.evaluationDate}</span></div>
                </div>
                <div className="border-t border-slate-50 pt-3 flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 font-semibold">Match score: <strong className="text-slate-700">{lead.leadScore}%</strong></span>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleQuickFollowUpEmail(lead)}
                      className="p-1.5 border border-indigo-150 rounded-lg bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 transition-colors cursor-pointer animate-fade-in"
                      title="Send Follow-up Email"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-indigo-650 flex items-center gap-0.5 cursor-pointer" onClick={() => setSelectedLeadId(lead.id)}>
                      Open Profile
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </AnimatePresence>

      {/* ==========================================
          LEAD DETAILS DRAWER SIDE SHEET
         ========================================== */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-[10px] font-bold text-indigo-700 capitalize">
                      {selectedLead.status}
                    </span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-[10px] text-slate-450 font-bold flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Inquired {selectedLead.evaluationDate}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-black text-slate-900">{selectedLead.studentName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedLead.studentProgram}</p>
                </div>
                <button
                  onClick={() => setSelectedLeadId(null)}
                  className="p-1 text-slate-400 hover:text-slate-650 rounded-lg hover:bg-slate-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body details */}
              <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                
                {/* Contact grid */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <Mail className="h-4.5 w-4.5 text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Email Address</p>
                      <a href={`mailto:${selectedLead.studentEmail}`} className="font-bold text-slate-700 hover:text-indigo-600 block truncate max-w-[130px]">{selectedLead.studentEmail}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <Phone className="h-4.5 w-4.5 text-slate-400" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Phone Number</p>
                      <a href={`tel:${selectedLead.studentPhone}`} className="font-bold text-slate-700 hover:text-indigo-600">{selectedLead.studentPhone}</a>
                    </div>
                  </div>
                </div>

                {/* Send Follow-up Email button */}
                <div className="select-none">
                  <button
                    type="button"
                    onClick={() => handleQuickFollowUpEmail(selectedLead)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 hover:shadow-lg cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    Send Follow-up Email
                  </button>
                </div>

                {/* Score */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                  <div className="flex gap-2.5 items-center">
                    <Award className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Lead Transfer Score</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Vector credit correlation percentage ratio</p>
                    </div>
                  </div>
                  <span className="text-2xl font-display font-black text-indigo-600">{selectedLead.leadScore}%</span>
                </div>

                {/* Associated Report link */}
                {selectedLead.evaluationId && (
                  <div className="p-3 bg-indigo-50/10 border border-indigo-100/50 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex gap-2 items-center font-semibold text-slate-750">
                      <FileText className="h-4.5 w-4.5 text-indigo-500" />
                      <span>Associated Credit Report File</span>
                    </div>
                    <Link
                      to={`/admin/evaluations/${selectedLead.evaluationId}`}
                      onClick={() => setSelectedLeadId(null)}
                      className="text-indigo-600 hover:text-indigo-755 font-bold flex items-center gap-0.5"
                    >
                      Audit Matches
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                )}

                {/* Log history notes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <StickyNote className="h-4.5 w-4.5 text-slate-400" />
                    Interaction logs history
                  </h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {selectedLead.notes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed font-semibold">
                        {note}
                      </div>
                    ))}
                  </div>

                  {/* Add note form */}
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Log call summary or advisor update..."
                      className="flex-grow px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50/40 focus:bg-white"
                    />
                    <button type="submit" className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-sm">
                      Save Log
                    </button>
                  </form>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
