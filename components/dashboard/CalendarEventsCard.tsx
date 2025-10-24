import React from 'react';
import type { CalendarEvent } from '../../types';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';

interface CalendarEventsCardProps {
  events: CalendarEvent[];
}

export const CalendarEventsCard: React.FC<CalendarEventsCardProps> = ({ events }) => {
  return (
    <Card title="Today's Calendar Events" icon="calendar">
      <ul className="space-y-3">
        {events.map((event, index) => (
          <li key={index} className="flex items-center">
            <Icon name="clock" className="w-5 h-5 text-brand-secondary mr-3 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white leading-tight">{event.title}</p>
              <p className="text-sm text-gray-400">{event.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};
