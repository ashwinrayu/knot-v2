import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { simulateWebScrape } from '../../services/aiService';
import { Course } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Terminal, Play, CheckCircle2, ChevronRight, 
  AlertCircle, RefreshCw, FileText, ChevronLeft, ArrowRight, ShieldAlert,
  Calendar, Clock, Check, Eye, Trash2, Layers, Search
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Stepper } from '../../components/ui/Stepper';

export const WebsiteScraper: React.FC = () => {
  const { addCatalogCourse, addScraperLogEntry, triggerSystemNotification } = useAppState();

  const [scrapeUrl, setScrapeUrl] = useState('https://www.knot.edu/catalog/computer-science');
  const [isScraping, setIsScraping] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [extractedCourses, setExtractedCourses] = useState<Partial<Course>[]>([]);
  const [imported, setImported] = useState(false);
  const [isScanningDom, setIsScanningDom] = useState(false);
  const [scrapeStepIndex, setScrapeStepIndex] = useState(0);

  // Scraper connection stages
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

  // Scraper History logs database
  const [scrapeHistory, setScrapeHistory] = useState([
    { url: 'https://www.deanza.edu/catalog/cs', date: '2026-07-04', count: 12, duration: '12.4s', status: 'Success', errors: 'None' },
    { url: 'https://www.foothill.edu/catalog/math', date: '2026-06-28', count: 8, duration: '8.1s', status: 'Success', errors: 'None' }
  ]);

  // Detected pages checkbox
  const detectedPages = [
    { title: 'Computer Science Core Catalog', size: 'CS Core' },
    { title: 'Information Systems Electives', size: 'IS Electives' },
    { title: 'Pre-requisites equivalency logs', size: 'Prereqs' }
  ];

  const startScraping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeUrl.trim()) return;

    setIsScraping(true);
    setIsScanningDom(true);
    setLogs([]);
    setExtractedCourses([]);
    setImported(false);
    setScrapeStepIndex(0);

    try {
      // Simulate Connection Stepper
      for (let i = 0; i < scraperStages.length; i++) {
        setScrapeStepIndex(i);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Stage: ${scraperStages[i]}...`]);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const courses = await simulateWebScrape(scrapeUrl, (logLine) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logLine}`]);
      });

      setExtractedCourses(courses);
      setIsScraping(false);
      setIsScanningDom(false);

      // Add to history
      setScrapeHistory(prev => [
        { url: scrapeUrl, date: new Date().toISOString().split('T')[0], count: courses.length, duration: '4.8s', status: 'Success', errors: 'None' },
        ...prev
      ]);

      addScraperLogEntry({
        id: `scr_${Date.now()}`,
        url: scrapeUrl,
        timestamp: new Date().toISOString(),
        status: 'success',
        coursesExtractedCount: courses.length,
        logs: logs,
        previewCourses: courses
      });

    } catch (err) {
      console.error(err);
      setIsScraping(false);
      setIsScanningDom(false);
    }
  };

  const handleImport = () => {
    if (extractedCourses.length === 0) return;

    extractedCourses.forEach(c => {
      const course: Course = {
        id: `rec_scraped_${c.code?.toLowerCase().replace(/\s+/g, '') || Date.now()}`,
        code: c.code || 'UNK',
        title: c.title || 'Untitled Scraped Course',
        credits: c.credits || 3,
        department: c.department || 'Computer Science',
        description: c.description || '',
        prerequisites: c.prerequisites || []
      };
      addCatalogCourse(course);
    });

    setImported(true);
    triggerSystemNotification(`Scrape import complete. Mapped ${extractedCourses.length} courses.`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-xs">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 select-none">
        <span className="text-[10px] text-indigo-650 font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border">
          Automated Catalog Crawler
        </span>
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight mt-3">Website Scraper</h1>
        <p className="text-xs text-slate-400 mt-1">Extract partner university catalog definitions via automated DOM scraping.</p>
      </div>

      {/* Grid: browser vs. staged */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Target URL, page list checkbox, simulated browser preview */}
        <div className="lg:col-span-6 space-y-6">
          
          <Card className="p-5 space-y-4">
            <form onSubmit={startScraping} className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Website URL Endpoint</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  className="flex-grow px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                />
                <Button type="submit" disabled={isScraping} className="px-4 py-2 text-[10px]">
                  {isScraping ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Start Crawl'}
                </Button>
              </div>
            </form>

            {/* Stepper connections nodes */}
            {isScraping && (
              <div className="pt-2">
                <Stepper steps={scraperStages} activeStep={scrapeStepIndex} />
              </div>
            )}
          </Card>

          {/* Detected Catalog pages checkboxes list */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-950 select-none">Detected Catalog Directories</h3>
            <div className="space-y-2 select-none font-semibold text-slate-600">
              {detectedPages.map((page, idx) => (
                <label key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 border rounded-xl hover:bg-slate-100/50 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-650 focus:ring-indigo-500" />
                    {page.title}
                  </span>
                  <span className="text-[9px] bg-white border px-2 py-0.5 rounded font-bold text-slate-500">{page.size}</span>
                </label>
              ))}
            </div>
          </Card>

        </div>

        {/* Right Column: Console Log and Staging Table */}
        <div className="lg:col-span-6 bg-white border border-slate-200/60 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.015)] p-5 flex flex-col justify-between space-y-4">
          
          {/* Console */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
              <Terminal className="h-4 w-4" />
              Console Logs Output
            </h3>
            <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[9px] leading-relaxed min-h-[140px] max-h-[140px] overflow-y-auto shadow-inner">
              {logs.length === 0 ? (
                <span className="text-slate-500 italic block text-center py-8 select-none">Console Idle. Click Crawl to initialize scanner.</span>
              ) : (
                logs.map((l, i) => (
                  <span key={i} className="block text-emerald-400 last:text-indigo-400">{l}</span>
                ))
              )}
            </div>
          </div>

          {/* Staging table */}
          <div className="flex-grow flex flex-col space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none">Extracted Catalog Staging Buffer</span>
            
            <div className="flex-grow min-h-[160px] max-h-[200px] overflow-y-auto border rounded-xl overflow-hidden bg-slate-50/20 text-xs">
              {extractedCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 h-full select-none">
                  <FileText className="h-8 w-8 text-slate-200 mb-2" />
                  <p className="font-bold text-slate-500">Staging buffer empty</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b text-[9px] text-slate-405 font-bold uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="p-2.5">Code</th>
                      <th className="p-2.5">Title</th>
                      <th className="p-2.5 text-right">Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                    {extractedCourses.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50/30">
                        <td className="p-2.5 font-bold text-indigo-650">{c.code}</td>
                        <td className="p-2.5 text-slate-800">{c.title}</td>
                        <td className="p-2.5 text-right text-slate-850">{c.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Action summaries */}
          <div className="border-t border-slate-100 pt-4 flex justify-between items-center select-none text-[10px]">
            <span className="font-bold text-slate-405">Staged: {extractedCourses.length} course nodes</span>
            
            {imported ? (
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border font-bold uppercase flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Import Complete
              </span>
            ) : (
              <Button disabled={extractedCourses.length === 0} onClick={handleImport}>
                Import to Catalog
              </Button>
            )}
          </div>

        </div>

      </div>

      {/* LOWER GRID: HISTORICAL SCRAPE LOGS */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 select-none">
          <h3 className="text-sm font-bold text-slate-950">Scraper History Logs</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Audit files scraped across partner colleges.</p>
        </div>

        <table className="w-full text-left border-collapse text-xs font-semibold text-slate-655">
          <thead className="bg-slate-100/60 border-b text-[9px] text-slate-400 font-bold uppercase tracking-wider select-none">
            <tr>
              <th className="p-3">Website url</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-center">Courses Imported</th>
              <th className="p-3 text-center">Duration</th>
              <th className="p-3 text-center">Errors</th>
              <th className="p-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scrapeHistory.map((hist, idx) => (
              <tr key={idx} className="hover:bg-slate-50/20">
                <td className="p-3 font-bold text-slate-800 truncate max-w-xs">{hist.url}</td>
                <td className="p-3 text-slate-450">{hist.date}</td>
                <td className="p-3 text-center font-bold text-slate-700">{hist.count} units</td>
                <td className="p-3 text-center text-slate-500">{hist.duration}</td>
                <td className="p-3 text-center"><span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded border font-bold text-[9px] uppercase">{hist.errors}</span></td>
                <td className="p-3 text-right"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border font-bold text-[9px] uppercase">{hist.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

    </div>
  );
};
export { WebsiteScraper as default };
