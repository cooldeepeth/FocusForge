
import React from 'react';
import { Icon } from './Icon';

interface CardProps {
  title?: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className }) => {
  return (
    <div className={`bg-gray-900 rounded-2xl shadow-lg border border-gray-700/50 ${className}`}>
      {title && (
        <div className="p-6 border-b border-gray-700/50 flex items-center">
          {icon && <Icon name={icon} className="w-6 h-6 mr-3 text-brand-primary" />}
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
