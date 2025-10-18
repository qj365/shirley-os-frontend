/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  passwordResetSchema,
  sendOtpSchema,
  verifyOtpSchema,
  type PasswordResetFormData,
  type SendOtpFormData,
  type VerifyOtpFormData,
} from '@/lib/validations/schemas';
import { getPasswordStrength } from '@/services/auth-service';
import { api } from '@/src/lib/api/customer';
import { OtpType } from '@/src/lib/api/customer/client/models/OtpType';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthLayout from './AuthLayout';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

interface PasswordResetProps {
  token?: string; // Token from URL for password reset
  email?: string; // Email from URL for password reset
}

export default function PasswordReset({
  token: initialToken = '',
  email: initialEmail = '',
}: PasswordResetProps) {
  const router = useRouter();

  // State for controlling which step to show
  const [currentStep, setCurrentStep] = useState<
    'request' | 'verify' | 'reset'
  >(initialToken ? 'reset' : 'request');

  // Shared states
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // OTP verification states
  const [otpToken, setOtpToken] = useState<string>(initialToken);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);

  // Form instances
  const sendOtpForm = useForm<SendOtpFormData>({
    resolver: zodResolver(sendOtpSchema) as any,
    defaultValues: {
      email: initialEmail,
    },
  });

  const verifyOtpForm = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema) as any,
    defaultValues: {
      email: initialEmail,
      otp: '',
    },
  });

  const passwordResetForm = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema) as any,
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Password strength validation
  const password = passwordResetForm.watch('password');
  const passwordStrength = getPasswordStrength(password || '');

  // Set token and email from URL params if provided
  useEffect(() => {
    if (initialToken) {
      setOtpToken(initialToken);
      setCurrentStep('reset');
    }
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialToken, initialEmail]);

  // Step 1: Handle request password reset
  const handleRequestReset = async (data: SendOtpFormData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await api.auth.sendOtpResetPassword({
        otpType: OtpType.RESET_PASSWORD,
        requestBody: {
          email: data.email,
        },
      });
      setEmail(data.email);
      setSuccessMessage(
        'OTP code has been sent to your email. Please check your inbox.'
      );
      setCurrentStep('verify');
    } catch (error: any) {
      console.error('Send OTP error:', error);
      setError(error?.details || 'Failed to send OTP code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP verification
  const handleVerifyOtp = async (data: VerifyOtpFormData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.auth.verifyOtp({
        otpType: OtpType.RESET_PASSWORD,
        requestBody: {
          email: data.email,
          otp: data.otp,
        },
      });
      setOtpToken(response.token);
      setSuccessMessage(
        'OTP verified successfully! You can now set your new password.'
      );
      setCurrentStep('reset');
    } catch (error: any) {
      console.error('Verify OTP error:', error);

      setError(error?.details || 'Failed to verify OTP code');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Handle reset password
  const handleResetPassword = async (data: PasswordResetFormData) => {
    if (!otpToken) {
      setError('Invalid token. Please start the reset process again.');
      return;
    }

    if (!passwordStrength.is_strong) {
      setError('Please use a stronger password');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await api.auth.resetPassword({
        requestBody: {
          password: data.password,
          token: otpToken,
        },
      });
      setSuccessMessage(
        'Password reset successfully! You can now log in with your new password.'
      );
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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
    <AuthLayout>
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-2xl font-bold">
          {currentStep === 'request' && 'Reset Your Password'}
          {currentStep === 'verify' && 'Verify OTP Code'}
          {currentStep === 'reset' && 'Set New Password'}
        </h1>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {successMessage && (
          <p className="mb-4 text-sm text-green-500">{successMessage}</p>
        )}

        {currentStep === 'request' && (
          // Request Password Reset Form
          <form
            className="space-y-5"
            onSubmit={sendOtpForm.handleSubmit(handleRequestReset)}
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  {...sendOtpForm.register('email')}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                />
              </div>
              {sendOtpForm.formState.errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {sendOtpForm.formState.errors.email.message}
                </p>
              )}
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
        )}

        {currentStep === 'verify' && (
          // OTP Verification Form
          <form
            className="space-y-5"
            onSubmit={verifyOtpForm.handleSubmit(handleVerifyOtp)}
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                OTP Code
              </label>
              <div className="relative flex items-center">
                <input
                  {...verifyOtpForm.register('otp')}
                  type="text"
                  placeholder="Enter OTP code"
                  className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                  maxLength={6}
                />
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Enter the 6-digit code sent to {email}
              </p>
              {verifyOtpForm.formState.errors.otp && (
                <p className="mt-1 text-xs text-red-500">
                  {verifyOtpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="mt-5 w-full rounded bg-[#fabc20] px-4 py-3 text-sm font-medium text-black hover:bg-[#f5c508] active:scale-95 active:bg-[#f5c508]"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setCurrentStep('request')}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Back to Email
              </button>
            </div>
          </form>
        )}

        {currentStep === 'reset' && (
          // Reset Password Form
          <form
            className="space-y-5"
            onSubmit={passwordResetForm.handleSubmit(handleResetPassword)}
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                New Password
              </label>
              <div className="relative flex items-center">
                <input
                  {...passwordResetForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordResetForm.formState.errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordResetForm.formState.errors.password.message}
                </p>
              )}
              {password && (
                <PasswordStrengthIndicator
                  passwordStrength={passwordStrength}
                  password={password}
                />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  {...passwordResetForm.register('confirmPassword')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                />
              </div>
              {passwordResetForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordResetForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="mt-5 w-full rounded bg-[#fabc20] px-4 py-3 text-sm font-medium text-black hover:bg-[#f5c508] active:scale-95 active:bg-[#f5c508]"
                disabled={loading || !passwordResetForm.formState.isValid}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setCurrentStep('verify')}
                className="mr-4 text-sm text-gray-600 hover:text-gray-800"
              >
                Back to OTP
              </button>
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
    </AuthLayout>
  );
}
