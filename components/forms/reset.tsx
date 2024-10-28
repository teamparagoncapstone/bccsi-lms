'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const Reset: React.FC = () => {
  const router = useRouter();
  const { token } = router.query; // Extract the token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to reset password');
        return;
      }

      setSuccess('Password has been reset successfully!');
      setError(null);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
        {success && <div className="p-2 mt-4 text-green-600">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4 text-gray-500" /> : <EyeIcon className="h-4 w-4 text-gray-500" />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOffIcon className="h-4 w-4 text-gray-500" /> : <EyeIcon className="h-4 w-4 text-gray-500" />}
              </button>
            </div>
            {error && error === 'Passwords do not match' && (
              <div className="mt-2 text-sm text-red-600">{error}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white ${loading ? 'bg-gray-400' : 'bg-blue-600'} rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Reset;