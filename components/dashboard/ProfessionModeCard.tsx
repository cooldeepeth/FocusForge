import React, { useState } from 'react';
import type { FocusProfile } from '../../types';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Loader } from '../shared/Loader';
import { summarizeText } from '../../services/geminiService';

interface ProfessionModeCardProps {
  profile: Pick<FocusProfile, 'profession'>;
}

const StudentAid: React.FC = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSummarize = async () => {
        setIsLoading(true);
        setError('');
        setSummary('');
        try {
            const result = await summarizeText(text);
            setSummary(result);
        } catch (err) {
            setError('Could not generate summary. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-white">AI-Powered Study Aid</h3>
            <textarea
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-gray-800 border-gray-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5"
                placeholder="Paste text here to get a quick summary..."
            />
            <Button onClick={handleSummarize} disabled={isLoading || !text.trim()}>
                {isLoading ? <Loader /> : 'Summarize'}
            </Button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {summary && (
                 <div className="p-4 bg-gray-800 rounded-lg whitespace-pre-wrap font-mono text-sm">{summary}</div>
            )}
        </div>
    );
};

const DeveloperAid: React.FC = () => {
    return (
        <div className="space-y-4">
             <h3 className="font-semibold text-white">Code Flow Protection</h3>
             <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><span className="font-semibold text-brand-accent">Active:</span> Non-essential notifications are currently silenced.</li>
                <li>Quickly access common code snippets and documentation.</li>
                <li>Stay in the zone with minimal context switching.</li>
            </ul>
            <div className="p-4 bg-gray-800 rounded-lg">
                <p className="font-mono text-sm text-gray-400">// Your saved snippets will appear here...</p>
            </div>
        </div>
    );
};

export const ProfessionModeCard: React.FC<ProfessionModeCardProps> = ({ profile }) => {
  const isStudent = profile.profession === 'Student';
  const title = isStudent ? "Study Mode" : "Developer Mode";
  const icon = isStudent ? "student" : "developer";
  
  return (
    <Card title={title} icon={icon}>
      {isStudent ? <StudentAid /> : <DeveloperAid />}
    </Card>
  );
};