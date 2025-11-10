import React from 'react';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full px-2 sm:px-4">
        <div className="flex items-center">
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                
                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors duration-300 ${isCompleted ? 'bg-brand-teal-500 text-white' : isCurrent ? 'bg-brand-teal-100 text-brand-teal-600 border-2 border-brand-teal-500' : 'bg-brand-wheat-200 text-brand-wheat-500'}`}>
                                {isCompleted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <p className={`mt-2 text-center text-xs sm:text-sm transition-colors duration-300 ${isCurrent || isCompleted ? 'text-brand-wheat-800 font-semibold' : 'text-brand-wheat-500'}`}>{step}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 transition-colors duration-300 mx-2 ${isCompleted ? 'bg-brand-teal-500' : 'bg-brand-wheat-200'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </div>
  );
};

export default ProgressStepper;
