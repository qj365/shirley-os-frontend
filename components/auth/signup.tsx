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
import { ArrowLeft, Clock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AuthLayout from './AuthLayout';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { toastErrorMessage } from '@/utils/helpers/toastErrorMesage';

interface SignupProps {
  onSignupSuccess?: () => void;
}

function Signup({ onSignupSuccess }: SignupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form states
  const [currentStep, setCurrentStep] = useState<
    'sendOtp' | 'verifyOtp' | 'signup'
  >('sendOtp');
  const [loading, setLoading] = useState(false);

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
    } catch (err: unknown) {
      toastErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isResendDisabled) return;

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
      toast.success('OTP resent successfully!');
    } catch (err: unknown) {
      toastErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (data: VerifyOtpFormData) => {
    setLoading(true);

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

      toast.success('OTP verified successfully!');
    } catch (err: unknown) {
      toastErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete Signup
  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);

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

      toast.success('Account created successfully!');

      // Call success callback if provided
      if (onSignupSuccess) {
        onSignupSuccess();
      }

      // Redirect to login or dashboard
      router.push('/login');
    } catch (err: unknown) {
      toastErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  // Go back to previous step
  const goBack = () => {
    if (currentStep === 'verifyOtp') {
      setCurrentStep('sendOtp');
      setCountdown(0);
      setIsResendDisabled(false);
    } else if (currentStep === 'signup') {
      setCurrentStep('verifyOtp');
    }

    setSuccessMessage('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {currentStep === 'sendOtp' && 'Sign Up'}
            {currentStep === 'verifyOtp' && 'Verify Your Email'}
            {currentStep === 'signup' && 'Complete Your Profile'}
          </h1>
          <p className="text-sm text-gray-600">
            {currentStep === 'sendOtp' &&
              'Enter your email to receive a verification code'}
            {currentStep === 'verifyOtp' &&
              'We sent a verification code to your email'}
            {currentStep === 'signup' && 'Complete your account details'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                currentStep === 'sendOtp'
                  ? 'bg-[#fabc20] text-white'
                  : currentStep === 'verifyOtp' || currentStep === 'signup'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}
            >
              1
            </div>
            <div
              className={`h-1 w-16 ${
                currentStep === 'verifyOtp' || currentStep === 'signup'
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            ></div>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                currentStep === 'verifyOtp'
                  ? 'bg-orange-500 text-white'
                  : currentStep === 'signup'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}
            >
              2
            </div>
            <div
              className={`h-1 w-16 ${
                currentStep === 'signup' ? 'bg-green-500' : 'bg-gray-300'
              }`}
            ></div>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                currentStep === 'signup'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div>
          {/* Back Button */}
          {currentStep !== 'sendOtp' && (
            <button
              onClick={goBack}
              className="mb-6 flex items-center text-gray-600 transition-colors hover:text-gray-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          )}

          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Step 1: Send OTP Form */}
          {currentStep === 'sendOtp' && (
            <form
              onSubmit={sendOtpForm.handleSubmit(handleSendOtp)}
              className="space-y-4"
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-900">
                  Email Address
                </label>
                <input
                  {...sendOtpForm.register('email')}
                  placeholder="Email Address"
                  className="w-full rounded border border-gray-300 bg-[#f0f1f2] px-4 py-2 text-sm font-semibold text-black transition-all outline-none placeholder:text-gray-500 focus:bg-transparent"
                />
                {sendOtpForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {sendOtpForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#fabc20] px-4 py-3 font-semibold text-black transition-colors hover:bg-[#f5c508] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {/* Step 2: Verify OTP Form */}
          {currentStep === 'verifyOtp' && (
            <form
              onSubmit={verifyOtpForm.handleSubmit(handleVerifyOtp)}
              className="space-y-4"
            >
              <div className="mb-6 text-center">
                <p className="mb-2 text-sm text-gray-600">
                  We sent a OTP code to <strong>{formData.email}</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Please check your email and enter the code below
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-900">
                  Verification Code
                </label>
                <input
                  {...verifyOtpForm.register('otp')}
                  type="text"
                  placeholder="Enter OTP code"
                  maxLength={6}
                  className="w-full rounded border border-gray-300 bg-[#f0f1f2] px-4 py-2 text-center text-lg font-semibold tracking-widest text-black transition-all outline-none placeholder:text-sm placeholder:text-gray-500 focus:bg-transparent"
                />
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#fabc20] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#f5c508] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          )}

          {/* Step 3: Complete Signup Form */}
          {currentStep === 'signup' && (
            <form
              onSubmit={signupForm.handleSubmit(handleSignup)}
              className="space-y-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium text-slate-900">
                    First Name
                  </label>
                  <input
                    {...signupForm.register('firstName')}
                    placeholder="First Name"
                    className="w-full rounded border border-gray-300 bg-[#f0f1f2] px-4 py-2 text-sm font-semibold text-black transition-all outline-none placeholder:text-gray-500 focus:bg-transparent"
                  />
                  {signupForm.formState.errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">
                      {signupForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className="mb-1 block text-sm font-medium text-slate-900">
                    Last Name
                  </label>
                  <input
                    {...signupForm.register('lastName')}
                    placeholder="Last Name"
                    className="w-full rounded border border-gray-300 bg-[#f0f1f2] px-4 py-2 text-sm font-semibold text-black transition-all outline-none placeholder:text-gray-500 focus:bg-transparent"
                  />
                  {signupForm.formState.errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">
                      {signupForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-900">
                  Phone Number
                </label>
                <input
                  {...signupForm.register('phoneNumber')}
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full rounded border border-gray-300 bg-[#f0f1f2] px-4 py-2 text-sm font-semibold text-black transition-all outline-none placeholder:text-gray-500 focus:bg-transparent"
                />
                {signupForm.formState.errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {signupForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-900">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...signupForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full rounded border border-gray-300 bg-[#f0f1f2] px-4 py-2 pr-10 text-sm font-semibold text-black transition-all outline-none placeholder:text-gray-500 focus:bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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

              <button
                type="submit"
                disabled={loading || !passwordStrength.is_strong}
                className="w-full rounded-lg bg-[#fabc20] px-4 py-3 font-semibold text-black transition-colors hover:bg-[#f5c508] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-[#fabc20] hover:text-[#f5c508]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Signup;
