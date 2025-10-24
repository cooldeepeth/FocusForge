import React from 'react';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';
import { Button } from '../shared/Button';

type FeedbackStatus = 'idle' | 'pending' | 'submitted';

interface SessionFeedbackProps {
    status: FeedbackStatus;
    onFeedback: (wasProductive: boolean) => void;
}

export const SessionFeedback: React.FC<SessionFeedbackProps> = ({ status, onFeedback }) => {
    if (status === 'pending') {
        return (
            <Card className="animate-fade-in-down">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="font-semibold text-white">Great work! Was this a productive focus session?</p>
                    <div className="flex gap-3">
                        <Button onClick={() => onFeedback(true)} size="sm">
                            <Icon name="thumbs-up" className="w-5 h-5 mr-2" /> Yes
                        </Button>
                        <Button onClick={() => onFeedback(false)} variant="secondary" size="sm">
                            <Icon name="thumbs-down" className="w-5 h-5 mr-2" /> No
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }
    
    if (status === 'submitted') {
        return (
             <Card className="animate-fade-in bg-brand-accent/20 border-brand-accent/50">
                <div className="flex items-center justify-center">
                    <p className="font-semibold text-brand-accent">Thank you for your feedback!</p>
                </div>
            </Card>
        )
    }

    return null;
};
