import { GoogleGenAI, Type } from "@google/genai";
import type { OnboardingData, FocusProfile, Task, Feedback, DistractionLog, AppUsageRecord, CustomFocusMode } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const profileSchema = {
    type: Type.OBJECT,
    properties: {
        peakFocusHours: {
            type: Type.STRING,
            description: "The user's predicted peak productivity hours in a range format (e.g., '9:00 AM - 11:30 AM'). Should be a 2-3 hour block.",
        },
        distractionPatterns: {
            type: Type.ARRAY,
            description: "A list of 2-3 key distraction patterns identified from user input. Each pattern should be a short, insightful, and actionable sentence. (e.g., 'After lunch, energy dips, making social media more tempting.').",
            items: { type: Type.STRING },
        },
        recommendedStrategies: {
            type: Type.ARRAY,
            description: "A list of 2-3 personalized, actionable strategies to combat distractions and improve focus, tailored to their profession. (e.g., 'Use the Pomodoro Technique during peak hours.', 'Schedule a 15-minute walk post-lunch to avoid the energy slump.').",
            items: { type: Type.STRING },
        },
        dailySchedule: {
            type: Type.ARRAY,
            description: "A simple, adaptive daily schedule with 5-7 items, including focused work blocks and short breaks. Time should be in 'HH:MM AM/PM' format. The schedule should logically follow from their described routine.",
            items: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.STRING },
                    task: { type: Type.STRING },
                    isBreak: { type: Type.BOOLEAN },
                },
                required: ["time", "task", "isBreak"],
            },
        },
        reasoning: {
            type: Type.STRING,
            description: "A brief, encouraging paragraph (2-3 sentences) explaining how the analysis was derived from the user's input. For example: 'Based on your routine and app usage, we've identified the morning as your key window for deep work before distractions typically rise in the afternoon.'",
        }
    },
    required: ["peakFocusHours", "distractionPatterns", "recommendedStrategies", "dailySchedule", "reasoning"],
};

const customModeSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "A short, descriptive name for the focus mode (e.g., 'Morning Writing', 'Deep Coding')."
        },
        goal: {
            type: Type.STRING,
            description: "A brief description of the user's primary goal for this mode."
        },
        blockedSites: {
            type: Type.ARRAY,
            description: "A list of generic site categories to block (e.g., 'Social Media', 'News', 'Shopping').",
            items: { type: Type.STRING },
        },
        pomodoro: {
            type: Type.OBJECT,
            description: "The configuration for the Pomodoro timer for this mode.",
            properties: {
                focus: { type: Type.INTEGER, description: "The length of the focus session in minutes." },
                break: { type: Type.INTEGER, description: "The length of the break session in minutes." },
            },
            required: ["focus", "break"],
        }
    },
    required: ["name", "goal", "blockedSites", "pomodoro"],
};


export const generateFocusProfile = async (data: OnboardingData, tasks: Task[]): Promise<FocusProfile> => {
  const { profession, routine, distractions, goals, permissionsGranted, appUsageData } = data;

  const taskList = tasks.filter(t => !t.completed).map(t => t.text).join(', ') || 'No specific tasks listed yet.';
  
  let appUsageContext = "The user has not granted permissions for app usage analysis, so base your analysis solely on the information provided.";
  if (permissionsGranted && appUsageData) {
    const topApps = appUsageData.topApps.map(app => `${app.name} (${app.minutes} mins)`).join(', ');
    const hotspots = appUsageData.hotspots.map(h => `${h.time} (${h.activity})`).join('; ');
    appUsageContext = `The user has granted permissions. Their historical app usage data shows their most used apps are: ${topApps}. Their main distraction hotspots are: ${hotspots}. Use this data to make your analysis hyper-personalized.`;
  }

  const prompt = `
    Act as an expert productivity coach. Analyze the following user profile to create a personalized focus and productivity plan. The user is a ${profession}.

    User's Daily Routine: "${routine}"
    User's Main Distractions: ${distractions.join(', ')}
    User's Primary Goal: "${goals}"
    Today's Pending Tasks: ${taskList}
    App Usage Analysis: ${appUsageContext}

    Based on all this information, generate a JSON object that strictly adheres to the provided schema. The plan should be encouraging, actionable, and tailored specifically to a ${profession}.
    - For "peakFocusHours", identify the most likely high-energy window based on their routine and distraction hotspots.
    - For "distractionPatterns", provide insightful observations based on their self-reported distractions AND their app usage data. (e.g., "The afternoon slump between 3-5 PM, combined with high social media use, is a major focus killer.").
    - For "recommendedStrategies", give concrete advice targeting the identified patterns.
    - For the "dailySchedule", create a realistic plan. IMPORTANT: Incorporate the user's specific "Today's Pending Tasks" into the focus blocks.
    - For "reasoning", provide a brief, encouraging summary explaining how the plan connects to ALL the user's provided information, including app usage.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: profileSchema,
        },
    });

    const profileData = JSON.parse(response.text);
    
    return { ...profileData, profession: data.profession };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate focus profile from AI service.");
  }
};

export const refineFocusProfile = async (currentProfile: FocusProfile, tasks: Task[], feedback: Feedback[], distractions: DistractionLog[], appUsageLog: AppUsageRecord[]): Promise<FocusProfile> => {
    const taskList = tasks.filter(t => !t.completed).map(t => t.text).join(', ') || 'All tasks completed!';
    const feedbackSummary = feedback.length > 0 ? `${feedback.filter(f => f.wasProductive).length} productive sessions, ${feedback.filter(f => !f.wasProductive).length} unproductive sessions.` : 'No session feedback yet.';
    const distractionSummary = distractions.length > 0 ? distractions.map(d => d.reason).join('. ') : 'No specific distractions logged.';
    const appUsageSummary = appUsageLog.length > 0 ? appUsageLog.map(log => `${log.name}: ${log.minutes} min`).join(', ') : 'No recent app activity logged.';

    const prompt = `
        Act as an expert productivity coach refining a user's plan. The user is a ${currentProfile.profession}.
        
        Their current plan identified peak hours as ${currentProfile.peakFocusHours} and suggested these strategies: ${currentProfile.recommendedStrategies.join(', ')}.

        Here is new REAL-TIME data based on their recent activity:
        - Remaining Tasks for Today: ${taskList}
        - Session Feedback Summary: ${feedbackSummary}
        - Logged Distractions: ${distractionSummary}
        - Recent App & Web Usage Log: ${appUsageSummary}

        Analyze this new information to refine their focus profile. 
        - If their recent app usage shows a spike in distracting apps, update their distraction patterns and recommend a new strategy.
        - If they reported sessions as unproductive, adjust strategies or schedule timing based on the activity logs.
        - The new daily schedule MUST incorporate their remaining tasks.
        - The reasoning should explain WHAT has changed and WHY based on the new real-time data. For example: "I've noticed a new pattern of using Slack frequently in the morning, so I've adjusted your deep work block to be after lunch when you seem less distracted."

        Generate an updated JSON object that strictly adheres to the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: profileSchema,
            },
        });
        const profileData = JSON.parse(response.text);
        return { ...profileData, profession: currentProfile.profession };
    } catch (error) {
        console.error("Error calling Gemini API for refinement:", error);
        throw new Error("Failed to refine focus profile.");
    }
};


export const summarizeText = async (textToSummarize: string): Promise<string> => {
  if (!textToSummarize.trim()) {
    return "Please enter some text to summarize.";
  }

  const prompt = `Summarize the following text into 2-3 key bullet points. Be concise and clear.

  Text: "${textToSummarize}"
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text;
  } catch(error) {
    console.error("Error calling Gemini API for summarization:", error);
    throw new Error("Failed to summarize text.");
  }
};

export const createCustomFocusMode = async (prompt: string): Promise<Omit<CustomFocusMode, 'id'>> => {
    const fullPrompt = `
        A user wants to create a new custom focus mode. Analyze their request and extract the key information into a JSON object that strictly adheres to the provided schema.

        User Request: "${prompt}"

        - Infer a short, clear 'name' for the mode.
        - Summarize their main 'goal'.
        - Identify generic categories of sites to block.
        - Extract the focus and break durations in minutes for the 'pomodoro' configuration. If none are specified, use a default of 25 minutes for focus and 5 for break.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: customModeSchema,
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error calling Gemini API for custom mode creation:", error);
        throw new Error("Failed to create custom focus mode.");
    }
};
