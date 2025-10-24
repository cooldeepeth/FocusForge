import React, { useState } from 'react';
import type { CustomFocusMode } from '../../types';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';
import { Button } from '../shared/Button';
import { Loader } from '../shared/Loader';

interface CustomModeCardProps {
    modes: CustomFocusMode[];
    onCreate: (prompt: string) => Promise<void>;
    activeModeId: number | null;
    onActivateMode: (mode: CustomFocusMode | null) => void;
}

export const CustomModeCard: React.FC<CustomModeCardProps> = ({ modes, onCreate, activeModeId, onActivateMode }) => {
    const [view, setView] = useState<'list' | 'create'>('list');
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        await onCreate(prompt);
        setIsLoading(false);
        setPrompt('');
        setView('list');
    };
    
    const handleToggleActivation = (mode: CustomFocusMode) => {
        if (activeModeId === mode.id) {
            onActivateMode(null); // Deactivate
        } else {
            onActivateMode(mode); // Activate
        }
    };

    return (
        <Card>
            <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center">
                    <Icon name="wand" className="w-6 h-6 mr-3 text-brand-primary" />
                    <h2 className="text-xl font-bold text-white">Custom Focus Modes</h2>
                </div>
                {view === 'list' && (
                     <Button onClick={() => setView('create')} size="sm">New</Button>
                )}
            </div>

            <div className="p-6">
                {view === 'create' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="font-semibold text-white">Create a New Mode</h3>
                        <p className="text-sm text-gray-400">Describe your ideal focus session. The AI will handle the rest.</p>
                        <textarea
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-gray-800 border-gray-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5"
                            placeholder="e.g., 'A 45-minute coding session with a 15 min break. Block social media and news.'"
                        />
                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setView('list')} variant="secondary" disabled={isLoading}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={isLoading || !prompt.trim()}>
                                {isLoading ? <Loader /> : 'Create'}
                            </Button>
                        </div>
                    </div>
                )}
                {view === 'list' && (
                    <div className="space-y-3">
                        {modes.length > 0 ? (
                            modes.map(mode => (
                                <div key={mode.id} className={`p-3 rounded-lg border-2 transition-colors ${activeModeId === mode.id ? 'bg-brand-primary/20 border-brand-primary' : 'bg-gray-800 border-gray-700'}`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-white">{mode.name}</p>
                                            <p className="text-sm text-gray-400">{mode.pomodoro.focus} min focus / {mode.pomodoro.break} min break</p>
                                        </div>
                                        <Button onClick={() => handleToggleActivation(mode)} size="sm" variant={activeModeId === mode.id ? 'primary' : 'secondary'}>
                                            {activeModeId === mode.id ? 'Active' : 'Activate'}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-400">Create a custom mode to get started!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};
