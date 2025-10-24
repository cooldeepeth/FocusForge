import React, { useState } from 'react';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
import type { CalendarEvent, AppUsageData, Profession } from '../../types';
import { getTodaysEvents } from '../../services/calendarService';
import { getInitialAppUsageData } from '../../services/appUsageService';
import { Loader } from '../shared/Loader';

interface StepPermissionsProps {
  onSubmit: (granted: boolean, events?: CalendarEvent[], appUsageData?: AppUsageData) => void;
  onBack: () => void;
  profession: Profession;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export const StepPermissions: React.FC<StepPermissionsProps> = ({ onSubmit, onBack, profession }) => {
  const [state, setState] = useState<LoadingState>('idle');
  const [data, setData] = useState<{ events: CalendarEvent[], appUsage: AppUsageData } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGrantAccess = async () => {
    setState('loading');
    setError(null);
    try {
      // Fetch in parallel for a faster experience
      const [fetchedEvents, fetchedAppUsage] = await Promise.all([
        getTodaysEvents(),
        getInitialAppUsageData(profession)
      ]);
      setData({ events: fetchedEvents, appUsage: fetchedAppUsage });
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setState('error');
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="animate-fade-in text-center flex flex-col items-center justify-center h-full">
            <Loader />
            <p className="mt-4 text-gray-300">Syncing your data securely...</p>
          </div>
        );

      case 'error':
        return (
          <div className="animate-fade-in text-center">
            <Icon name="alert" className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Connection Failed</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">{error}</p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleGrantAccess}>Try Again</Button>
              <Button onClick={onBack} variant="secondary">Back</Button>
            </div>
          </div>
        );

      case 'success':
        if (data) {
          return (
            <div className="animate-fade-in text-center">
              <Icon name="shield" className="w-16 h-16 mx-auto text-brand-accent mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Data Synced!</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                We've analyzed your calendar and app usage to create a hyper-personalized plan.
              </p>
              <div className="bg-gray-800 p-4 rounded-lg text-left text-sm space-y-2 mb-8 max-h-40 overflow-y-auto">
                  <p className="font-semibold text-white">Insights Found:</p>
                  <p className="truncate"><span className="font-semibold text-brand-primary mr-2">{data.events.length}</span> calendar events for today.</p>
                  <p className="truncate"><span className="font-semibold text-brand-primary mr-2">{data.appUsage.topApps.length}</span> key apps identified.</p>
                  <p className="truncate"><span className="font-semibold text-brand-primary mr-2">{data.appUsage.hotspots.length}</span> distraction hotspots noted.</p>
              </div>
              <Button onClick={() => onSubmit(true, data.events, data.appUsage)} size="md" className="w-full sm:w-auto">
                Forge My Plan
              </Button>
            </div>
          );
        }
        return null;

      case 'idle':
      default:
        return (
          <div className="animate-fade-in text-center">
            <Icon name="permissions" className="w-16 h-16 mx-auto text-brand-secondary mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Supercharge Your Focus</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              To provide hyper-personalized advice, FocusForge can sync with your calendar and (simulated) app usage data.
            </p>
            
            <div className="bg-gray-800 p-4 rounded-lg text-left text-sm space-y-3 mb-8">
                <p className="flex items-start"><Icon name="calendar" className="w-5 h-5 mr-3 text-brand-accent flex-shrink-0 mt-0.5"/> <span><span className="font-semibold text-white">Calendar:</span> To build your schedule around existing events.</span></p>
                <p className="flex items-start"><Icon name="apps" className="w-5 h-5 mr-3 text-brand-accent flex-shrink-0 mt-0.5"/> <span><span className="font-semibold text-white">App Usage:</span> To identify your unique distraction patterns.</span></p>
                <p className="flex items-start"><Icon name="shield" className="w-5 h-5 mr-3 text-brand-accent flex-shrink-0 mt-0.5"/> <span><span className="font-semibold text-white">Privacy First:</span> Your data is always kept secure and private.</span></p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={handleGrantAccess} size="md" className="w-full sm:w-auto">
                Grant Access & Personalize
              </Button>
              <Button onClick={() => onSubmit(false)} variant="secondary" size="md" className="w-full sm:w-auto">
                Continue Without
              </Button>
            </div>
            <div className="mt-8">
              <Button onClick={onBack} variant="secondary" size="sm">Back</Button>
            </div>
          </div>
        );
    }
  };

  return renderContent();
};