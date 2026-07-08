import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Database, Sliders, CheckSquare, Sparkles, 
  ArrowRight, ArrowLeft, Upload, Globe, Check, AlertCircle, RefreshCw,
  FolderOpen, Settings, HelpCircle, FileText, CheckCircle2, Trash2, Camera, ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Stepper } from '../../components/ui/Stepper';

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { onboardCollege, updateAIConfig, triggerSystemNotification } = useAppState();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  // Step 2: College Info
  const [collegeName, setCollegeName] = useState('Knot University');
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80');
  const [website, setWebsite] = useState('www.knot.edu');
  const [email, setEmail] = useState('admissions@knot.edu');
  const [phone, setPhone] = useState('(617) 555-0199');
  const [address, setAddress] = useState('100 University Ave, Boston, MA 02115');
  const [timezone, setTimezone] = useState('Eastern Standard Time (EST)');
  const [academicCalendar, setAcademicCalendar] = useState('Semester-based');

  // Step 3: KB Sources selected
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const toggleSource = (src: string) => {
    setSelectedSources(prev => 
      prev.includes(src) ? prev.filter(s => s !== src) : [...prev, src]
    );
  };

  // Step 4: Scraper Simulation
  const [scrapeUrl, setScrapeUrl] = useState('https://www.knot.edu/catalog/computer-science');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeStepIndex, setScrapeStepIndex] = useState(0);
  const scraperStages = [
    'Connecting',
    'Scanning Pages',
    'Finding Courses',
    'Reading Content',
    'Extracting Credits',
    'Extracting Descriptions',
    'Building Knowledge Base',
    'Completed'
  ];

  // Step 5: Document Uploads
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; isDuplicate?: boolean }>>([]);
  const handleDropMock = () => {
    setUploadedFiles([
      { name: 'CS_Curriculum_2025.pdf', size: '1.4 MB', isDuplicate: false },
      { name: 'MATH_Syllabus_Calculus.docx', size: '420 KB', isDuplicate: false },
      { name: 'CS_Curriculum_2025.pdf', size: '1.4 MB', isDuplicate: true } // Mock duplicate trigger
    ]);
  };

  // Step 6: AI Parsing counters
  const [isParsing, setIsParsing] = useState(false);
  const [parsingDone, setParsingDone] = useState(false);

  const startParsingSimulation = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setParsingDone(true);
      triggerSystemNotification('AI Catalog Translation finished successfully.', 'success');
    }, 2500);
  };

  const handleNext = () => {
    if (step === 2 && !collegeName) {
      triggerSystemNotification('College Name is required.', 'warning');
      return;
    }
    if (step === 3 && selectedSources.length === 0) {
      triggerSystemNotification('Please select at least one knowledge source.', 'warning');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleScrape = async () => {
    if (!scrapeUrl.startsWith('http')) {
      triggerSystemNotification('Please provide a valid website URL.', 'warning');
      return;
    }
    setIsScraping(true);
    setScrapeStepIndex(0);

    for (let i = 0; i < scraperStages.length; i++) {
      setScrapeStepIndex(i);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setIsScraping(false);
    triggerSystemNotification('Syllabus catalog scraped and parsed.', 'success');
  };

  const handleFinalize = () => {
    onboardCollege({
      name: collegeName,
      email,
      website,
      address,
      logo,
      primaryContact: {
        name: 'Dean Martinez',
        email: 'e.martinez@knot.edu',
        phone
      }
    });

    navigate('/admin/dashboard');
  };

  const stepsList = [
    'Welcome',
    'College Info',
    'KB Sources',
    'AI Scraper',
    'Doc Uploads',
    'AI Translation'
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 font-sans text-xs">
      
      {/* Header */}
      <div className="text-center mb-8 select-none">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Institutional setup wizard</h1>
        <p className="text-xs text-slate-450 mt-1">Configure your course equivalents registry and AI matching coefficients</p>
      </div>

      {/* Stepper progression list */}
      <div className="mb-8 flex justify-between items-center bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs select-none">
        {stepsList.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <div key={idx} className="flex items-center flex-grow last:flex-grow-0">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                  isActive ? 'bg-indigo-650 text-white shadow-md shadow-indigo-150' :
                  isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {isDone ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden md:inline ${
                  isActive ? 'text-slate-850 font-bold' : isDone ? 'text-slate-450' : 'text-slate-400'
                }`}>
                  {label}
                </span>
              </div>
              {idx < stepsList.length - 1 && (
                <div className={`h-0.5 mx-4 flex-grow ${isDone ? 'bg-emerald-500' : 'bg-slate-100'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Sheets container */}
      <Card className="p-8 min-h-[420px] flex flex-col justify-between overflow-hidden relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <motion.div key="st1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">Welcome to Knot Onboarding</h2>
                <p className="text-xs text-slate-400 mt-1">Configure your university credentials to initialize transcript audits.</p>
              </div>

              <div className="p-4 bg-slate-50 border rounded-xl leading-relaxed text-slate-600 font-semibold space-y-3">
                <p>
                  Knot utilizes a centralized catalog AI matching engine. By uploading descriptions, credits structure, and prerequisites parameters now, you configure the system once. Subsequent transcript scans match this database ruleset automatically.
                </p>
                <div className="border-t pt-3 space-y-2">
                  <span className="text-[10px] text-slate-450 uppercase block tracking-wider font-bold">Requirements Checklist</span>
                  <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> College Catalog Course Codes</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Academic credit weights descriptions</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Syllabus curriculum PDF sheets</li>
                  </ul>
                </div>
              </div>

              <Button onClick={() => setStep(2)} className="w-full py-3" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Continue Setup
              </Button>
            </motion.div>
          )}

          {/* STEP 2: COLLEGE INFO */}
          {step === 2 && (
            <motion.div key="st2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">College Profile</h2>
                <p className="text-xs text-slate-400 mt-1">Set academic schedules and email addresses.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                <div>
                  <label className="block mb-2 uppercase">College Name</label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 uppercase">University Logo URL</label>
                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                <div>
                  <label className="block mb-2 uppercase">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 uppercase">Admissions Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                <div>
                  <label className="block mb-2 uppercase">Academic Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 uppercase">Academic Calendar</label>
                  <select
                    value={academicCalendar}
                    onChange={(e) => setAcademicCalendar(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-750 focus:outline-none"
                  >
                    <option>Semester-based</option>
                    <option>Quarter-based</option>
                    <option>Trimester-based</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 select-none">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleNext}>Save & Continue</Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: KNOWLEDGE SOURCE */}
          {step === 3 && (
            <motion.div key="st3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">Select Knowledge Base Sources</h2>
                <p className="text-xs text-slate-400 mt-1">Specify how you want to build the AI matching database.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-bold text-xs select-none">
                {[
                  { id: 'pdf', title: 'Upload PDF / DOCX', desc: 'Catalog files, syllabus indices' },
                  { id: 'scraper', title: 'AI Website Scraper', desc: 'Scan target catalog sites' },
                  { id: 'db', title: 'Import Database', desc: 'Sync from ERP catalog logs' }
                ].map(src => {
                  const active = selectedSources.includes(src.id);
                  return (
                    <Card
                      key={src.id}
                      onClick={() => toggleSource(src.id)}
                      className={`p-4 cursor-pointer border hover:border-slate-350 transition-all ${
                        active ? 'border-indigo-650 bg-indigo-50/10 shadow-xs' : ''
                      }`}
                    >
                      <h4 className={`text-xs block font-bold ${active ? 'text-indigo-700' : 'text-slate-800'}`}>{src.title}</h4>
                      <p className="text-[10px] text-slate-405 font-medium mt-1 leading-normal">{src.desc}</p>
                    </Card>
                  );
                })}
              </div>

              <div className="flex gap-2 justify-end pt-8 select-none">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleNext}>Continue</Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: AI WEBSCRAPER */}
          {step === 4 && (
            <motion.div key="st4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">AI Website Scraper</h2>
                <p className="text-xs text-slate-400 mt-1">Extract courses descriptors directly from college websites.</p>
              </div>

              {!isScraping ? (
                <div className="space-y-4 text-xs font-semibold text-slate-500">
                  <div>
                    <label className="block mb-2 uppercase">Website Catalog URL</label>
                    <input
                      type="url"
                      value={scrapeUrl}
                      onChange={(e) => setScrapeUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                    />
                  </div>
                  <Button type="button" onClick={handleScrape} className="w-full py-2.5">Start Scraping</Button>
                </div>
              ) : (
                <div className="p-6 text-center space-y-4 flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 text-indigo-650 animate-spin" />
                  <div>
                    <span className="font-bold text-slate-800 block">Scanning catalog nodes...</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Executing extraction on: {scrapeUrl}</span>
                  </div>
                  <div className="w-full max-w-sm">
                    <Stepper steps={scraperStages} activeStep={scrapeStepIndex} />
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-4 select-none">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleNext}>Continue</Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: DOCUMENT LIBRARY */}
          {step === 5 && (
            <motion.div key="st5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">Document Library Uploads</h2>
                <p className="text-xs text-slate-400 mt-1">Drop syllabus books, curriculum guides, and PDFs.</p>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div 
                  onClick={handleDropMock}
                  className="border-2 border-dashed border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-white p-8 rounded-2xl text-center cursor-pointer select-none space-y-2 transition-all"
                >
                  <Upload className="h-8 w-8 mx-auto text-slate-400" />
                  <span className="text-slate-805 block">Drag and drop file sheets, or browse files</span>
                  <span className="text-[9px] text-slate-400 block">Supports PDF, DOCX, ZIP, PNG</span>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className={`p-2.5 border rounded-xl flex justify-between items-center ${
                        f.isDuplicate ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-slate-50 text-slate-700'
                      }`}>
                        <span>{f.name} ({f.size})</span>
                        {f.isDuplicate ? (
                          <span className="text-[8px] bg-amber-200 px-2 py-0.5 rounded font-bold uppercase">Duplicate Checked</span>
                        ) : (
                          <span className="text-[8px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">Ready</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-4 select-none">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={handleNext}>Continue</Button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: AI PARSING */}
          {step === 6 && (
            <motion.div key="st6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div>
                <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">AI Knowledge Translation</h2>
                <p className="text-xs text-slate-400 mt-1">Syllabus vectors extraction metrics dashboard.</p>
              </div>

              {isParsing ? (
                <div className="p-8 text-center space-y-4 flex flex-col items-center select-none">
                  <RefreshCw className="h-8 w-8 text-indigo-650 animate-spin" />
                  <span className="font-bold text-slate-800 block text-xs">AI translation core parsing descriptors...</span>
                </div>
              ) : (
                <div className="space-y-4 leading-normal text-xs font-semibold text-slate-500">
                  {!parsingDone ? (
                    <div className="text-center p-6 select-none">
                      <Button onClick={startParsingSimulation}>Start AI Parser Translation</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 border rounded-xl">
                        <span className="text-xl font-display font-black text-slate-800 tracking-tight">150</span>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Courses Found</p>
                      </div>
                      <div className="p-3 bg-slate-50 border rounded-xl">
                        <span className="text-xl font-display font-black text-slate-800 tracking-tight">8</span>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Programs Mapped</p>
                      </div>
                      <div className="p-3 bg-slate-50 border rounded-xl">
                        <span className="text-xl font-display font-black text-slate-800 tracking-tight">14</span>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Departments Found</p>
                      </div>
                      <div className="p-3 bg-slate-50 border rounded-xl">
                        <span className="text-xl font-display font-black text-slate-800 tracking-tight">98.5%</span>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Extraction Confidence</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 justify-end pt-4 select-none">
                <Button variant="outline" onClick={handleBack}>Back</Button>
                <Button disabled={!parsingDone} onClick={handleFinalize}>Activate System</Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </Card>

    </div>
  );
};
export { OnboardingWizard as default };
