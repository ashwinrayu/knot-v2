import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Search, Plus, BookOpen, Award, RefreshCw, Trash2, 
  AlertCircle, FileSpreadsheet, Layers, Folder, Clock, History, 
  Check, X, ShieldAlert, Sparkles, FileText, ChevronRight, Eye, 
  Sliders, Settings, Info, BarChart2, CheckCircle2, Globe, Edit3
} from 'lucide-react';
import { CourseCatalog } from '../catalog/CourseCatalog';

export const KnowledgeBase: React.FC = () => {
  const { receivingCourses, evaluations, triggerSystemNotification, updateCatalogCourse, institution } = useAppState();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'injection' | 'catalog' | 'registry' | 'versions'>('dashboard');

  // Document Library items for Data Injection history
  const [docsList, setDocsList] = useState([
    { name: 'Computer_Science_Catalog_2025.pdf', size: '2.4 MB', type: 'Catalog PDF', version: 'v2.1', date: '2026-05-12', status: 'Active' },
    { name: 'Calculus_Syllabus_MIT_Equivalent.docx', size: '420 KB', type: 'Syllabus', version: 'v1.0', date: '2026-06-01', status: 'Active' }
  ]);

  // Data Injection Form state
  const [injectionSource, setInjectionSource] = useState<'link' | 'file'>('link');
  const [webLinkUrl, setWebLinkUrl] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Data Injection processing state
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectionStep, setInjectionStep] = useState(0);
  const injectionStepsList = [
    'Connecting & Ingesting Resource',
    'AI Magic Parse & Convert',
    'Vector Embedding Synthesis',
    'Brain Registry Syncing'
  ];

  // Course Registry Search / Edit state
  const [registrySearch, setRegistrySearch] = useState('');
  const [registryDept, setRegistryDept] = useState('All');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(receivingCourses[0]?.id || null);
  
  // Registry edit form states
  const [editCode, setEditCode] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editCredits, setEditCredits] = useState(3);
  const [editDesc, setEditDesc] = useState('');

  // Sync settings mock state
  const [syncTiming, setSyncTiming] = useState('Weekly');

  // Version comparisons states
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [oldVer, setOldVer] = useState('v1.8');
  const [newVer, setNewVer] = useState('v2.0');

  // Diagnostics check states
  const [isRunningValidation, setIsRunningValidation] = useState(false);
  const [validationDone, setValidationDone] = useState(false);

  const departmentsList = Array.from(new Set(receivingCourses.map(c => c.department)));

  const handleRunValidation = () => {
    setIsRunningValidation(true);
    setTimeout(() => {
      setIsRunningValidation(false);
      setValidationDone(true);
      triggerSystemNotification('Diagnostics checks complete. 0 critical errors found.', 'success');
    }, 1800);
  };

  const handleRemoveDoc = (name: string) => {
    setDocsList(prev => prev.filter(d => d.name !== name));
    triggerSystemNotification('Catalog document removed from library.', 'info');
  };

  const handleStartInjection = (e: React.FormEvent) => {
    e.preventDefault();
    if (injectionSource === 'link' && !webLinkUrl) {
      triggerSystemNotification('Please enter a website URL.', 'warning');
      return;
    }
    if (injectionSource === 'file' && !uploadFile) {
      triggerSystemNotification('Please drag or select a syllabus file.', 'warning');
      return;
    }

    setIsInjecting(true);
    setInjectionStep(0);

    // Simulate injection steps
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep < injectionStepsList.length) {
        setInjectionStep(currentStep);
      } else {
        clearInterval(interval);
        setIsInjecting(false);
        triggerSystemNotification('AI Magic Sync Syncing completed successfully!', 'success');
        
        // Add to history list
        const newItemName = injectionSource === 'link' 
          ? webLinkUrl.replace('https://', '').split('/')[0] + '_catalog_sync'
          : uploadFile?.name || 'curriculum_file.pdf';
        
        setDocsList(prev => [
          {
            name: newItemName,
            size: injectionSource === 'link' ? 'Scraped URL' : '450 KB',
            type: injectionSource === 'link' ? 'Web Link Source' : 'Uploaded File',
            version: 'v1.0',
            date: new Date().toISOString().split('T')[0],
            status: 'Active'
          },
          ...prev
        ]);
        
        setWebLinkUrl('');
        setUploadFile(null);
        setActiveTab('catalog');
      }
    }, 1500);
  };

  // Course registry filtered list
  const filteredCourses = receivingCourses.filter(c => {
    const matchesSearch = 
      c.code.toLowerCase().includes(registrySearch.toLowerCase()) ||
      c.title.toLowerCase().includes(registrySearch.toLowerCase()) ||
      c.description.toLowerCase().includes(registrySearch.toLowerCase());
    
    const matchesDept = registryDept === 'All' || c.department === registryDept;

    return matchesSearch && matchesDept;
  });

  const selectedCourse = receivingCourses.find(c => c.id === selectedCourseId);

  // Set form when course is selected
  React.useEffect(() => {
    if (selectedCourse) {
      setEditCode(selectedCourse.code);
      setEditTitle(selectedCourse.title);
      setEditDept(selectedCourse.department);
      setEditCredits(selectedCourse.credits);
      setEditDesc(selectedCourse.description);
    }
  }, [selectedCourseId, selectedCourse]);

  const handleSaveCourseEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !selectedCourse) return;

    const updatedCourse = {
      ...selectedCourse,
      code: editCode,
      title: editTitle,
      department: editDept,
      credits: Number(editCredits),
      description: editDesc
    };

    updateCatalogCourse(updatedCourse);
    triggerSystemNotification(`Syllabus registry mapping for ${editCode} saved successfully.`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5 select-none">
        <div>
          <span className="text-[10px] text-indigo-650 font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-155">
            AI Brain Mapping registry
          </span>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight mt-3">Knowledge Base</h1>
          <p className="text-xs text-slate-400 mt-1">Manage institutional course equivalence vectors, sync catalogs, and browse directories.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 border rounded-xl select-none font-bold text-[9px] uppercase tracking-wider text-slate-500">
          {(['dashboard', 'injection', 'catalog', 'registry', 'versions'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                activeTab === t ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              {t === 'injection' ? 'Data Injection' : 
               t === 'catalog' ? 'Course Catalog' : 
               t === 'registry' ? 'Registry Explorer' : 
               t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ==========================================
            1. KB DASHBOARD SHEET
           ========================================== */}
        {activeTab === 'dashboard' && (
          <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* KPI statistics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Card className="p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Total Courses</span>
                <span className="text-3xl font-display font-black text-slate-800 tracking-tight block mt-3">{receivingCourses.length}</span>
                <span className="text-[8px] text-slate-400 block mt-1 font-bold uppercase">Learned Syllabus Mapping</span>
              </Card>
              <Card className="p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Departments</span>
                <span className="text-3xl font-display font-black text-slate-800 tracking-tight block mt-3">{departmentsList.length}</span>
                <span className="text-[8px] text-slate-400 block mt-1 font-bold uppercase">Linked Faculty Branches</span>
              </Card>
              <Card className="p-5 flex flex-col justify-between hover:border-slate-300 transition-colors bg-white">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Sync Schedule ({institution.syncTiming || 'Weekly'})</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-xl font-display font-black text-indigo-650 tracking-tight">Today 2:15 PM</span>
                </div>
                <span className="text-[8px] text-emerald-600 block mt-1.5 font-bold uppercase flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Registry Sync ({institution.syncTiming || 'Weekly'})
                </span>
              </Card>
            </div>

            {/* Graphics status charts and tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* Chart 1: Course Growth */}
              <Card className="p-6 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><BarChart2 className="h-4.5 w-4.5 text-indigo-500" /> Syllabus Growth Logs</h3>
                <div className="space-y-3 font-semibold text-[10px] text-slate-500 uppercase tracking-wider">
                  <div>
                    <div className="flex justify-between mb-1"><span>Computer Science</span> <span>85% Mapped</span></div>
                    <div className="w-full h-1.5 bg-slate-100 rounded"><div className="w-[85%] h-full bg-indigo-500 rounded" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span>Mathematics</span> <span>60% Mapped</span></div>
                    <div className="w-full h-1.5 bg-slate-100 rounded"><div className="w-[60%] h-full bg-indigo-500 rounded" /></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span>Business School</span> <span>45% Mapped</span></div>
                    <div className="w-full h-1.5 bg-slate-100 rounded"><div className="w-[45%] h-full bg-indigo-500 rounded" /></div>
                  </div>
                </div>
              </Card>

              {/* Recent Imports */}
              <Card className="p-6 space-y-4 lg:col-span-2">
                <h3 className="text-xs font-bold text-slate-955 flex items-center gap-1.5"><Clock className="h-4.5 w-4.5 text-indigo-500" /> Recent KB Imports Summary</h3>
                <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                  <div className="py-2.5 flex justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Scraped Boston University course nodes</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Scraped by Evelyn • 42 courses added</span>
                    </div>
                    <span className="text-[9px] text-emerald-600 font-bold uppercase bg-emerald-50 border rounded px-2 py-0.5 self-center">Imported</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Uploaded curriculum DOCX book</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Uploaded by system • 15 equivalents added</span>
                    </div>
                    <span className="text-[9px] text-emerald-600 font-bold uppercase bg-emerald-50 border rounded px-2 py-0.5 self-center">Imported</span>
                  </div>
                </div>
              </Card>

            </div>

          </motion.div>
        )}



        {/* ==========================================
            3. DATA INJECTION (Scraper & Document Sync)
           ========================================== */}
        {activeTab === 'injection' && (
          <motion.div key="injection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form panel */}
              <Card className="lg:col-span-8 p-6 space-y-6">
                <div className="flex justify-between items-center border-b pb-3 select-none">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Data Injection Ingestion</h3>
                    <p className="text-[10px] text-slate-405 mt-0.5">Crawl web pages or upload catalogs to feed the AI Brain.</p>
                  </div>
                  
                  {/* Source Toggle */}
                  <div className="flex bg-slate-100 p-0.5 border rounded-lg font-bold text-[9px]">
                    <button
                      onClick={() => setInjectionSource('link')}
                      className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                        injectionSource === 'link' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Globe className="h-3 w-3" />
                      Web Link Scraper
                    </button>
                    <button
                      onClick={() => setInjectionSource('file')}
                      className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                        injectionSource === 'file' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <FileText className="h-3 w-3" />
                      Files Ingest
                    </button>
                  </div>
                </div>

                {isInjecting ? (
                  /* Processing Visual Steps */
                  <div className="p-8 text-center space-y-8 flex flex-col items-center select-none">
                    <RefreshCw className="h-8 w-8 text-indigo-650 animate-spin" />
                    <div className="w-full">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                        <span>AI Magic Sync Status</span>
                        <span>{( (injectionStep + 1) / injectionStepsList.length * 100).toFixed(0)}%</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {injectionStepsList.map((step, idx) => {
                          const isActive = idx === injectionStep;
                          const isDone = idx < injectionStep;
                          return (
                            <div key={idx} className="space-y-2">
                              <div className={`h-1.5 rounded transition-colors ${
                                isActive ? 'bg-indigo-600 animate-pulse' : isDone ? 'bg-emerald-500' : 'bg-slate-100'
                              }`} />
                              <span className={`block text-[8px] font-bold uppercase tracking-wider truncate ${
                                isActive ? 'text-indigo-700' : isDone ? 'text-emerald-600' : 'text-slate-400'
                              }`}>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Injection Input Form */
                  <form onSubmit={handleStartInjection} className="space-y-5">
                    {injectionSource === 'link' ? (
                      <div className="space-y-2 text-xs font-semibold text-slate-500">
                        <label className="block uppercase">Institution Course Catalog URL</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            required
                            value={webLinkUrl}
                            onChange={(e) => setWebLinkUrl(e.target.value)}
                            placeholder="e.g. https://www.communitycollege.edu/academics/catalog"
                            className="flex-grow px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => setWebLinkUrl('https://www.baycc.edu/academics/catalog/cs')}
                            className="px-3 border rounded-xl hover:bg-slate-50 font-bold bg-white text-[10px] text-slate-600"
                          >
                            Fill Mock URL
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">
                          The web scraper will fetch course descriptions, outcomes, and code definitions from the catalog DOM tree.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 text-xs font-semibold text-slate-500">
                        <label className="block uppercase">Upload Curriculum Files (PDF, Word, TXT)</label>
                        {!uploadFile ? (
                          <div className="p-8 border-2 border-dashed border-slate-200 hover:border-slate-350 rounded-2xl bg-slate-50/30 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                            onClick={() => {
                              const f = new File(['mock_contents'], 'CS_Curriculum_Syllabus_2026.pdf', { type: 'application/pdf' });
                              setUploadFile(f);
                            }}
                          >
                            <FileText className="h-8 w-8 text-slate-400" />
                            <span className="block text-slate-700 font-bold">Click to auto-load Mock Syllabus PDF</span>
                            <span className="text-[9px] text-slate-400">Accepts syllabus books up to 50MB</span>
                          </div>
                        ) : (
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center font-bold">
                            <div className="flex items-center gap-3 text-slate-750">
                              <FileText className="h-5 w-5 text-indigo-500" />
                              <div>
                                <span className="block truncate text-xs">{uploadFile.name}</span>
                                <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">PDF Document • 1.4 MB</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setUploadFile(null)}
                              className="px-3 py-1.5 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors border text-[10px]"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-4 border-t flex justify-end">
                      <Button type="submit">
                        Run AI Magic Sync Ingestion
                      </Button>
                    </div>
                  </form>
                )}
              </Card>

              {/* Sync settings info card */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="p-5 space-y-4 select-none">
                  <h4 className="text-xs font-bold text-slate-900 border-b pb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    AI Auto Sync Timing
                  </h4>
                  <div className="space-y-4 text-xs font-semibold text-slate-655">
                    <p className="leading-normal font-medium">
                      Configure automated catalog check routines in Settings or override the timing threshold coefficient here:
                    </p>
                    <div className="space-y-2">
                      <label className="block text-[9px] text-slate-400 uppercase tracking-widest font-bold">Sync Cycle Interval</label>
                      <select
                        value={syncTiming}
                        onChange={(e) => {
                          setSyncTiming(e.target.value);
                          triggerSystemNotification(`Auto-Sync schedule updated to: ${e.target.value}`, 'success');
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                      >
                        <option>Manual Sync Only</option>
                        <option>Daily at Midnight</option>
                        <option>Weekly (Sundays)</option>
                        <option>Monthly (1st of month)</option>
                      </select>
                    </div>
                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[10px] text-indigo-700 leading-normal">
                      Setup background catalog triggers under **System settings** tab.
                    </div>
                  </div>
                </Card>

                {/* History doc list */}
                <Card className="p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Ingested Sources Library</h4>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {docsList.map((doc, idx) => (
                      <div key={idx} className="p-3 border rounded-xl flex justify-between items-center bg-slate-50/30">
                        <div className="truncate">
                          <span className="font-bold text-slate-800 text-[10px] block truncate" title={doc.name}>{doc.name}</span>
                          <span className="text-[8px] text-slate-400 font-semibold block mt-0.5">{doc.type} • {doc.date}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveDoc(doc.name)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Remove source mapping"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==========================================
            4. COURSE CATALOG (EMBEDDED)
           ========================================== */}
        {activeTab === 'catalog' && (
          <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <CourseCatalog isEmbedded={true} />
          </motion.div>
        )}

        {/* ==========================================
            4. REGISTRY SEARCH & MANUAL EDITS
           ========================================== */}
        {activeTab === 'registry' && (
          <motion.div key="registry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* Search Filters Registry */}
            <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col sm:flex-row gap-4 justify-between items-center text-xs select-none">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-405" />
                <input
                  type="text"
                  value={registrySearch}
                  onChange={(e) => setRegistrySearch(e.target.value)}
                  placeholder="Search catalog code, course title, outcomes..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-semibold text-slate-750 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={registryDept}
                  onChange={(e) => setRegistryDept(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-[10px] font-bold text-slate-650"
                >
                  <option value="All">All Departments</option>
                  {departmentsList.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Courses list */}
              <Card className="lg:col-span-5 p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                <h4 className="text-xs font-bold text-slate-900 border-b pb-2 uppercase tracking-wider block select-none">
                  Learned Courses Registry ({filteredCourses.length})
                </h4>

                <div className="space-y-2">
                  {filteredCourses.length === 0 ? (
                    <p className="text-[10px] text-slate-450 italic text-center py-8">No courses found matching filters.</p>
                  ) : (
                    filteredCourses.map(course => {
                      const isSelected = course.id === selectedCourseId;
                      return (
                        <div
                          key={course.id}
                          onClick={() => setSelectedCourseId(course.id)}
                          className={`p-3 border rounded-xl cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-indigo-50/50 border-indigo-300 shadow-sm' 
                              : 'bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-start font-bold">
                            <span className="text-slate-800 text-xs">{course.code}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[8px] text-slate-500 uppercase">
                              {course.credits} Credits
                            </span>
                          </div>
                          <span className="block font-bold text-slate-600 mt-1 truncate">{course.title}</span>
                          <span className="block text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                            {course.department}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>

              {/* Right Column: Edit Form */}
              <Card className="lg:col-span-7 p-6 space-y-5">
                {selectedCourse ? (
                  <form onSubmit={handleSaveCourseEdits} className="space-y-4 text-xs font-semibold text-slate-500">
                    <div className="flex justify-between items-center border-b pb-3 select-none">
                      <div>
                        <h3 className="text-sm font-bold text-slate-905">Manual Syllabus Registry Edit</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Edit attributes to keep equivalence vectors intact</p>
                      </div>
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-150 px-2 py-0.5 rounded font-mono font-bold text-[9px]">
                        ID: {selectedCourse.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 uppercase font-bold text-slate-450">Course Code</label>
                        <input
                          type="text"
                          required
                          value={editCode}
                          onChange={(e) => setEditCode(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 uppercase font-bold text-slate-450">Credits</label>
                        <input
                          type="number"
                          required
                          value={editCredits}
                          onChange={(e) => setEditCredits(Number(e.target.value))}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 uppercase font-bold text-slate-450">Course Title</label>
                      <input
                        type="text"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 uppercase font-bold text-slate-450">Department Faculty</label>
                      <select
                        value={editDept}
                        onChange={(e) => setEditDept(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                      >
                        <option>Computer Science</option>
                        <option>Mathematics</option>
                        <option>Business</option>
                        <option>Humanities</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 uppercase font-bold text-slate-450">Syllabus / Course Description</label>
                      <textarea
                        rows={5}
                        required
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none font-semibold text-slate-700 leading-normal"
                      />
                    </div>

                    <div className="pt-3 border-t flex justify-end select-none">
                      <Button type="submit" leftIcon={<Edit3 className="h-4 w-4" />}>
                        Save Mapping Edits
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                    <Database className="h-8 w-8 text-slate-200 mb-2 animate-pulse" />
                    <p className="font-bold">No Course Selected</p>
                    <p className="text-[10px] text-slate-450 leading-normal max-w-xs mt-1">
                      Click a course in the left registry list column to edit mappings and syllabus descriptions.
                    </p>
                  </div>
                )}
              </Card>

            </div>
          </motion.div>
        )}

        {/* ==========================================
            5. VERSION HISTORY
           ========================================== */}
        {activeTab === 'versions' && (
          <motion.div key="vers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex justify-between items-center select-none border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">Change Log Registry</h3>
              <Button onClick={() => setShowCompareModal(true)} className="py-1 px-3">Compare Versions</Button>
            </div>

            <div className="space-y-2.5 font-semibold text-xs text-slate-655">
              {[
                { version: 'v2.1', user: 'Dr. Evelyn Martinez', date: '2026-07-04', desc: 'Updated CS 101 description objectives, added Java prerequisites.' },
                { version: 'v2.0', user: 'System Scraper', date: '2026-07-01', desc: 'Bulk import from scraped catalog nodes.' },
                { version: 'v1.8', user: 'Admin Owner', date: '2026-06-15', desc: 'Initial baseline setup.' }
              ].map((ver, i) => (
                <Card key={i} className="p-4 flex justify-between items-center hover:border-slate-350 transition-colors">
                  <div className="flex gap-3 items-center">
                    <div className="h-8 w-8 bg-slate-50 border rounded-lg flex items-center justify-center font-mono font-bold text-slate-500">{ver.version}</div>
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">{ver.desc}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Modified by {ver.user} on {ver.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => triggerSystemNotification(`Rollback to ${ver.version} sequence initialized.`, 'info')}
                    className="px-2.5 py-1 border rounded-lg hover:bg-slate-50 font-bold bg-white text-[9px]"
                  >
                    Rollback
                  </button>
                </Card>
              ))}
            </div>
          </motion.div>
        )}



      </AnimatePresence>

      {/* Compare version side-by-side modal */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-6 text-xs font-semibold text-slate-605"
            >
              <div className="flex justify-between items-center border-b pb-3 select-none">
                <div>
                  <h3 className="font-bold text-slate-905 text-sm">Compare Catalog Versions</h3>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Highlighting differential mappings</span>
                </div>
                <button onClick={() => setShowCompareModal(false)} className="p-1 border rounded"><X className="h-4.5 w-4.5 text-slate-400" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border rounded-xl space-y-2">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold border-b pb-1">Old Baseline ({oldVer})</span>
                  <div className="space-y-1">
                    <span className="text-slate-850 font-bold block">CS 101 Java Programming</span>
                    <p className="text-[10px] text-slate-500 leading-normal font-medium">Introduces structural scripting using basic loops and methods.</p>
                    <span className="text-[9px] text-slate-400 block">Prerequisites: None</span>
                  </div>
                </div>
                <div className="p-4 bg-indigo-50/10 border border-indigo-150 rounded-xl space-y-2">
                  <span className="text-[9px] text-indigo-650 uppercase tracking-widest block font-bold border-b pb-1">New Baseline ({newVer})</span>
                  <div className="space-y-1">
                    <span className="text-slate-850 font-bold block">CS 101 Java Programming</span>
                    <p className="text-[10px] text-slate-600 leading-normal font-medium">
                      Introduces structural scripting using basic loops, methods, <span className="bg-emerald-100 text-emerald-800 font-bold px-1 rounded">class inheritance structures, and interface implementations</span>.
                    </p>
                    <span className="text-[9px] text-slate-400 block">
                      Prerequisites: <span className="bg-emerald-100 text-emerald-800 font-bold px-1 rounded">CS 90 or equivalent</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end select-none">
                <Button onClick={() => setShowCompareModal(false)}>Close Compare</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export { KnowledgeBase as default };
