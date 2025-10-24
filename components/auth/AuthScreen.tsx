import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

type AuthView = 'login' | 'signup';

export const AuthScreen: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');

  const toggleView = () => {
    setView(currentView => currentView === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full mx-auto p-8 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 animate-fade-in">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
            FocusForge
          </h1>
          <p className="text-gray-400 mt-2">
            {view === 'login' ? 'Sign in to continue your journey' : 'Create an account to start'}
          </p>
        </header>
        
        {view === 'login' ? (
          <LoginForm onSwitchToSignup={toggleView} />
        ) : (
          <SignupForm onSwitchToLogin={toggleView} />
        )}
      </div>
    </div>
  );
};