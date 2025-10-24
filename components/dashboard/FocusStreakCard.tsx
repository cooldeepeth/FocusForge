import React from 'react';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';

interface FocusStreakCardProps {
  streak: number;
}

export const FocusStreakCard: React.FC<FocusStreakCardProps> = ({ streak }) => {
  const streakColor = streak > 0 ? 'text-orange-400' : 'text-gray-500';

  return (
    <Card>
      <div className="flex items-center justify-center text-center">
        <Icon name="flame" className={`w-12 h-12 mr-4 ${streakColor} transition-colors`} />
        <div>
          <p className="text-3xl font-bold text-white">{streak}</p>
          <p className="text-sm text-gray-400">Focus Streak</p>
        </div>
      </div>
    </Card>
  );
};
