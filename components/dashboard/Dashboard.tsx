import React, { useState } from 'react';
import type { FocusProfile, CalendarEvent, Task, AppUsageData, AppUsageRecord, CustomFocusMode, User, Squad } from '../../types';
import { FocusProfileCard } from './FocusProfileCard';
import { PomodoroTimer } from './PomodoroTimer';
import { DailySchedule } from './DailySchedule';
import { WeeklyReport } from './WeeklyReport';
import { ProfessionModeCard } from './ProfessionModeCard';
import { CalendarEventsCard } from './CalendarEventsCard';
import { FocusStreakCard } from './FocusStreakCard';
import { PrivacyCard } from './PrivacyCard';
import { FocusModeOverlay } from './FocusModeOverlay';
import { SessionFeedback } from './SessionFeedback';
import { TaskCard } from './TaskCard';
import { FocusSquadCard } from './FocusSquadCard';
import { AppUsageCard } from './AppUsageCard';
import { CustomModeCard } from './CustomModeCard';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';

type FeedbackStatus = 'idle' | 'pending' | 'submitted';
interface DashboardProps {
  user: User;
  profile: FocusProfile;
  events: CalendarEvent[];
  tasks: Task[];
  onSignOut: () => void;
  onRefineProfile: () => void;
  hasNewDataForRefinement: boolean;
  focusStreak: number;
  isFocusModeActive: boolean;
  sessionFeedback: FeedbackStatus;
  onSessionComplete: () => void;
  onFocusModeChange: (isActive: boolean) => void;
  onSessionFeedback: (wasProductive: boolean) => void;
  onLogDistraction: (reason: string) => void;
  onStreakBreak: () => void;
  onAddTask: (text: string) => void;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  appUsageLog: AppUsageRecord[];
  initialAppUsageData: AppUsageData | null;
  customFocusModes: CustomFocusMode[];
  onCreateCustomMode: (prompt: string) => Promise<void>;
  squad: Squad | null;
  onJoinSquad: () => void;
  onSetGoal: (goal: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = (props) => {
  const {
    user,
    profile,
    events,
    tasks,
    onSignOut,
    onRefineProfile,
    hasNewDataForRefinement,
    focusStreak,
    isFocusModeActive,
    sessionFeedback,
    onSessionComplete,
    onFocusModeChange,
    onSessionFeedback,
    onLogDistraction,
    onStreakBreak,
    onAddTask,
    onToggleTask,
    onDeleteTask,
    appUsageLog,
    initialAppUsageData,
    customFocusModes,
    onCreateCustomMode,
    squad,
    onJoinSquad,
    onSetGoal,
  } = props;
  
  const [activeCustomMode, setActiveCustomMode] = useState<CustomFocusMode | null>(null);

  const welcomeName = user.displayName || user.email;

  return (
    <div className="space-y-8 animate-fade-in relative">
        <FocusModeOverlay isActive={isFocusModeActive} activeCustomMode={activeCustomMode} />
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
              FocusForge
            </h1>
            {welcomeName && <p className="text-gray-400">Welcome, {welcomeName}</p>}
        </div>
        <Button onClick={onSignOut} variant="secondary" size="sm">
          <Icon name="logout" className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </header>

      {sessionFeedback !== 'idle' && (
        <SessionFeedback status={sessionFeedback} onFeedback={onSessionFeedback} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <FocusProfileCard profile={profile} onRefine={onRefineProfile} hasNewData={hasNewDataForRefinement} />
          <TaskCard 
            tasks={tasks}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
          {(initialAppUsageData || appUsageLog.length > 0) && (
              <AppUsageCard initialData={initialAppUsageData} liveLog={appUsageLog} />
          )}
          <WeeklyReport />
        </div>
        <div className="space-y-8">
          <PomodoroTimer
            profile={profile}
            onSessionComplete={onSessionComplete}
            onFocusModeChange={onFocusModeChange}
            onDistraction={onLogDistraction}
            onStreakBreak={onStreakBreak}
            // Fix: Pass the entire `activeCustomMode` object to allow access to both pomodoro config and the mode's name.
            customConfig={activeCustomMode}
           />
          <CustomModeCard
            modes={customFocusModes}
            onCreate={onCreateCustomMode}
            activeModeId={activeCustomMode?.id || null}
            onActivateMode={setActiveCustomMode}
          />
          <FocusStreakCard streak={focusStreak} />
          <FocusSquadCard 
            squad={squad}
            userId={user.uid}
            onJoin={onJoinSquad}
            onSetGoal={onSetGoal}
          />
          {events.length > 0 && <CalendarEventsCard events={events} />}
          <ProfessionModeCard profile={profile} />
          <DailySchedule schedule={profile.dailySchedule} />
          <PrivacyCard />
        </div>
      </div>
    </div>
  );
};