import React, { useState } from 'react';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
import { Loader } from '../shared/Loader';
import * as authService from '../../services/authService';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await authService.signInWithEmail(email, password);
      // Success will be handled by the onAuthStateChanged listener in App.tsx
    } catch (err: any) {
      if (err.message.includes('user-not-found') || err.message.includes('wrong-password')) {
        setError('Invalid email or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
        await authService.signInWithGoogle();
    } catch(err) {
        setError('Could not sign in with Google. Please try again.');
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-md">{error}</p>}
      
      <div>
        <label htmlFor="email-login" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
        <input
          id="email-login"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-gray-800 border-gray-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5"
        />
      </div>
      
      <div>
        <label htmlFor="password-login" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <input
          id="password-login"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-gray-800 border-gray-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader /> : 'Sign In'}
      </Button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
        </div>
      </div>
      
      <Button type="button" variant="secondary" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
          <Icon name="google" className="w-5 h-5 mr-3" />
          Sign In with Google
      </Button>

      <p className="text-sm text-center text-gray-400">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="font-medium text-brand-primary hover:underline">
          Sign up
        </button>
      </p>
    </form>
  );
};