import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  activeStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, activeStep }) => {
  const isVertical = steps.length > 5;

  if (isVertical) {
    return (
      <div className="flex flex-col gap-4 w-full select-none text-[10px] font-bold uppercase tracking-wider text-left pl-4 max-w-md mx-auto">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;

          return (
            <div key={idx} className="flex items-start gap-4 relative">
              {/* Connector Line going down to next item */}
              {idx < steps.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100 -ml-[1px]">
                  <div 
                    className="w-full bg-indigo-500 transition-all duration-300"
                    style={{ height: idx < activeStep ? '100%' : '0%' }}
                  />
                </div>
              )}

              {/* Step bubble */}
              <div 
                className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 flex-shrink-0 relative z-10 ${
                  isCompleted ? 'bg-indigo-650 border-indigo-650 text-white' :
                  isActive ? 'bg-white border-indigo-600 text-indigo-600 shadow-md shadow-indigo-50' :
                  'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
              </div>

              {/* Label */}
              <div className="flex flex-col pt-1.5">
                <span className={`font-display transition-colors ${
                  isActive ? 'text-indigo-600 font-extrabold text-xs' : 'text-slate-500 font-medium'
                }`}>
                  {step}
                </span>
                {isActive && (
                  <span className="text-[9px] text-slate-400 font-semibold lowercase mt-0.5">
                    Processing stage active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full select-none text-[10px] font-bold uppercase tracking-wider">
      {steps.map((step, idx) => {
        const isCompleted = idx < activeStep;
        const isActive = idx === activeStep;

        return (
          <React.Fragment key={idx}>
            {/* Step node */}
            <div className="flex flex-col items-center relative z-10 flex-1">
              <div 
                className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCompleted ? 'bg-indigo-650 border-indigo-650 text-white' :
                  isActive ? 'bg-white border-indigo-600 text-indigo-600 shadow-md shadow-indigo-50' :
                  'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="h-4.5 w-4.5" /> : idx + 1}
              </div>
              <span className={`mt-2 font-display text-center ${
                isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'
              }`}>
                {step}
              </span>
            </div>

            {/* Line connector */}
            {idx < steps.length - 1 && (
              <div className="flex-grow h-0.5 bg-slate-100 mx-2 relative -top-3">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: idx < activeStep ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
