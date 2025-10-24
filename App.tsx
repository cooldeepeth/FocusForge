import React, { useState, useCallback, useEffect, useRef } from 'react';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { Dashboard } from './components/dashboard/Dashboard';
import type { FocusProfile, OnboardingData, CalendarEvent, Task, Feedback, DistractionLog, AppUsageData, AppUsageRecord, CustomFocusMode, User, Squad } from './types';
import { generateFocusProfile, refineFocusProfile, createCustomFocusMode } from './services/geminiService';
import { Loader } from './components/shared/Loader';
import { getLiveUsageUpdate } from './services/appUsageService';
import { AuthScreen } from './components/auth/AuthScreen';
import * as authService from './services/authService';
import * as squadService from './services/squadService';

type FeedbackStatus = 'idle' | 'pending' | 'submitted';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  
  const [focusProfile, setFocusProfile] = useState<FocusProfile | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [appUsageData, setAppUsageData] = useState<AppUsageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New states for enhanced features
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusStreak, setFocusStreak] = useState(0);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState<FeedbackStatus>('idle');
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
  const [distractionLog, setDistractionLog] = useState<DistractionLog[]>([]);
  const [appUsageLog, setAppUsageLog] = useState<AppUsageRecord[]>([]);
  const [customFocusModes, setCustomFocusModes] = useState<CustomFocusMode[]>([]);
  const [squad, setSquad] = useState<Squad | null>(null);
  
  const usageLogInterval = useRef<number | null>(null);
  const squadUpdateInterval = useRef<number | null>(null);
  
  // Effect to listen for auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setIsAuthLoading(false);
      // If user logs out, reset everything
      if (!user) {
        handleSignOut(false); // don't call the auth service again
      }
    });
    return () => unsubscribe();
  }, []);

  // Effect to simulate squad updates
  useEffect(() => {
    if (squad && user) {
        squadUpdateInterval.current = squadService.startBotUpdates(squad.id, (updatedSquad) => {
            setSquad(updatedSquad);
        });
    }
    return () => {
        if (squadUpdateInterval.current) {
            squadService.stopBotUpdates(squadUpdateInterval.current);
        }
    }
  }, [squad, user]);

  // Effect to simulate live app usage logging
  useEffect(() => {
    if (focusProfile && user) {
        usageLogInterval.current = window.setInterval(() => {
            if (document.hasFocus()) { // Only log when tab is active
                const newLogEntry = getLiveUsageUpdate(appUsageLog, focusProfile.profession);
                setAppUsageLog(prev => {
                    const existingEntry = prev.find(e => e.name === newLogEntry.name);
                    if (existingEntry) {
                        return prev.map(e => e.name === newLogEntry.name ? { ...e, minutes: e.minutes + newLogEntry.minutes } : e);
                    }
                    return [...prev, newLogEntry];
                });
            }
        }, 15000); // Log new usage every 15 seconds
    }
    return () => {
        if (usageLogInterval.current) {
            clearInterval(usageLogInterval.current);
        }
    };
  }, [focusProfile, user, appUsageLog]);


  const handleOnboardingComplete = useCallback(async (data: OnboardingData) => {
    setIsLoading(true);
    setError(null);
    try {
      const profile = await generateFocusProfile(data, tasks);
      setFocusProfile(profile);
      if (data.permissionsGranted) {
        if (data.calendarEvents) setCalendarEvents(data.calendarEvents);
        if (data.appUsageData) setAppUsageData(data.appUsageData);
      }
    } catch (err) {
      console.error("Failed to generate focus profile:", err);
      setError("Sorry, we couldn't create your focus profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [tasks]);

  const handleRefineProfile = async () => {
    if (!focusProfile) return;
    setIsRefining(true);
    setError(null);
    try {
        const refinedProfile = await refineFocusProfile(focusProfile, tasks, feedbackHistory, distractionLog, appUsageLog);
        setFocusProfile(refinedProfile);
        // Clear logs after refinement
        setFeedbackHistory([]);
        setDistractionLog([]);
        setAppUsageLog([]);
    } catch (err) {
        console.error("Failed to refine focus profile:", err);
        setError("We couldn't refine your profile right now. Please try again later.");
    } finally {
        setIsRefining(false);
    }
  };

  const handleCreateCustomMode = async (prompt: string) => {
    try {
      const newModeData = await createCustomFocusMode(prompt);
      const newMode: CustomFocusMode = {
        ...newModeData,
        id: Date.now(),
      };
      setCustomFocusModes(prev => [...prev, newMode]);
    } catch (err) {
      console.error("Failed to create custom mode:", err);
      // Here you might want to set an error state specific to the custom mode card
      alert("Sorry, we couldn't create that custom mode. The AI might be busy. Please try again.");
    }
  };

  const handleSignOut = (callService = true) => {
    if(callService) authService.signOut();
    setFocusProfile(null);
    setCalendarEvents([]);
    setAppUsageData(null);
    setError(null);
    setTasks([]);
    setFocusStreak(0);
    setIsFocusModeActive(false);
    setSessionFeedback('idle');
    setFeedbackHistory([]);
    setDistractionLog([]);
    setAppUsageLog([]);
    setCustomFocusModes([]);
    setSquad(null);
    if (usageLogInterval.current) clearInterval(usageLogInterval.current);
    if (squadUpdateInterval.current) squadService.stopBotUpdates(squadUpdateInterval.current);
  };
  
  const handleSessionComplete = () => {
    setFocusStreak(prev => prev + 1);
    setIsFocusModeActive(false);
    setSessionFeedback('pending');
    if (user && squad) {
        const updatedSquad = squadService.updateProgress(squad.id, user.uid);
        setSquad(updatedSquad);
    }
  };

  const handleFocusModeChange = (isActive: boolean) => {
      setIsFocusModeActive(isActive);
      if (isActive) {
        setSessionFeedback('idle'); // Hide feedback prompt if a new session starts
      }
  };
  
  const handleStreakBreak = () => {
      if (focusStreak > 0) {
        logDistraction('Focus streak was broken.');
        setFocusStreak(0);
      }
  };

  const handleSessionFeedback = (wasProductive: boolean) => {
      setFeedbackHistory(prev => [...prev, { timestamp: Date.now(), wasProductive }]);
      setSessionFeedback('submitted');
      setTimeout(() => setSessionFeedback('idle'), 2000);
  }
  
  const logDistraction = (reason: string) => {
      setDistractionLog(prev => [...prev, { timestamp: Date.now(), reason }]);
  };

  const handleAddTask = (text: string) => {
    setTasks(prev => [...prev, { id: Date.now(), text, completed: false }]);
  };
  
  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleJoinSquad = () => {
    if (!user) return;
    const newSquad = squadService.joinSquad(user);
    setSquad(newSquad);
  };

  const handleSetDailyGoal = (goal: string) => {
    if (!user || !squad) return;
    const updatedSquad = squadService.setDailyGoal(squad.id, user.uid, goal);
    setSquad(updatedSquad);
  };

  const renderContent = () => {
    if (isAuthLoading || isLoading || isRefining) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen">
          <Loader />
          <p className="text-brand-light mt-4 text-lg">
            {isAuthLoading ? "Checking session..." : isRefining ? "Refining your plan with new insights..." : "Forging your personalized focus plan..."}
          </p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen text-center">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
                onClick={() => { setError(null); if (!focusProfile) handleSignOut(); }}
                className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors"
            >
                {focusProfile ? 'Acknowledge' : 'Start Over'}
            </button>
        </div>
      );
    }

    if (!user) {
        return <AuthScreen />;
    }

    if (focusProfile) {
      const hasNewDataForRefinement = feedbackHistory.length > 0 || distractionLog.length > 0 || appUsageLog.length > 0;
      return (
        <Dashboard
            user={user}
            profile={focusProfile}
            events={calendarEvents}
            tasks={tasks}
            onSignOut={handleSignOut}
            onRefineProfile={handleRefineProfile}
            hasNewDataForRefinement={hasNewDataForRefinement}
            focusStreak={focusStreak}
            isFocusModeActive={isFocusModeActive}
            sessionFeedback={sessionFeedback}
            onSessionComplete={handleSessionComplete}
            onFocusModeChange={handleFocusModeChange}
            onSessionFeedback={handleSessionFeedback}
            onLogDistraction={logDistraction}
            onStreakBreak={handleStreakBreak}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            appUsageLog={appUsageLog}
            initialAppUsageData={appUsageData}
            customFocusModes={customFocusModes}
            onCreateCustomMode={handleCreateCustomMode}
            squad={squad}
            onJoinSquad={handleJoinSquad}
            onSetGoal={handleSetDailyGoal}
        />
    );
    }

    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans text-gray-200">
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;