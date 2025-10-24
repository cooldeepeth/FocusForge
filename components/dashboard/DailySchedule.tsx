
import React from 'react';
import type { ScheduleItem } from '../../types';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';

interface DailyScheduleProps {
  schedule: ScheduleItem[];
}

export const DailySchedule: React.FC<DailyScheduleProps> = ({ schedule }) => {
  return (
    <Card title="Today's Adaptive Plan" icon="calendar">
      <ul className="space-y-4">
        {schedule.map((item, index) => (
          <li key={index} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.isBreak ? 'bg-green-800' : 'bg-indigo-800'}`}>
                <Icon name={item.isBreak ? 'coffee' : 'target'} className="w-4 h-4 text-white" />
              </div>
              {index < schedule.length - 1 && <div className="w-0.5 h-12 bg-gray-700"></div>}
            </div>
            <div>
              <p className="font-semibold text-white">{item.task}</p>
              <p className="text-sm text-gray-400">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};
