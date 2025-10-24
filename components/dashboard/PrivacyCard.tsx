import React from 'react';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';

export const PrivacyCard: React.FC = () => {
  return (
    <Card title="Privacy First" icon="lock">
      <p className="text-sm text-gray-400">
        Your data is used solely to personalize your FocusForge experience. We do not sell or share your information. All analysis is performed securely.
      </p>
    </Card>
  );
};
