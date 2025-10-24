import type { CalendarEvent } from '../types';

// This is a mock function to simulate fetching data from a calendar API.
export const getTodaysEvents = async (): Promise<CalendarEvent[]> => {
  console.log("Simulating calendar API call...");
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  // Simulate a random outcome: success or failure
  if (Math.random() < 0.9) { // 90% chance of success
    return [
      { title: 'Project Stand-up', time: '10:00 AM - 10:30 AM' },
      { title: 'Focus Block: API Integration', time: '10:30 AM - 12:00 PM' },
      { title: 'Team Lunch', time: '12:30 PM - 1:30 PM' },
      { title: 'Code Review Session', time: '3:00 PM - 4:00 PM' },
    ];
  } else {
    throw new Error("Failed to connect to calendar service.");
  }
};
