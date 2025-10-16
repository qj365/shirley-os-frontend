/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { getPasswordStrength } from '@/services/auth-service';

interface PasswordResetProps {
  token?: string; // Token from URL for password reset
  email?: string; // Email from URL for password reset
}

export default function PasswordReset({
  token: initialToken = '',
  email: initialEmail = '',
}: PasswordResetProps) {
  const router = useRouter();

  // State for controlling which form to show (request or reset)
  const [showResetForm, setShowResetForm] = useState(!!initialToken);

  // Shared states
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset password specific states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState<string>(initialToken); // Will be set after email verification or from URL

  // Password strength validation
  const passwordStrength = getPasswordStrength(password);

  // Set token and email from URL params if provided
  useEffect(() => {
    if (initialToken) {
      setToken(initialToken);
      setShowResetForm(true);
    }
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialToken, initialEmail]);

  // Handle request password reset
  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // await sdk.auth.resetPassword("customer", "emailpass", {
      //   identifier: email,
      // })
      // setSuccessMessage("If an account exists with the specified email, it'll receive instructions to reset the password.")
      // In a real application, the user would receive an email with a link to reset their password
      // The link would contain the token and email as URL parameters
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to request password reset'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordStrength.is_strong) {
      setError('Please use a stronger password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use the token from URL parameters or state
      // await sdk.auth.updateProvider(
      //   'customer',
      //   'emailpass',
      //   {
      //     email,
      //     password,
      //   },
      //   token
      // );
      // setSuccessMessage(
      //   'Password reset successfully! You can now log in with your new password.'
      // );
      // // Redirect to login page after a short delay
      // setTimeout(() => {
      //   router.push('/login');
      // }, 3000);
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to reset password'
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Back to home arrow */}
      <div className="absolute z-10 p-4">
        <Link
          href="/"
          className="flex items-center text-gray-600 transition-colors hover:text-black"
        >
          <ArrowLeft size={20} />
          <span className="ml-2">Back to home</span>
        </Link>
      </div>

      <div className="flex h-screen flex-1 flex-col md:flex-row">
        {/* Form section */}
        <div className="flex w-full items-center justify-center p-8 pt-16 lg:w-1/2">
          <div className="w-full max-w-md">
            <h1 className="mb-6 text-2xl font-bold">
              {showResetForm ? 'Set New Password' : 'Reset Your Password'}
            </h1>

            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
            {successMessage && (
              <p className="mb-4 text-sm text-green-500">{successMessage}</p>
            )}

            {!showResetForm ? (
              // Request Password Reset Form
              <form className="space-y-5" onSubmit={handleRequestReset}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="mt-5 w-full rounded bg-[#fabc20] px-4 py-3 text-sm font-medium text-black hover:bg-[#f5c508] active:scale-95 active:bg-[#f5c508]"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Request Password Reset'}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              // Reset Password Form
              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 text-gray-500 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <PasswordStrengthIndicator
                    passwordStrength={passwordStrength}
                    password={password}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className={`w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent ${
                        confirmPassword && password === confirmPassword
                          ? 'border-green-500'
                          : confirmPassword && password !== confirmPassword
                            ? 'border-red-500'
                            : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="mt-1 text-xs text-green-500">
                      Passwords match
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="mt-5 w-full rounded bg-[#fabc20] px-4 py-3 text-sm font-medium text-black hover:bg-[#f5c508] active:scale-95 active:bg-[#f5c508]"
                    disabled={
                      loading ||
                      password !== confirmPassword ||
                      !confirmPassword
                    }
                  >
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Image section */}
        <div className="relative hidden w-full lg:block lg:w-1/2">
          <Image
            src="/image/login.png"
            alt="login"
            layout="fill"
            objectFit="cover"
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
