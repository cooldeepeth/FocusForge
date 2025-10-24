import React, { useState } from 'react';
import type { OnboardingData, Profession, CalendarEvent, AppUsageData } from '../../types';
import { StepProfession } from './StepProfession';
import { StepRoutine } from './StepRoutine';
import { StepDistractions } from './StepDistractions';
import { StepPermissions } from './StepPermissions';

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
}

const TOTAL_STEPS = 4;

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});

  const nextStep = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const updateData = (update: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...update }));
  };

  const handleProfessionSelect = (profession: Profession) => {
    updateData({ profession });
    nextStep();
  };

  const handleRoutineSubmit = (routine: string, goals: string) => {
    updateData({ routine, goals });
    nextStep();
  };
  
  const handleDistractionsSubmit = (distractions: string[]) => {
    updateData({ distractions });
    nextStep();
  };

  const handlePermissionsSubmit = (granted: boolean, events?: CalendarEvent[], appUsage?: AppUsageData) => {
    const finalData = { 
        ...data, 
        permissionsGranted: granted, 
        calendarEvents: events,
        appUsageData: appUsage,
    } as OnboardingData;
    onComplete(finalData);
  }

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
          Welcome to FocusForge
        </h1>
        <p className="text-gray-400 mt-2">Let's craft your personalized focus plan.</p>
      </header>

      <div className="mb-8">
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-900">
            <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-500"></div>
          </div>
        </div>
      </div>

      <div className="min-h-[300px]">
        {step === 1 && <StepProfession onSelect={handleProfessionSelect} />}
        {step === 2 && <StepRoutine onSubmit={handleRoutineSubmit} onBack={prevStep} />}
        {step === 3 && <StepDistractions onNext={handleDistractionsSubmit} onBack={prevStep} profession={data.profession || 'Developer'} />}
        {step === 4 && <StepPermissions onSubmit={handlePermissionsSubmit} onBack={prevStep} profession={data.profession || 'Developer'} />}
      </div>
    </div>
  );
};