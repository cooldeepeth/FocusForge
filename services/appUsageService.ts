import type { AppUsageData, Profession, AppUsageRecord } from '../types';

const studentApps = ['YouTube', 'TikTok', 'Instagram', 'Discord', 'Lecture Notes'];
const devApps = ['Slack', 'GitHub', 'Stack Overflow', 'YouTube', 'Hacker News'];

// This simulates fetching a user's historical data during onboarding.
export const getInitialAppUsageData = async (profession: Profession): Promise<AppUsageData> => {
  console.log("Simulating initial app usage data fetch...");
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  const topApps = (profession === 'Student' ? studentApps : devApps)
    .slice(0, 3)
    .map(name => ({ name, minutes: Math.floor(Math.random() * 90) + 30 }));

  return {
    topApps,
    hotspots: [
      { time: '3:00 PM - 5:00 PM', activity: 'Social Media Browsing' },
      { time: 'After 9:00 PM', activity: 'Video Streaming' },
    ],
  };
};

// This simulates a background service providing live updates.
export const getLiveUsageUpdate = (currentLog: AppUsageRecord[], profession: Profession): AppUsageRecord => {
    const appPool = profession === 'Student' ? studentApps : devApps;
    const randomApp = appPool[Math.floor(Math.random() * appPool.length)];
    
    return { name: randomApp, minutes: Math.floor(Math.random() * 3) + 1 };
};