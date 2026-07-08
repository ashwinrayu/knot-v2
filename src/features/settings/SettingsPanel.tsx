import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Sliders, Building2, Save, Database, Trash2, ShieldAlert, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const SettingsPanel: React.FC = () => {
  const { institution, updateAIConfig, onboardCollege, resetAllData, triggerSystemNotification } = useAppState();

  // General settings
  const [name, setName] = useState(institution.name);
  const [email, setEmail] = useState(institution.email);
  const [website, setWebsite] = useState(institution.website);
  const [address, setAddress] = useState(institution.address);

  // AI settings
  const [minGrade, setMinGrade] = useState(institution.aiConfig.minGrade);
  const [creditDifference, setCreditDifference] = useState(institution.aiConfig.creditDifference);
  const [similarityThreshold, setSimilarityThreshold] = useState(institution.aiConfig.similarityThreshold);
  const [confidenceThreshold, setConfidenceThreshold] = useState(institution.aiConfig.confidenceThreshold);
  const [autoPublishThreshold, setAutoPublishThreshold] = useState(institution.aiConfig.autoPublishThreshold);
  const [reviewThreshold, setReviewThreshold] = useState(institution.aiConfig.reviewThreshold);

  // Rule Tester Simulator State
  const [testCode, setTestCode] = useState('CS 10A');
  const [testCredits, setTestCredits] = useState(4);
  const [testGrade, setTestGrade] = useState('B');
  const [testDesc, setTestDesc] = useState('Introductory scripting, variables, structures, and basic loop configurations in Java.');
  const [testResult, setTestResult] = useState<any>(null);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    onboardCollege({
      name,
      email,
      website,
      address
    });
    triggerSystemNotification('Identity profile saved successfully.', 'success');
  };

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();
    updateAIConfig({
      minGrade,
      creditDifference,
      similarityThreshold,
      confidenceThreshold,
      autoPublishThreshold,
      reviewThreshold
    });
    triggerSystemNotification('Algorithm coefficients updated.', 'success');
  };

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock logic for rule evaluation
    const gradeScores: Record<string, number> = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
    const minGradeValue = gradeScores[minGrade] || 2;
    const testGradeValue = gradeScores[testGrade] || 2;

    let decision = 'Approved';
    let confidence = 85;
    let explanation = 'High semantic match with CS 101 Java Programming catalog specifications.';

    if (testGradeValue < minGradeValue) {
      decision = 'Rejected';
      confidence = 100;
      explanation = `Grade ${testGrade} is lower than passing threshold ${minGrade}.`;
    } else if (testCredits < 3) {
      decision = 'Flagged for Manual Review';
      confidence = 72;
      explanation = `Credits count (${testCredits}) falls below target institutional requirement (3).`;
    }

    setTestResult({
      decision,
      confidence,
      explanation,
      appliedRules: [
        `Min Grade Threshold (>= ${minGrade})`,
        `Max Credit Difference (<= ${creditDifference})`,
        `Similarity Coefficient (>= ${similarityThreshold}%)`
      ]
    });
  };

  const handleResetData = () => {
    if (window.confirm('WARNING: This will reset all course catalog data, CRM leads, and audits to baseline values. Proceed?')) {
      resetAllData();
      triggerSystemNotification('Application data flushed.', 'info');
      setTimeout(() => window.location.reload(), 300);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-xs">
      
      {/* Header */}
      <div className="border-b pb-5 select-none">
        <span className="text-[10px] text-indigo-650 font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border">
          System Core settings
        </span>
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight mt-3">Settings</h1>
        <p className="text-xs text-slate-405 mt-1">Configure campus coordinates and AI matching thresholds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Column: General Institution */}
        <Card className="p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2 select-none">
            <Building2 className="h-4.5 w-4.5 text-slate-400" />
            Institution Identity Profile
          </h3>

          <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs font-semibold text-slate-500">
            <div>
              <label className="block mb-2 uppercase">Institution Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 uppercase">Admissions Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 uppercase">Domain Website</label>
              <input
                type="text"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 uppercase">Campus Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
              />
            </div>
            <Button type="submit" className="w-full">Save Profile</Button>
          </form>
        </Card>

        {/* Right Column: AI Config Settings */}
        <Card className="p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2 select-none">
            <Sliders className="h-4.5 w-4.5 text-slate-400" />
            AI Algorithm Thresholds
          </h3>

          <form onSubmit={handleSaveAI} className="space-y-4 text-xs font-semibold text-slate-500">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 uppercase">Minimum Grade</label>
                <select
                  value={minGrade}
                  onChange={(e) => setMinGrade(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-750 focus:outline-none"
                >
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 uppercase">Max Credit Diff</label>
                <input
                  type="number"
                  step={0.5}
                  value={creditDifference}
                  onChange={(e) => setCreditDifference(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="uppercase">Similarity Threshold</label>
                <span className="font-bold text-indigo-650">{similarityThreshold}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg cursor-pointer accent-indigo-650"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="uppercase">Confidence Threshold</label>
                <span className="font-bold text-indigo-650">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg cursor-pointer accent-indigo-650"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="uppercase">Auto-Publish Threshold</label>
                <span className="font-bold text-indigo-650">{autoPublishThreshold}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={autoPublishThreshold}
                onChange={(e) => setAutoPublishThreshold(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg cursor-pointer accent-indigo-650"
              />
            </div>

            <Button type="submit" className="w-full">Save AI Settings</Button>
          </form>
        </Card>

      </div>



      {/* Database actions */}
      <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2 select-none">
          <Database className="h-4.5 w-4.5 text-rose-500" />
          Maintenance Options
        </h3>
        <p className="text-xs text-slate-500 leading-normal">
          Flushing data deletes all manual overrides, audit actions, CRM logs, and scraper records, returning the system back to mock-seed defaults.
        </p>
        <button
          onClick={handleResetData}
          className="px-4 py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors select-none"
        >
          <Trash2 className="h-4 w-4" />
          Reset Platform Data
        </button>
      </div>

    </div>
  );
};
export { SettingsPanel as default };
