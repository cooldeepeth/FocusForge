import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
// Fix: Import CustomFocusMode and remove PomodoroConfig as it's not directly used.
import type { FocusProfile, CustomFocusMode } from '../../types';

interface PomodoroTimerProps {
    profile: FocusProfile;
    onSessionComplete: () => void;
    onFocusModeChange: (isActive: boolean) => void;
    onDistraction: (reason: string) => void;
    onStreakBreak: () => void;
    // Fix: The custom configuration should be the entire CustomFocusMode object to access its name and pomodoro settings.
    customConfig?: CustomFocusMode | null;
}

const BASE_FOCUS_TIME = 25 * 60; // 25 minutes
const PEAK_FOCUS_TIME = 35 * 60; // 35 minutes
const BASE_BREAK_TIME = 5 * 60; // 5 minutes

// Helper to check if current time is within peak hours
const isPeakTime = (peakHours: string): boolean => {
    try {
        const now = new Date();
        const currentHour = now.getHours();

        const [start, end] = peakHours.split(' - ');
        
        const parseTime = (timeStr: string) => {
            const [time, modifier] = timeStr.split(' ');
            let [hours] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            return hours;
        };

        const startHour = parseTime(start);
        const endHour = parseTime(end);

        if (startHour <= endHour) {
            return currentHour >= startHour && currentHour < endHour;
        } else { // Handles overnight ranges
            return currentHour >= startHour || currentHour < endHour;
        }
    } catch (e) {
        console.error("Failed to parse peak hours:", e);
        return false;
    }
};


export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ profile, onSessionComplete, onFocusModeChange, onDistraction, onStreakBreak, customConfig }) => {
  // Fix: Derive FOCUS_TIME and BREAK_TIME from the nested pomodoro object within customConfig.
  const FOCUS_TIME = customConfig ? customConfig.pomodoro.focus * 60 : (isPeakTime(profile.peakFocusHours) ? PEAK_FOCUS_TIME : BASE_FOCUS_TIME);
  const BREAK_TIME = customConfig ? customConfig.pomodoro.break * 60 : BASE_BREAK_TIME;

  const [time, setTime] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<number | null>(null);
  
  // Effect to update timer duration when config changes
  useEffect(() => {
    if (!isActive) {
      setTime(isBreak ? BREAK_TIME : FOCUS_TIME);
    }
  }, [FOCUS_TIME, BREAK_TIME, isBreak, isActive]);

  const toggleTimer = () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);
    onFocusModeChange(newIsActive && !isBreak);
  };

  const resetTimer = useCallback(() => {
    if (isActive && !isBreak) {
        onDistraction('Timer was reset during a focus session.');
        onStreakBreak();
    }
    setIsActive(false);
    onFocusModeChange(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const newTime = isBreak ? BREAK_TIME : FOCUS_TIME;
    setTime(newTime);
  }, [isActive, isBreak, FOCUS_TIME, BREAK_TIME, onFocusModeChange, onDistraction, onStreakBreak]);

  const switchMode = useCallback((completed: boolean = false) => {
    if (!isBreak) {
        if(completed) {
            onSessionComplete();
        } else if (isActive) {
            onDistraction('Switched modes during a focus session.');
            onStreakBreak();
        }
    }
    const newIsBreak = !isBreak;
    setIsBreak(newIsBreak);
    setTime(newIsBreak ? BREAK_TIME : FOCUS_TIME);
    setIsActive(false);
    onFocusModeChange(false);
  }, [isActive, isBreak, FOCUS_TIME, BREAK_TIME, onFocusModeChange, onSessionComplete, onDistraction, onStreakBreak]);
  
  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            switchMode(true); // Mark session as completed
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isBreak, switchMode]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = isBreak ? BREAK_TIME : FOCUS_TIME;
  const progress = ((totalTime - time) / totalTime) * 100;
  
  const timerTitle = customConfig ? `Timer (${customConfig.name})` : `Pomodoro Timer ${isPeakTime(profile.peakFocusHours) ? '(Peak Mode)' : ''}`;

  return (
    <Card title={timerTitle} icon="timer">
      <div className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle className="text-gray-700" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
            <circle
              className={isBreak ? "text-brand-accent" : "text-brand-primary"}
              strokeWidth="7"
              strokeDasharray="283"
              strokeDashoffset={283 - (progress / 100) * 283}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold text-white">{formatTime(time)}</p>
            <p className="text-sm text-gray-400 uppercase tracking-wider">{isBreak ? 'Break' : 'Focus'}</p>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4">
          <Button onClick={toggleTimer} size="lg">
            {isActive ? <Icon name="pause" className="w-6 h-6" /> : <Icon name="play" className="w-6 h-6" />}
          </Button>
          <Button onClick={resetTimer} variant="secondary" size="lg">
            <Icon name="reset" className="w-6 h-6" />
          </Button>
        </div>
         <button onClick={() => switchMode(false)} className="mt-4 text-gray-400 hover:text-white transition-colors text-sm">
            Switch to {isBreak ? 'Focus' : 'Break'}
        </button>
      </div>
    </Card>
  );
};