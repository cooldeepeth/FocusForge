import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';
import type { Squad } from '../../types';
import { Button } from '../shared/Button';

interface FocusSquadCardProps {
    squad: Squad | null;
    userId: string;
    onJoin: () => void;
    onSetGoal: (goal: string) => void;
}

const JoinSquadView: React.FC<{ onJoin: () => void }> = ({ onJoin }) => (
    <div className="text-center">
        <Icon name="group" className="w-12 h-12 mx-auto text-brand-secondary mb-4" />
        <h3 className="font-semibold text-white">Join a Focus Squad</h3>
        <p className="text-sm text-gray-400 mb-4">Stay motivated by sharing progress with a small, anonymous group.</p>
        <Button onClick={onJoin} size="sm">Join Now</Button>
    </div>
);

const SetGoalView: React.FC<{ onSetGoal: (goal: string) => void }> = ({ onSetGoal }) => {
    const [goal, setGoal] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(goal.trim()) {
            onSetGoal(goal.trim());
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <label htmlFor="daily-goal" className="font-semibold text-white block text-center">What's your main goal today?</label>
            <input
                id="daily-goal"
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., 'Finish chapter 3'"
                className="w-full bg-gray-800 border-gray-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2"
            />
            <Button type="submit" size="sm" className="w-full" disabled={!goal.trim()}>Set Goal</Button>
        </form>
    );
};

const SquadProgressView: React.FC<{ squad: Squad }> = ({ squad }) => (
    <>
        <p className="text-sm text-gray-400 mb-4">Your anonymous squad's progress today.</p>
        <ul className="space-y-3">
            {squad.members.sort((a,b) => b.completedSessions - a.completedSessions).map(member => (
                <li key={member.id} className={`p-3 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2 ${member.isCurrentUser ? 'bg-brand-primary/20' : 'bg-gray-800'}`}>
                    <div>
                        <span className={`font-semibold text-sm ${member.isCurrentUser ? 'text-brand-primary' : 'text-gray-300'}`}>
                            {member.name}
                        </span>
                        <p className="text-xs text-gray-400 italic truncate" title={member.dailyGoal}>"{member.dailyGoal || 'No goal set'}"</p>
                    </div>
                    <div className="flex items-center gap-1 self-end sm:self-center">
                        {Array.from({ length: member.completedSessions }).map((_, i) => (
                             <Icon key={i} name="flame" className="w-5 h-5 text-orange-400" />
                        ))}
                    </div>
                </li>
            ))}
        </ul>
    </>
);


export const FocusSquadCard: React.FC<FocusSquadCardProps> = ({ squad, userId, onJoin, onSetGoal }) => {
  
  const renderContent = () => {
    if (!squad) {
        return <JoinSquadView onJoin={onJoin} />;
    }
    
    const currentUser = squad.members.find(m => m.id === userId);
    if (currentUser && !currentUser.dailyGoal) {
        return <SetGoalView onSetGoal={onSetGoal} />;
    }

    return <SquadProgressView squad={squad} />;
  }

  return (
    <Card title="Focus Squad" icon="group">
        {renderContent()}
    </Card>
  );
};