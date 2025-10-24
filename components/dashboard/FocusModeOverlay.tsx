import React, { useState, useEffect } from 'react';
import { Icon } from '../shared/Icon';
import type { CustomFocusMode } from '../../types';

interface FocusModeOverlayProps {
  isActive: boolean;
  activeCustomMode?: CustomFocusMode | null;
}

const nudges = [
    "You're doing great. Keep it up!",
    "Deep breaths. Stay in the zone.",
    "One task at a time.",
    "Eliminate distractions. You've got this.",
    "Every focused minute counts.",
];

export const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({ isActive, activeCustomMode }) => {
  const [nudge, setNudge] = useState('');
  
  useEffect(() => {
    let nudgeInterval: number | undefined;
    if (isActive) {
      // Show a nudge every 45 seconds
      nudgeInterval = window.setInterval(() => {
        setNudge(nudges[Math.floor(Math.random() * nudges.length)]);
        // Fade out the nudge after 5 seconds
        setTimeout(() => setNudge(''), 5000);
      }, 45000);
    }
    return () => clearInterval(nudgeInterval);
  }, [isActive]);
  
  if (!isActive) return null;
  
  const modeName = activeCustomMode ? activeCustomMode.name : "Focus Mode";
  const blockedSites = activeCustomMode ? activeCustomMode.blockedSites.join(', ') : "Distractions";


  return (
    <>
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-40 animate-fade-in"></div>
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-brand-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center animate-fade-in-down text-center">
            <Icon name="shield" className="w-6 h-6 mr-3 flex-shrink-0" />
            <span className="font-semibold">{modeName} Active: {blockedSites} are blocked.</span>
        </div>
        {nudge && (
             <div className="fixed bottom-5 right-5 z-50 bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up">
                <p>{nudge}</p>
            </div>
        )}
    </>
  );
};
