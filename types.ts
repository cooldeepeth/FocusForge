export type Profession = 'Student' | 'Developer';

export interface AppUsageRecord {
  name: string;
  minutes: number;
}

export interface DistractionHotspot {
  time: string;
  activity: string;
}

export interface AppUsageData {
  topApps: AppUsageRecord[];
  hotspots: DistractionHotspot[];
}

export interface OnboardingData {
  profession: Profession;
  routine: string;
  distractions: string[];
  goals: string;
  permissionsGranted: boolean;
  calendarEvents?: CalendarEvent[];
  appUsageData?: AppUsageData;
}

export interface CalendarEvent {
  title: string;
  time: string;
}

export interface ScheduleItem {
  time: string;
  task: string;
  isBreak: boolean;
}

export interface FocusProfile {
  peakFocusHours: string;
  distractionPatterns: string[];
  recommendedStrategies: string[];
  dailySchedule: ScheduleItem[];
  profession: Profession;
  reasoning: string;
  tasks?: Task[]; // Optional list of tasks integrated into the schedule
}

export interface WeeklyReportData {
  day: string;
  focusHours: number;
  distractions: number;
}

// New types for enhanced features
export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface Feedback {
  timestamp: number;
  wasProductive: boolean;
}

export interface DistractionLog {
  timestamp: number;
  reason: string;
}

// New types for Custom Focus Modes
export interface PomodoroConfig {
  focus: number; // minutes
  break: number; // minutes
}

export interface CustomFocusMode {
  id: number;
  name: string;
  goal: string;
  blockedSites: string[];
  pomodoro: PomodoroConfig;
}

// New type for Authentication
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    squadId?: string;
}

// New types for Focus Squad
export interface SquadMember {
    id: string; // user.uid or a bot id
    name: string;
    isCurrentUser: boolean;
    dailyGoal: string;
    completedSessions: number;
}

export interface Squad {
    id: string;
    members: SquadMember[];
}