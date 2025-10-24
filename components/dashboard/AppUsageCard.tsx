import React from 'react';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';
import type { AppUsageData, AppUsageRecord } from '../../types';

interface AppUsageCardProps {
    initialData: AppUsageData | null;
    liveLog: AppUsageRecord[];
}

export const AppUsageCard: React.FC<AppUsageCardProps> = ({ initialData, liveLog }) => {
    
    // Sort the live log to show most used apps first
    const sortedLiveLog = [...liveLog].sort((a, b) => b.minutes - a.minutes);

    return (
        <Card title="Live App & Web Usage" icon="apps">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-white mb-3">Distraction Hotspots (Initial Analysis)</h3>
                    {initialData && initialData.hotspots.length > 0 ? (
                        <ul className="space-y-2">
                            {initialData.hotspots.map((hotspot, index) => (
                                <li key={index} className="flex items-start">
                                    <Icon name="alert" className="w-5 h-5 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-300">{hotspot.activity}</p>
                                        <p className="text-sm text-gray-500">{hotspot.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-400">No historical hotspots identified.</p>
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-white mb-3">Recent Activity Log</h3>
                    {sortedLiveLog.length > 0 ? (
                         <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {sortedLiveLog.map((log, index) => (
                                <li key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{log.name}</span>
                                    <span className="font-mono bg-gray-800 px-2 py-0.5 rounded-md text-brand-accent">{log.minutes} min</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-4">
                            <Icon name="brain" className="w-8 h-8 mx-auto text-gray-600 mb-2"/>
                            <p className="text-sm text-gray-500">Listening for activity...</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};