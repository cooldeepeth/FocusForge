# FocusForge 🧠✨

**Tagline:** Your AI-Powered Productivity Coach

FocusForge is a revolutionary, AI-driven focus application designed for students, developers, and professionals who want to conquer distractions and achieve deep work. By analyzing your unique work patterns, predicting distractions, and providing hyper-personalized strategies, FocusForge acts as your personal productivity coach, helping you build lasting focus and reclaim your time.

This project is a comprehensive demonstration of a modern, feature-rich web application built with React, TypeScript, and powered by the Google Gemini API.

---

## Key Features

FocusForge is packed with intelligent and engaging features designed to provide a truly personalized productivity experience.

*   **🧠 Hyper-Personalized AI Focus Plan:**
    *   Start with a quick onboarding quiz to tell our AI about your profession, routine, and challenges.
    *   Receive an instant, AI-generated focus profile identifying your **Peak Focus Hours**, key **Distraction Patterns**, and actionable **Recommended Strategies**, complete with the AI's reasoning.

*   **🔄 Adaptive Learning Loop:**
    *   The app gets smarter over time! After focus sessions, provide simple feedback ("Productive" or "Not Productive").
    *   The AI analyzes your recent activity, feedback, and logged distractions to **refine your strategy**, creating a plan that evolves with you.

*   **🤝 Anonymous 'Focus Squads' for Social Motivation:**
    *   Join a small, anonymous squad to share your daily goal and stay accountable.
    *   See the live, anonymized progress of your squad members, creating a powerful sense of shared purpose.

*   **🪄 Custom AI-Powered Focus Modes:**
    *   Describe your ideal work session in plain English (e.g., *"A 45-minute writing block with a 10-minute break, blocking news sites"*).
    *   The AI instantly creates a custom, one-click mode with your specified timer settings and simulated content blocking.

*   **⏱️ Smart, Adaptive Pomodoro Timer:**
    *   The timer automatically extends focus sessions during your predicted "Peak Hours" to capitalize on your flow state.
    *   Intelligently logs interruptions as data points for the AI to learn from.

*   **✅ Integrated Task Management:**
    *   Add your daily to-dos directly within the app. The AI intelligently schedules your tasks into your focus blocks.

*   **🔥 Gamification & Streaks:**
    *   Stay motivated by building your **Focus Streak** with every completed Pomodoro session.

*   **📊 Real-Time Activity Insights (Simulated):**
    *   FocusForge simulates integration with your device data (Calendar & App Usage) to identify personal distraction hotspots, ensuring your plan stays relevant to your real-world habits.

*   **🔒 Secure Authentication:**
    *   A complete, secure authentication flow with **Email/Password** and **Google Sign-In** options.
    *   Sessions are persistent, and user data is tied to their account.

*   **🌓 Light & Dark Modes:**
    *   A beautiful, meticulously crafted theme system that respects your OS preference and can be toggled manually. Your choice is saved locally for a consistent experience.

---

## Tech Stack

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **AI / Large Language Model:** Google Gemini API
*   **Charts:** Recharts
*   **Backend (Simulated):** The application uses a comprehensive set of mock services (`authService`, `squadService`, etc.) to simulate a full backend, allowing for rapid, frontend-focused development and demonstration of all features without a live database.

---

## Getting Started

This project is designed to run in a web-based development environment like Vibe.io, where the necessary dependencies and environment variables are pre-configured.

1.  **API Key:** The application requires a Google Gemini API key to function. This should be available as an environment variable (`process.env.API_KEY`) in the execution environment. The `geminiService.ts` file is already set up to use this variable.

2.  **Installation:** No local installation is required if you are running this in a compatible online IDE. If running locally, you would typically run `npm install` to fetch the dependencies listed in `index.html`.

3.  **Running the App:** Simply open the `index.html` file in a browser or use the "Preview" feature of your development environment.

---

## Project Structure

```
/
├── components/       # Reusable React components
│   ├── auth/         # Login/Signup forms and screen
│   ├── dashboard/    # All the cards and main dashboard view
│   ├── onboarding/   # Multi-step onboarding wizard
│   └── shared/       # Common components (Button, Card, Icon, etc.)
├── services/         # Mock backend services and API calls
│   ├── authService.ts
│   ├── geminiService.ts
│   └── ...
├── types.ts          # Centralized TypeScript type definitions
├── App.tsx           # Main application component, state management
├── index.tsx         # React app entry point
└── index.html        # Main HTML file
```
