
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../shared/Card';
import type { WeeklyReportData } from '../../types';

const data: WeeklyReportData[] = [
  { day: 'Mon', focusHours: 4, distractions: 24 },
  { day: 'Tue', focusHours: 3, distractions: 30 },
  { day: 'Wed', focusHours: 5, distractions: 20 },
  { day: 'Thu', focusHours: 4.5, distractions: 15 },
  { day: 'Fri', focusHours: 6, distractions: 12 },
  { day: 'Sat', focusHours: 2, distractions: 40 },
  { day: 'Sun', focusHours: 1, distractions: 10 },
];

export const WeeklyReport: React.FC = () => {
  return (
    <Card title="Weekly Focus Report" icon="chart">
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            borderColor: '#4B5563' 
                        }} 
                        labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Legend wrapperStyle={{ color: '#D1D5DB' }} />
                    <Bar dataKey="focusHours" name="Focus Hours" fill="#4F46E5" />
                    <Bar dataKey="distractions" name="Distractions (Est.)" fill="#7C3AED" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </Card>
  );
};
