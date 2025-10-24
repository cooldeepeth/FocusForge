
import React from 'react';
import type { Profession } from '../../types';
import { Icon } from '../shared/Icon';

interface StepProfessionProps {
  onSelect: (profession: Profession) => void;
}

export const StepProfession: React.FC<StepProfessionProps> = ({ onSelect }) => {
  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">What's your role?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => onSelect('Student')} 
          className="group p-8 bg-gray-800 rounded-xl border-2 border-transparent hover:border-brand-primary hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          <Icon name="student" className="h-16 w-16 mx-auto text-gray-400 group-hover:text-brand-primary transition-colors" />
          <span className="mt-4 block text-xl font-semibold text-white">Student</span>
        </button>
        <button 
          onClick={() => onSelect('Developer')} 
          className="group p-8 bg-gray-800 rounded-xl border-2 border-transparent hover:border-brand-secondary hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          <Icon name="developer" className="h-16 w-16 mx-auto text-gray-400 group-hover:text-brand-secondary transition-colors" />
          <span className="mt-4 block text-xl font-semibold text-white">Developer</span>
        </button>
      </div>
    </div>
  );
};
