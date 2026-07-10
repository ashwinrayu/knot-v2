import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronRight, Folder, FileText, Search, 
  Library, Plus, HelpCircle, LayoutGrid, List, Sparkles, 
  Trash2, Edit2, RotateCcw, AlertCircle, Bookmark, Compass
} from 'lucide-react';

interface CourseCatalogProps {
  isEmbedded?: boolean;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ isEmbedded = false }) => {
  const { receivingCourses, evaluations, triggerSystemNotification, addCatalogCourse } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Selected course for right details panel
  const [selectedCourseId, setSelectedCourseId] = useState<string>(receivingCourses[0]?.id || '');

  // Add overrides state
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideCredits, setOverrideCredits] = useState(3);
  const [overrideReason, setOverrideReason] = useState('');

  const departments = ['All', 'Computer Science', 'Mathematics', 'Business', 'Humanities'];
  const programs = ['All', 'B.S. in Computer Science', 'B.S. in Business Administration', 'B.S. in Mechanical Engineering'];

  // Advanced search includes code, title, department, topics, outcomes
  const filteredCourses = receivingCourses.filter(c => {
    const matchesSearch = 
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || c.department === selectedDept;
    
    // Simulating program matches
    const matchesProg = selectedProgram === 'All' || 
      (selectedProgram === 'B.S. in Computer Science' && c.department === 'Computer Science') ||
      (selectedProgram === 'B.S. in Business Administration' && c.department === 'Business');

    return matchesSearch && matchesDept && matchesProg;
  });

  const selectedCourse = receivingCourses.find(c => c.id === selectedCourseId) || filteredCourses[0];

  // Helper mapping equivalents from evaluations logs
  const getMatchesForCourse = (courseCode: string) => {
    const matches: Array<{ code: string, title: string, school: string, confidence: number }> = [];
    evaluations.forEach(evalItem => {
      evalItem.courses.forEach(c => {
        if (c.matchedCourseCode === courseCode) {
          matches.push({
            code: c.code,
            title: c.title,
            school: evalItem.sendingInstitution,
            confidence: c.confidence
          });
        }
      });
    });
    return matches;
  };

  const matchedEquivalents = selectedCourse ? getMatchesForCourse(selectedCourse.code) : [];

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason) {
      triggerSystemNotification('Override reason is required.', 'warning');
      return;
    }
    triggerSystemNotification(`Manual override applied: credits set to ${overrideCredits}.`, 'success');
    setShowOverrideModal(false);
    setOverrideReason('');
  };

  return (
    <div className={isEmbedded ? "space-y-6 text-xs" : "space-y-6 pb-12 font-sans text-xs"}>
      
      {/* Header */}
      {!isEmbedded && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5 select-none">
          <div>
            <span className="text-[10px] text-indigo-650 font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border">
              Curriculum Explorer Workspace
            </span>
            <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight mt-3">Course Catalog</h1>
            <p className="text-xs text-slate-400 mt-1">Audit institutional course requirements, credits, and AI suggestions.</p>
          </div>
        </div>
      )}

      {/* Main Grid: LEFT filters tree, CENTER list, RIGHT details sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ==========================================
            LEFT: FILTERS & TREE
           ========================================== */}
        <Card className="lg:col-span-3 p-4 space-y-5 select-none">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Catalog Filter Tree</h3>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog code..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-750 focus:outline-none"
              />
            </div>
          </div>

          {/* Departments Tree */}
          <div className="space-y-2">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Departments</span>
            <div className="space-y-1 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors capitalize ${
                    selectedDept === dept ? 'bg-indigo-55/10 text-indigo-700' : 'hover:bg-slate-50'
                  }`}
                >
                  <Folder className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                  <span>{dept}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Programs Tree */}
          <div className="space-y-2">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Programs</span>
            <div className="space-y-1 font-semibold text-[11px] text-slate-500 uppercase tracking-wider">
              {programs.map(prog => (
                <button
                  key={prog}
                  onClick={() => setSelectedProgram(prog)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors truncate capitalize ${
                    selectedProgram === prog ? 'bg-indigo-55/10 text-indigo-700' : 'hover:bg-slate-50'
                  }`}
                >
                  <span>{prog}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ==========================================
            CENTER: COURSE CARD/TABLE LIST
           ========================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center select-none bg-slate-50 p-2 border rounded-xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">{filteredCourses.length} Courses Found</span>
            
            {/* View Mode Toggle */}
            <div className="flex bg-white p-0.5 border rounded-lg">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-650'}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-650'}`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Catalog items */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredCourses.map(course => {
                const isSelected = selectedCourseId === course.id;
                return (
                  <Card
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`p-4 cursor-pointer hover:border-slate-350 transition-all ${
                      isSelected ? 'border-indigo-650 bg-indigo-50/10 shadow-xs' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start font-bold">
                      <div>
                        <span className="text-slate-900 text-xs block">{course.code}</span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{course.title}</span>
                      </div>
                      <span className="text-[9px] bg-slate-50 border rounded px-1.5 py-0.5 text-slate-600 font-bold uppercase">{course.credits} Credits</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="overflow-hidden">
              <table className="w-full text-left text-xs font-semibold text-slate-650">
                <thead className="bg-slate-50 border-b text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Title</th>
                    <th className="p-3 text-right">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCourses.map(course => (
                    <tr 
                      key={course.id}
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`cursor-pointer hover:bg-slate-50/40 ${selectedCourseId === course.id ? 'bg-indigo-50/20' : ''}`}
                    >
                      <td className="p-3 font-bold text-slate-800">{course.code}</td>
                      <td className="p-3 text-slate-500">{course.title}</td>
                      <td className="p-3 text-right text-slate-550">{course.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        {/* ==========================================
            RIGHT: COURSE DETAILS SHEET
           ========================================== */}
        {selectedCourse && (
          <Card className="lg:col-span-4 p-5 space-y-5 flex flex-col justify-start">
            <div className="border-b pb-3 mb-2 select-none">
              <span className="text-[9px] bg-indigo-50 border rounded px-2 py-0.5 text-indigo-700 font-bold uppercase tracking-wider block w-fit">Course details sheet</span>
              <h2 className="text-base font-display font-black text-slate-900 tracking-tight mt-2">{selectedCourse.code} {selectedCourse.title}</h2>
              <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">{selectedCourse.department} • {selectedCourse.credits} Credits</span>
            </div>

            <div className="space-y-4 font-semibold text-slate-550 leading-relaxed text-[11px]">
              
              {/* Description */}
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Description</span>
                <p className="text-slate-655 font-medium leading-normal bg-slate-50/50 p-3 border rounded-xl">{selectedCourse.description}</p>
              </div>

              {/* Outcomes */}
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Learning Outcomes</span>
                <ul className="space-y-1.5 text-xs text-slate-500 font-medium pl-4 list-disc">
                  <li>Understand core syntax rules, compilers, and binary execution patterns.</li>
                  <li>Develop structured loops, matrices, class hierarchies, and structures.</li>
                </ul>
              </div>

              {/* Equivalents suggestions */}
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-2">AI Mappings Suggested equivalents</span>
                {matchedEquivalents.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No incoming matches audited yet.</p>
                ) : (
                  <div className="space-y-2">
                    {matchedEquivalents.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-indigo-50/20 border border-indigo-100 rounded-xl flex justify-between items-center font-bold text-[10px]">
                        <div>
                          <span className="text-slate-800 block">{item.code} ({item.school})</span>
                          <span className="text-[8px] text-slate-400 block font-semibold mt-0.5">Similarity overlapping: {item.confidence}%</span>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Override options action */}
              <div className="pt-3 border-t select-none">
                <Button 
                  onClick={() => setShowOverrideModal(true)} 
                  className="w-full py-2.5 text-[10px]" 
                  variant="outline"
                  leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                >
                  Manual Override Mappings
                </Button>
              </div>

            </div>
          </Card>
        )}

      </div>

      {/* Manual Override modal sheet */}
      <AnimatePresence>
        {showOverrideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-6 text-xs font-semibold text-slate-600"
            >
              <h3 className="font-bold text-slate-900 text-sm border-b pb-2 select-none">Manual Override Settings</h3>
              
              <form onSubmit={handleApplyOverride} className="space-y-4 text-xs font-semibold text-slate-500">
                <div>
                  <label className="block mb-2 uppercase">Override Credits Value</label>
                  <input
                    type="number"
                    required
                    value={overrideCredits}
                    onChange={(e) => setOverrideCredits(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 uppercase">Override Justification (Reason Required)</label>
                  <textarea
                    rows={3}
                    required
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Syllabus content overlaps core catalog CS 101 requirements."
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none resize-none font-semibold text-slate-700"
                  />
                </div>

                <div className="flex gap-2 justify-end select-none">
                  <Button variant="outline" type="button" onClick={() => setShowOverrideModal(false)}>Cancel</Button>
                  <Button type="submit">Apply Override</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export { CourseCatalog as default };
