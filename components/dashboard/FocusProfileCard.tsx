import React from 'react';
import type { FocusProfile } from '../../types';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';
import { Button } from '../shared/Button';

interface FocusProfileCardProps {
  profile: FocusProfile;
  onRefine: () => void;
  hasNewData: boolean;
}

const ProfileItem: React.FC<{ iconName: string; title: string; children: React.ReactNode }> = ({ iconName, title, children }) => (
    <div>
        <div className="flex items-center mb-2">
            <Icon name={iconName} className="w-6 h-6 text-brand-secondary mr-3" />
            <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="pl-9 text-gray-300">{children}</div>
    </div>
);

export const FocusProfileCard: React.FC<FocusProfileCardProps> = ({ profile, onRefine, hasNewData }) => {
  return (
    <Card>
        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center">
                <Icon name="brain" className="w-6 h-6 mr-3 text-brand-primary" />
                <h2 className="text-xl font-bold text-white">Your AI-Powered Focus Profile</h2>
            </div>
            <Button 
                onClick={onRefine} 
                size="sm" 
                variant="secondary"
                disabled={!hasNewData}
                title={!hasNewData ? "No new activity to analyze. Complete a session to enable." : "Refine your plan with new data"}
            >
                <Icon name="sparkles" className="w-4 h-4 mr-2" />
                Refine My Plan
            </Button>
        </div>
      <div className="p-6 space-y-6">
        <ProfileItem iconName="clock" title="Peak Focus Hours">
          <p className="text-2xl font-bold text-brand-accent">{profile.peakFocusHours}</p>
        </ProfileItem>

        <ProfileItem iconName="alert" title="Key Distraction Patterns">
          <ul className="list-disc list-inside space-y-1">
            {profile.distractionPatterns.map((pattern, index) => (
              <li key={index}>{pattern}</li>
            ))}
          </ul>
        </ProfileItem>

        <ProfileItem iconName="shield" title="Recommended Strategies">
          <ul className="list-disc list-inside space-y-1">
            {profile.recommendedStrategies.map((strategy, index) => (
              <li key={index}>{strategy}</li>
            ))}
          </ul>
        </ProfileItem>

         <div className="pt-4 border-t border-gray-700">
             <ProfileItem iconName="brain" title="Coach's Reasoning">
                <p className="italic text-gray-400">{profile.reasoning}</p>
            </ProfileItem>
         </div>

      </div>
    </Card>
  );
};