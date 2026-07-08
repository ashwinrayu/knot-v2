import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Sparkles, ArrowRight, Award, Clock,
  ChevronDown, CheckCircle2, Mail, Phone, MapPin,
  ShieldCheck, UploadCloud, Cpu, Layers, Search,
  FileText, X, Loader2
} from 'lucide-react';

// ==========================================
// FAQ DATA
// ==========================================
const FAQS = [
  {
    q: 'How long does evaluation take?',
    a: "Knot's AI model parses and semantic-matches transcripts in under 60 seconds. Final verification and merging by admissions staff typically completes within 2 hours."
  },
  {
    q: 'Which files are supported?',
    a: 'We support PDF, PNG, JPG, JPEG, and DOCX formats of unofficial and official college transcripts.'
  },
  {
    q: 'How accurate is the AI matching engine?',
    a: 'Our AI Magic Scan achieves over 99.4% text extraction accuracy, and our AI Magic Mapping scores equivalents. Any match falling below custom parameters is routed for human admissions staff audits.'
  },
  {
    q: 'Can I upload another transcript?',
    a: 'Yes, students can upload multiple transcripts in their portal (e.g. from different community colleges) to map their entire transfer portfolio.'
  },
  {
    q: 'Can I appeal an evaluation?',
    a: 'Yes! If a course equivalence is unmapped or rejected, you can request an admissions review in the portal or chat directly with an advisor in the Messages channel.'
  }
];

// ==========================================
// INLINE HERO UPLOAD WIDGET
// ==========================================
const HeroUploadWidget: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const steps = ['Uploading', 'AI Magic Scan', 'Extracting Courses', 'AI Magic Mapping', 'Building Report'];

  const handleFile = (f: File) => setFile(f);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleRun = async () => {
    if (!file) return;
    setProcessing(true);
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 700));
    }
    setProcessing(false);
    setDone(true);
    const targetPath = isAuthenticated ? '/student/upload' : '/upload';
    setTimeout(() => navigate(targetPath, { state: { file } }), 600);
  };

  if (done) return (
    <Card className="p-8 flex flex-col items-center gap-4 text-center shadow-xl border-emerald-200">
      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
      <p className="text-sm font-bold text-slate-800">Analysis complete! Opening full report…</p>
    </Card>
  );

  return (
    <Card className="relative z-10 p-6 space-y-4 shadow-xl border-slate-200/60">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <span className="text-[9px] bg-indigo-50 border rounded px-2 py-0.5 text-indigo-700 font-bold uppercase tracking-wider">
          Upload Your Transcript
        </span>
        <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
      </div>

      {/* Drop zone */}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
            dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          }`}
        >
          <UploadCloud className="h-8 w-8 text-indigo-400" />
          <p className="text-xs font-bold text-slate-700">Drop transcript here or click to browse</p>
          <p className="text-[10px] text-slate-400 font-semibold">PDF · PNG · JPG · DOCX supported</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.docx"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 text-indigo-600 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-800 truncate">{file.name}</span>
          </div>
          <button onClick={() => setFile(null)} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Processing steps */}
      {processing && (
        <div className="space-y-1.5 px-1">
          {steps.map((s, i) => (
            <div key={s} className={`flex items-center gap-2 text-[10px] font-semibold transition-all ${
              i < step ? 'text-emerald-600' : i === step ? 'text-indigo-600' : 'text-slate-300'
            }`}>
              {i < step ? (
                <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
              ) : i === step ? (
                <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
              ) : (
                <span className="h-3 w-3 rounded-full border border-slate-200 inline-block flex-shrink-0" />
              )}
              {s}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <Button
        onClick={handleRun}
        disabled={!file || processing}
        className="w-full py-2.5 text-xs"
        rightIcon={processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      >
        {processing ? 'Analyzing…' : 'Analyze My Transcript'}
      </Button>

      <p className="text-[10px] text-slate-400 text-center font-semibold">
        No account required · Free · Results in &lt;60s
      </p>
    </Card>
  );
};

// ==========================================
// 1. LANDING PAGE
// ==========================================
export const HomeLanding: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }, 2000);
  };

  const featureCards = [
    { title: 'AI Powered Evaluation', desc: 'Syllabus semantic parsing matches course criteria automatically.', icon: <Cpu className="h-5 w-5 text-indigo-600" /> },
    { title: 'Instant Transcript Analysis', desc: 'High-speed AI Magic Scan reads scanned text modules in 60 seconds.', icon: <Clock className="h-5 w-5 text-indigo-600" /> },
    { title: 'Secure Student Portal', desc: 'Guarded login channels protecting FERPA and academic records.', icon: <ShieldCheck className="h-5 w-5 text-indigo-600" /> },
    { title: 'Alternative Recommendations', desc: 'Smart recommendations to recover credits for unmapped course blocks.', icon: <Sparkles className="h-5 w-5 text-indigo-600" /> },
    { title: 'Transparent Decisions', desc: 'Clear match similarity indices and advisor overrides rationale logs.', icon: <Layers className="h-5 w-5 text-indigo-600" /> },
    { title: 'Fast Admissions Process', desc: 'Direct lead conversions connect you with advisors immediately.', icon: <ArrowRight className="h-5 w-5 text-indigo-600" /> }
  ];

  const timelineSteps = [
    { step: '1', title: 'Upload Transcript', desc: 'Drop unofficial academic PDF directly — no account needed.' },
    { step: '2', title: 'AI Magic Scan', desc: 'AI Magic scans and reads all course listings from your document.' },
    { step: '3', title: 'AI Processing', desc: 'System parses text and semantic matches catalogs.' },
    { step: '4', title: 'Review Results', desc: 'View similarity reports and recovery alternatives.' },
    { step: '5', title: 'Download Report', desc: 'Print out verified credit mapping summaries.' },
    { step: '6', title: 'Apply for Admission', desc: 'Submit and connect directly with registrar desks.' }
  ];

  return (
    <div className="space-y-28 pb-20 font-sans">

      {/* ── HERO ── */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 select-none">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            AI-Driven College Transcripts Mapper
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 leading-tight tracking-tight">
            Know Your Transfer Credits <span className="text-indigo-600">Before You Apply</span>.
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed font-semibold">
            Evaluate your previous college course credits instantly. Knot's AI semantic catalog parser reads unofficial transcripts, checks compliance thresholds, and estimates transferable credits in under a minute.
          </p>
          <div className="space-y-3 pt-2 select-none">
            <p className="text-xs text-slate-400 font-semibold">
              ↗ Drop your transcript on the right — no registration needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/upload">
                <Button className="px-6 py-3 w-full sm:w-auto text-xs" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Evaluate My Transcript
                </Button>
              </Link>
              <Link to="/transfer-credits">
                <Button variant="outline" className="px-6 py-3 w-full sm:w-auto text-xs">
                  Explore Programs
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: live upload widget */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-indigo-50 rounded-3xl -rotate-2 blur-sm" />
          <HeroUploadWidget />
        </div>
      </section>

      {/* ── WHY KNOT ── */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border">Core Benefits</span>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Why Knot?</h2>
          <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">We provide the leading neural credit translation layer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => (
            <Card key={idx} className="p-6 space-y-4 hover:border-slate-300 transition-colors">
              <div className="h-10 w-10 bg-slate-50 border rounded-xl flex items-center justify-center shadow-sm">{feat.icon}</div>
              <h3 className="text-sm font-bold text-slate-950">{feat.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-slate-900 text-white py-24 px-6 md:px-12 select-none">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-400/30">
              Interactive timeline
            </span>
            <h2 className="text-3xl font-display font-black text-white tracking-tight">How It Works</h2>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto mt-1">Six streamlined steps to verify and admit transfer credits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-800 p-5 rounded-2xl space-y-3.5 text-center flex flex-col justify-between">
                <div className="h-8 w-8 bg-indigo-500/10 border border-indigo-400/30 rounded-full flex items-center justify-center text-indigo-300 text-xs font-black mx-auto">
                  {step.step}
                </div>
                <h4 className="text-xs font-bold text-white leading-tight">{step.title}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Reduce Admission Uncertainty</h2>
          <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto">Instant value mappings for prospective transfer inquiries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold text-slate-500">
          {[
            { title: 'Know your credits before applying', desc: 'Eliminates application fees uncertainty by providing credit estimations immediately.' },
            { title: 'Receive AI explanations', desc: 'Read exact matching weights and justifications matching each course equivalent.' },
            { title: 'Alternative pathway recommendations', desc: 'AI suggests recovery equivalents to verify deficit credits.' },
            { title: 'Download official report', desc: 'Print validated catalog mapping summaries for transcript planning.' }
          ].map((item, idx) => (
            <Card key={idx} className="p-5 flex gap-4 hover:border-slate-300 transition-colors">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 h-9 w-9 flex items-center justify-center border flex-shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">{item.title}</h4>
                <p className="leading-relaxed">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 space-y-8 select-none">
        <h2 className="text-2xl font-display font-black text-center text-slate-900 tracking-tight">Frequently Asked Questions</h2>

        <div className="divide-y divide-slate-100 border border-slate-200/60 rounded-2xl overflow-hidden bg-white shadow-sm text-xs font-semibold text-slate-600">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="transition-all">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center hover:bg-slate-50 font-bold text-slate-800 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-5 bg-slate-50/50 border-t border-slate-100 leading-relaxed font-medium text-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        <div className="space-y-6 text-xs font-semibold text-slate-500 leading-relaxed">
          <div>
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Get in touch</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Our registrar desks are here to assist with manual audits.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-indigo-600" />
              <span>(617) 555-0199</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-indigo-600" />
              <span>transfer@knot.edu</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <span>100 University Ave, Boston, MA 02115</span>
            </div>
          </div>

          <div className="h-40 rounded-xl bg-slate-100 border relative overflow-hidden flex items-center justify-center text-slate-400 italic text-xs">
            [University Campus map]
          </div>
        </div>

        <Card className="p-6">
          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Message dispatched. Our registrar team will reach out.
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
              <div>
                <label className="block mb-2 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block mb-2 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block mb-2 uppercase">Your Inquiry Message</label>
                <textarea
                  rows={3}
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Specify syllabus overrides or course matching guidelines..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-400 resize-none font-semibold text-slate-700"
                />
              </div>
              <Button type="submit" className="w-full py-2.5">
                Send Inquiry
              </Button>
            </form>
          )}
        </Card>
      </section>

    </div>
  );
};

// ==========================================
// 2. ABOUT PAGE
// ==========================================
export const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-6 py-20 space-y-10 text-xs font-semibold text-slate-600">
    <div className="border-b pb-5">
      <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">About Knot</h1>
      <p className="text-sm text-slate-500 mt-1 font-semibold">Aligning transfer trajectories via machine learning catalog translation.</p>
    </div>

    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4 leading-relaxed font-medium">
        <h3 className="text-sm font-bold text-slate-900 uppercase">Our Core Objective</h3>
        <p>
          Admissions offices waste weeks parsing transcripts by hand. Knot digitizes the catalog matching pipeline, extracting codes, verifying grade qualifiers, and calculating semantic overlap intervals instantly.
        </p>
        <p>
          By allowing students to check their credit values beforehand, we increase college admissions conversion rates and minimize manual evaluation backlogs.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Platform Milestones</h3>
        <div className="space-y-3 font-semibold text-slate-600">
          <div className="flex justify-between border-b pb-2"><span>Transcripts evaluated</span> <strong className="text-slate-800">4,200+</strong></div>
          <div className="flex justify-between border-b pb-2"><span>Admissions delay time</span> <strong className="text-slate-800">&lt; 2 Hours</strong></div>
          <div className="flex justify-between"><span>AI Scan precision</span> <strong className="text-indigo-600">99.4%</strong></div>
        </div>
      </Card>
    </div>
  </div>
);

// ==========================================
// 3. TRANSFER DIRECTORY PAGE
// ==========================================
export const TransferCreditsPage: React.FC = () => {
  const mockMappings = [
    { from: 'CS 10A (De Anza)', to: 'CS 101 Java Programming', dept: 'Computer Science', status: 'approved', confidence: 98 },
    { from: 'CS 10B (De Anza)', to: 'CS 102 Data Structures', dept: 'Computer Science', status: 'approved', confidence: 96 },
    { from: 'MATH 1A (De Anza)', to: 'MATH 120 Calculus I', dept: 'Mathematics', status: 'approved', confidence: 92 },
    { from: 'BUS 10 (De Anza)', to: 'BUS 110 Business Principles', dept: 'Business', status: 'approved', confidence: 89 },
    { from: 'ENGL 1A (De Anza)', to: 'ENG 101 Academic Writing', dept: 'Humanities', status: 'approved', confidence: 85 }
  ];

  const [query, setQuery] = useState('');

  const filtered = mockMappings.filter(m =>
    m.from.toLowerCase().includes(query.toLowerCase()) ||
    m.to.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-8">
      <div className="border-b pb-5">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Transfer Credit Mapping Matrix</h1>
        <p className="text-xs text-slate-500 mt-1">Review pre-approved equivalents mapped across our program catalogs.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter equivalency mappings..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white font-semibold text-slate-700"
        />
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-xs font-semibold text-slate-600">
          <thead className="bg-slate-50 border-b text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3.5">From Partner School</th>
              <th className="p-3.5">To Local Equivalent</th>
              <th className="p-3.5">Department</th>
              <th className="p-3.5 text-center">Confidence</th>
              <th className="p-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="p-3.5 font-bold text-slate-800">{item.from}</td>
                <td className="p-3.5 text-indigo-600 font-bold">{item.to}</td>
                <td className="p-3.5 text-slate-500">{item.dept}</td>
                <td className="p-3.5 text-center"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border font-bold">{item.confidence}%</span></td>
                <td className="p-3.5 text-right"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ==========================================
// 4. STANDALONE FAQ PAGE
// ==========================================
export const FAQPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const detailedFaqs = [
    {
      q: 'How long does evaluation take?',
      a: "Knot's AI model parses and semantic-matches transcripts in under 60 seconds. Final verification and merging by admissions staff typically completes within 2 hours."
    },
    {
      q: 'Which files are supported?',
      a: 'We support PDF, PNG, JPG, JPEG, and DOCX formats of unofficial and official college transcripts.'
    },
    {
      q: 'How accurate is the AI matching engine?',
      a: 'Our AI Magic Scan achieves over 99.4% text extraction accuracy, and our AI Magic Mapping scores equivalents. Any match falling below custom parameters is routed for human admissions staff audits.'
    },
    {
      q: 'Can I upload another transcript?',
      a: 'Yes, students can upload multiple transcripts in their portal (e.g. from different community colleges) to map their entire transfer portfolio.'
    },
    {
      q: 'Can I appeal an evaluation?',
      a: 'Yes! If a course equivalence is unmapped or rejected, you can request an admissions review in the portal or chat directly with an advisor in the Messages channel.'
    },
    {
      q: 'Is my student record data safe (FERPA)?',
      a: 'Absolutely. Knot strictly enforces FERPA guidelines. Transcripts are parsed in a secure sandbox, and student PII is encrypted at rest and in transit. Student data is never used to train public models.'
    },
    {
      q: 'What counts as a passing grade threshold?',
      a: 'Our institutional standard requires a minimum grade of "C" (or equivalent score) to approve credit transfers. Any credit falling below this threshold is flagged and automatically rejected.'
    },
    {
      q: 'Who reviews the credit mappings?',
      a: 'Admissions officers and registrars review every AI matching outcome in the Review Center. They have the ultimate authority to approve, reject, or override any system recommendation.'
    }
  ];

  const filteredFaqs = detailedFaqs.filter(
    f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-10">
      <div className="border-b pb-5">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">Have questions about mapping credit rules or semantic matching limits? Read details below.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions or keyword topics..."
          className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white font-semibold text-slate-700"
        />
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200/60 rounded-2xl overflow-hidden bg-white shadow-sm text-xs font-semibold text-slate-600">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="transition-all">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center hover:bg-slate-50 font-bold text-slate-800 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-5 bg-slate-50/50 border-t border-slate-100 leading-relaxed font-medium text-slate-655">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center text-slate-400 font-medium">
            No matching questions found for "{searchQuery}"
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="text-sm font-bold">Still have queries or catalog disputes?</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Reach out to our academic registrar offices directly for manual overrides support.</p>
        </div>
        <Link to="/contact">
          <Button variant="secondary" className="text-xs bg-white text-slate-900 hover:bg-slate-100 border border-slate-200">
            Contact Registrar Desk
          </Button>
        </Link>
      </div>
    </div>
  );
};

// ==========================================
// 5. STANDALONE CONTACT PAGE
// ==========================================
export const ContactPage: React.FC = () => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-12">
      <div className="border-b pb-5">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Contact Registrar Office</h1>
        <p className="text-sm text-slate-500 mt-1 font-semibold">Have catalog overrides questions? Our registrar teams are here to assist with manual audits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Info & Map Column */}
        <div className="space-y-6 text-xs font-semibold text-slate-500 leading-relaxed">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 border flex items-center justify-center text-indigo-650 flex-shrink-0">
                <Phone className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block font-bold text-slate-800">Phone Support</span>
                <span className="text-slate-500">(617) 555-0199</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 border flex items-center justify-center text-indigo-655 flex-shrink-0">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block font-bold text-slate-800">Email Inquiries</span>
                <span className="text-slate-500">transfer@knot.edu</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 border flex items-center justify-center text-indigo-650 flex-shrink-0">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block font-bold text-slate-800">Campus Address</span>
                <span className="text-slate-500">100 University Ave, Boston, MA 02115</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
            <span className="block font-bold text-slate-800 uppercase tracking-wider text-[9px]">Registrar Office Hours</span>
            <div className="flex justify-between border-b pb-1.5 mt-2">
              <span>Monday — Friday</span>
              <span className="text-slate-800 font-bold">8:30 AM — 5:00 PM EST</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday — Sunday</span>
              <span className="text-slate-400 font-semibold italic">Closed</span>
            </div>
          </div>

          {/* CAMPUS MAP PREVIEW */}
          <div className="h-44 rounded-xl bg-slate-100 border relative overflow-hidden flex items-center justify-center text-slate-400 italic">
            [University Campus map coordinate overlays]
          </div>
        </div>

        {/* Admissions Form */}
        <Card className="p-8 shadow-sm">
          {submitted ? (
            <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Message dispatched. Our registrar team will reach out.
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-5 text-xs font-semibold text-slate-600">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Submit an Inquiry</h3>
              <div>
                <label className="block mb-2 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block mb-2 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block mb-2 uppercase">Your Inquiry Message</label>
                <textarea
                  rows={4}
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Specify syllabus overrides, credit conversion guidelines, or transfer matrix disputes..."
                  className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-400 resize-none font-semibold text-slate-700"
                />
              </div>

              <Button type="submit" className="w-full py-3">
                Send Inquiry
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

