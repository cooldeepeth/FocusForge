import React, { useState } from 'react';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
import { Loader } from '../shared/Loader';
import * as authService from '../../services/authService';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await authService.signUpWithEmail(email, password);
      // Success will be handled by the onAuthStateChanged listener in App.tsx
    } catch (err: any) {
      if (err.message.includes('email-already-in-use')) {
        setError('This email is already registered.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      {error && <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-md">{error}</p>}
      
      <div>
        <label htmlFor="email-signup" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
        <input
          id="email-signup"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-gray-800 border-gray-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5"
        />
      </div>
      
      <div>
        <label htmlFor="password-signup" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <input
          id="password-signup"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-gray-800 border-gray-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader /> : 'Create Account'}
      </Button>

      <p className="text-sm text-center text-gray-400">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="font-medium text-brand-primary hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
};