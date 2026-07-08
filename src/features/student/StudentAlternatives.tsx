import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../../components/ui/Card';
import { HelpCircle, ChevronRight, Sparkles, AlertTriangle, Calendar, Award } from 'lucide-react';

export const StudentAlternatives: React.FC = () => {
  const { user } = useAuth();
  const { evaluations } = useAppState();

  const studentEvaluations = evaluations.filter(e => 
    e.studentName.toLowerCase().includes(user?.name.toLowerCase() || '')
  );

  // Compile all unmapped/rejected alternatives
  const alternativesList: Array<{
    originalCode: string;
    originalTitle: string;
    suggestedCode: string;
    suggestedTitle: string;
    similarity: number;
    reason: string;
    credits: number;
    desc: string;
    requirementSatisfied: string;
    estimatedCompletion: string;
  }> = [];

  studentEvaluations.forEach(ev => {
    ev.courses.forEach(c => {
      if (c.status === 'rejected') {
        const altSuggestion = c.alternativeSuggestions?.[0] || {
          code: 'CS 120',
          title: 'Introduction to Web Technologies',
          similarity: 78,
          reason: 'Syllabus lacked Java-specific structures but overlaps with general scripting requirements.'
        };

        alternativesList.push({
          originalCode: c.code,
          originalTitle: c.title,
          suggestedCode: altSuggestion.code,
          suggestedTitle: altSuggestion.title,
          similarity: altSuggestion.similarity,
          reason: c.reason || 'Course curriculum did not meet academic rigor guidelines.',
          credits: c.credits || 3,
          desc: 'Recommended course covers basic HTML, CSS, JavaScript DOM manipulations, and node deployment sequences.',
          requirementSatisfied: 'Web Programming Core Elective',
          estimatedCompletion: 'Fall Semester 2026'
        });
      }
    });
  });

  return (
    <div className="space-y-6 font-sans text-xs">
      
      <div className="border-b pb-5 select-none">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Alternative Course Recommendations</h1>
        <p className="text-xs text-slate-400 mt-1">Recover credits by completing approved institutional equivalents.</p>
      </div>

      {alternativesList.length === 0 ? (
        <Card className="p-16 text-center text-slate-400 space-y-4">
          <HelpCircle className="h-10 w-10 mx-auto text-slate-200" />
          <p className="text-sm font-semibold text-slate-655">No alternative recommendations logged</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-normal">
            All transcript records mapped directly to local catalog courses successfully.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold text-slate-600">
          {alternativesList.map((alt, idx) => (
            <Card key={idx} className="p-5 space-y-4 flex flex-col justify-between hover:border-slate-350 transition-colors">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2 select-none">
                  <span className="text-[9px] bg-rose-50 border rounded px-2 py-0.5 text-rose-700 font-bold uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Unmapped Credit Recovery
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border font-bold text-[9px] flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {alt.similarity}% overlap
                  </span>
                </div>

                <div className="flex items-center gap-4 justify-between leading-normal text-slate-800 font-bold">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Transferred Course</span>
                    <span className="text-slate-800 text-xs block mt-0.5">{alt.originalCode}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block">{alt.originalTitle}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 flex-shrink-0" />
                  <div className="text-right">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Suggested Substitute</span>
                    <span className="text-indigo-650 text-xs block mt-0.5">{alt.suggestedCode}</span>
                    <span className="text-[10px] text-slate-450 font-semibold block">{alt.suggestedTitle}</span>
                  </div>
                </div>

                {/* Overlaps details */}
                <div className="p-3 bg-slate-50 border rounded-xl space-y-2">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Decision Override Reason:</span>
                    <p className="text-slate-600 font-medium leading-normal mt-0.5">{alt.reason}</p>
                  </div>
                  <div className="border-t pt-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Equivalent Description:</span>
                    <p className="text-slate-500 font-medium leading-normal mt-0.5">{alt.desc}</p>
                  </div>
                </div>
              </div>

              {/* Requirements mapping footer info */}
              <div className="pt-3 border-t grid grid-cols-2 gap-4 text-[10px] text-slate-450 font-bold select-none">
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block leading-none font-bold">Requirement Met</span>
                    <span className="text-slate-700 font-semibold block mt-0.5">{alt.requirementSatisfied}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <Calendar className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                  <div className="text-right">
                    <span className="text-[8px] text-slate-400 uppercase block leading-none font-bold">Est. Completion</span>
                    <span className="text-slate-700 font-semibold block mt-0.5">{alt.estimatedCompletion}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};
export { StudentAlternatives as default };
