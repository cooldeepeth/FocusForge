
import React, { useState } from 'react';
import { Button } from '../shared/Button';

interface StepRoutineProps {
  onSubmit: (routine: string, goals: string) => void;
  onBack: () => void;
}

export const StepRoutine: React.FC<StepRoutineProps> = ({ onSubmit, onBack }) => {
  const [routine, setRoutine] = useState('');
  const [goals, setGoals] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (routine.trim() && goals.trim()) {
      onSubmit(routine, goals);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Day & Your Goals</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="routine" className="block text-sm font-medium text-gray-300 mb-2">
            Briefly describe your typical daily routine.
          </label>
          <textarea
            id="routine"
            rows={4}
            value={routine}
            onChange={(e) => setRoutine(e.target.value)}
            className="w-full bg-gray-800 border-gray-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5"
            placeholder="e.g., 'I wake up at 8, check emails, work on my project until lunch, then attend classes/meetings in the afternoon...'"
          />
        </div>
        <div>
          <label htmlFor="goals" className="block text-sm font-medium text-gray-300 mb-2">
            What's your main goal for improving focus?
          </label>
          <input
            id="goals"
            type="text"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="w-full bg-gray-800 border-gray-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5"
            placeholder="e.g., 'Finish my thesis without last-minute panic', 'Ship this feature on time'"
          />
        </div>
        <div className="flex justify-between items-center pt-4">
          <Button onClick={onBack} variant="secondary">Back</Button>
          <Button type="submit" disabled={!routine.trim() || !goals.trim()}>Next</Button>
        </div>
      </form>
    </div>
  );
};
