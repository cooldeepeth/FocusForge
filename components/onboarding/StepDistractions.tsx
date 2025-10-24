import React, { useState } from 'react';
import type { Profession } from '../../types';
import { Button } from '../shared/Button';

interface StepDistractionsProps {
  onNext: (distractions: string[]) => void;
  onBack: () => void;
  profession: Profession;
}

const studentDistractions = ["Social Media", "Video Games", "Procrastination", "Friends", "Noisy Environment", "Phone Notifications"];
const devDistractions = ["Social Media", "Context Switching", "Unplanned Meetings", "Slack/Email", "Complex Bugs", "Phone Notifications"];

export const StepDistractions: React.FC<StepDistractionsProps> = ({ onNext, onBack, profession }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const distractionOptions = profession === 'Student' ? studentDistractions : devDistractions;

  const toggleSelection = (distraction: string) => {
    setSelected(prev => 
      prev.includes(distraction) 
        ? prev.filter(d => d !== distraction)
        : [...prev, distraction]
    );
  };
  
  const handleSubmit = () => {
    if(selected.length > 0) {
      onNext(selected);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">What pulls you away?</h2>
      <p className="text-center text-gray-400 mb-6">Select your most common distractions.</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {distractionOptions.map(distraction => (
          <button
            key={distraction}
            onClick={() => toggleSelection(distraction)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
              selected.includes(distraction) 
                ? 'bg-brand-primary border-brand-primary text-white' 
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-brand-secondary'
            }`}
          >
            {distraction}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center pt-8 mt-4">
        <Button onClick={onBack} variant="secondary">Back</Button>
        <Button onClick={handleSubmit} disabled={selected.length === 0}>Next</Button>
      </div>
    </div>
  );
};