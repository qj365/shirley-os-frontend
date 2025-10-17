/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  sendOtpSchema,
  signupSchema,
  verifyOtpSchema,
  type SendOtpFormData,
  type SignupFormData,
  type VerifyOtpFormData,
} from '@/lib/validations/schemas';
import { getPasswordStrength } from '@/services/auth-service';
import { api, OtpType } from '@/src/lib/api/customer';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AuthLayout from './AuthLayout';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form states
  const [currentStep, setCurrentStep] = useState<
    'sendOtp' | 'verifyOtp' | 'signup'
  >('sendOtp');
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // OTP and timer states
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  // Form data storage between steps
  const [formData, setFormData] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }>({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  // Form instances
  const sendOtpForm = useForm<SendOtpFormData>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: {
      email: '',
    },
  });

  const verifyOtpForm = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      token: '',
      firstName: '',
      lastName: '',
      password: '',
      phoneNumber: '',
    },
  });

  // Password strength validation
  const password = signupForm.watch('password');
  const passwordStrength = getPasswordStrength(password || '');

  // Handle URL parameters for email prefilling
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      sendOtpForm.setValue('email', emailParam);
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams, sendOtpForm]);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Step 1: Send OTP
  const handleSendOtp = async (data: SendOtpFormData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await api.auth.sendOtpResetPassword({
        otpType: OtpType.SIGNUP,
        requestBody: {
          email: data.email,
        },
      });

      // Store form data for next steps
      setFormData(prev => ({
        ...prev,
        email: data.email,
      }));

      // Set up verification form with email
      verifyOtpForm.setValue('email', data.email);

      // Move to next step
      setCurrentStep('verifyOtp');
      setCountdown(60); // 60 seconds countdown
      setIsResendDisabled(true);

      toast.success('OTP sent successfully! Please check your email.');
    } catch (err: any) {
      setError(err?.details || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isResendDisabled) return;

    setError('');
    setLoading(true);

    try {
      await api.auth.sendOtpResetPassword({
        otpType: OtpType.SIGNUP,
        requestBody: {
          email: formData.email,
        },
      });

      setCountdown(60);
      setIsResendDisabled(true);
      setSuccessMessage('OTP resent successfully!');
    } catch (err: any) {
      setError(err?.details || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (data: VerifyOtpFormData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await api.auth.verifyOtp({
        otpType: OtpType.SIGNUP,
        requestBody: {
          email: data.email,
          otp: data.otp,
        },
      });

      // Set up signup form with stored data
      signupForm.setValue('token', response.token);

      // Move to next step
      setCurrentStep('signup');
      setSuccessMessage('OTP verified successfully!');
    } catch (err: any) {
      setError(err?.details || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Signup
  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await api.auth.signup({
        requestBody: {
          token: data.token,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
          phoneNumber: data.phoneNumber,
        },
      });

      setSuccessMessage(
        'Account created successfully! You can now log in with your account.'
      );
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err?.details || 'Failed to signup');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-2xl font-bold">
          {currentStep === 'sendOtp' && 'Sign Up'}
          {currentStep === 'verifyOtp' && 'Verify Your Email'}
          {currentStep === 'signup' && 'Complete Your Profile'}
        </h1>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {successMessage && (
          <p className="mb-4 text-sm text-green-500">{successMessage}</p>
        )}

        {currentStep === 'sendOtp' && (
          // Send OTP Form
          <form
            className="space-y-5"
            onSubmit={sendOtpForm.handleSubmit(handleSendOtp)}
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Email Address
              </label>
              <div className="relative flex items-center">
                <input
                  {...sendOtpForm.register('email')}
                  placeholder="Enter your email"
                  className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                  required
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
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        )}

        {currentStep === 'verifyOtp' && (
          // OTP Verification Form
          <form
            className="space-y-5"
            onSubmit={verifyOtpForm.handleSubmit(handleVerifyOtp)}
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Verification Code
              </label>
              <div className="relative flex items-center">
                <input
                  {...verifyOtpForm.register('otp')}
                  type="text"
                  placeholder="Enter OTP code"
                  maxLength={6}
                  className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Enter the 6-digit code sent to {formData.email}
              </p>
              {verifyOtpForm.formState.errors.otp && (
                <p className="mt-1 text-xs text-red-500">
                  {verifyOtpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            {/* Resend OTP */}
            <div className="text-center">
              {countdown > 0 ? (
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Clock className="mr-1 h-4 w-4" />
                  Resend code in {formatTime(countdown)}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || isResendDisabled}
                  className="text-sm font-medium text-[#fabc20] hover:text-[#f5c508] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Resend Code
                </button>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="mt-5 w-full rounded bg-[#fabc20] px-4 py-3 text-sm font-medium text-black hover:bg-[#f5c508] active:scale-95 active:bg-[#f5c508]"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setCurrentStep('sendOtp')}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Back to Email
              </button>
            </div>
          </form>
        )}

        {currentStep === 'signup' && (
          // Complete Signup Form
          <form
            className="space-y-5"
            onSubmit={signupForm.handleSubmit(handleSignup)}
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  First Name
                </label>
                <div className="relative flex items-center">
                  <input
                    {...signupForm.register('firstName')}
                    placeholder="First Name"
                    className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                    required
                  />
                </div>
                {signupForm.formState.errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {signupForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-slate-900">
                  Last Name
                </label>
                <div className="relative flex items-center">
                  <input
                    {...signupForm.register('lastName')}
                    placeholder="Last Name"
                    className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                    required
                  />
                </div>
                {signupForm.formState.errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">
                    {signupForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <input
                  {...signupForm.register('phoneNumber')}
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                  required
                />
              </div>
              {signupForm.formState.errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {signupForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  {...signupForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="w-full rounded border bg-[#f0f1f2] px-4 py-3 pr-10 text-sm font-semibold text-black outline-[#007bff] transition-all placeholder:text-gray-500 focus:bg-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {signupForm.formState.errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {signupForm.formState.errors.password.message}
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
              <button
                type="submit"
                className="mt-5 w-full rounded bg-[#fabc20] px-4 py-3 text-sm font-medium text-black hover:bg-[#f5c508] active:scale-95 active:bg-[#f5c508]"
                disabled={loading || !passwordStrength.is_strong}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setCurrentStep('verifyOtp')}
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

export default Signup;
