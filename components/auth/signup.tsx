"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { sdk } from "@/config"
import { FetchError } from "@medusajs/js-sdk"
import PasswordStrengthIndicator from "./PasswordStrengthIndicator"
import { getPasswordStrength, handleAuthAction, requestVerificationCode, verifyCode } from "@/services/auth-service";

interface SignupProps {
  onSignupSuccess?: () => void // Function to call after successful signup
}

function Signup({ onSignupSuccess }: SignupProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State hooks for form fields, error handling, and loading state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isEmailPrefilled, setIsEmailPrefilled] = useState(false)

  // Verification code state
  const [currentStep, setCurrentStep] = useState(1) // 1: Registration form, 2: Verification code
  const [verificationCode, setVerificationCode] = useState("") 
  const [countdown, setCountdown] = useState(0) // Countdown in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(false)
  // Track if user has already been registered
  //const [isUserRegistered, setIsUserRegistered] = useState(false)

  // Password strength validation
  const passwordStrength = getPasswordStrength(password)

  // Clear error when user starts typing in any field
  const clearError = () => {
    if (error) setError("")
    if (successMessage) setSuccessMessage("")
  }

  // Handle URL parameters for email prefilling
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      setIsEmailPrefilled(true)
    }
  }, [searchParams])

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // Format countdown time as MM:SS
  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Request verification code
  const requestVerificationCodeHandler = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Basic validation
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        setLoading(false);
        return
      }
  
      // Call the verification code service
      await requestVerificationCode(email, firstName);
      
      // Move to verification step
      setCurrentStep(2);
      
      // Set success message
      setSuccessMessage("Verification code sent to your email");
      
      // Start countdown for resend (2 minutes = 120 seconds)
      setCountdown(120);
      setIsResendDisabled(true);
    } catch (error) {
      console.error("Verification code request error:", error)
      
      if (error instanceof FetchError) {
        setError(`Failed to send verification code: ${error.message}`)
      } else if (error instanceof Error) {
        setError(`Error: ${error.message}`)
      } else {
        setError("Failed to send verification code. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Resend verification code
  const resendVerificationCodeHandler = async () => {
    if (isResendDisabled) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Call the verification code service again
      await requestVerificationCode(email, firstName);
      
      // Set success message
      setSuccessMessage("Verification code resent to your email");
      
      // Reset countdown
      setCountdown(120);
      setIsResendDisabled(true);
    } catch (error) {
      console.error("Resend code error:", error);
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Verify code and complete registration
  const verifyCodeAndComplete = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Verify the code
      await verifyCode(email, verificationCode);
      
      // Now register the user with Medusa auth system
      await sdk.auth.register("customer", "emailpass", {
        email,
        password,
      });
      
      // Create the customer
      await sdk.store.customer.create({
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber,
      });

      // Explicitly log in to establish the session
      await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      });

      // Retrieve the newly logged-in customer's data
      const { customer } = await sdk.store.customer.retrieve();
      
      // Store user info in localStorage to match the SDK config
      if (customer) {
        localStorage.setItem("user_email", customer.email);
        localStorage.setItem("customer_id", customer.id);
      }
      
      // Show success message
      setSuccessMessage("Account created successfully. Redirecting...");
      
      // Call the onSignupSuccess callback if provided
      if (onSignupSuccess) {
        onSignupSuccess();
      }
      
      // Handle auth action and redirection
      handleAuthAction(router, {
        action: 'signup',
        onSuccess: onSignupSuccess
      });
    } catch (error) {
      console.error("Verification error:", error);
      
      if (error instanceof FetchError) {
        setError(`${error.message}`)
      } else if (error instanceof Error) {
        setError(`Error: ${error.message}`)
      } else {
        setError("Verification failed. Please try again.")
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep === 1) {
      await requestVerificationCodeHandler();
    } else {
      await verifyCodeAndComplete();
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Back to home arrow */}
      <div className="p-4 absolute z-10">
        <Link href="/" className="flex items-center text-gray-600 hover:text-black transition-colors">
          <ArrowLeft size={20} />
          <span className="ml-2">Back to home</span>
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col md:flex-row h-screen">
        {/* Form section */}
        <div className="w-full lg:w-1/2 p-8 pt-16 md:pt-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6">
              {currentStep === 1 ? "Create Account" : "Verify Your Email"}
            </h1>
            
            {error && (
              <div className="bg-red-50 rounded-md p-4 mb-4">
                <div className="text-red-600 text-sm font-medium">{error}</div>
              </div>
            )}
            
            {successMessage && (
              <p className="text-green-500 text-sm mb-4">{successMessage}</p>
            )}
            
            <form className="space-y-4" onSubmit={handleSignup}>
              {currentStep === 1 ? (
                // Step 1: Registration Form
                <>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="w-full">
                      <label className="mb-1 text-sm text-slate-900 font-medium block">First Name</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value)
                            clearError()
                          }}
                          className="px-4 py-2 pr-10 bg-[#f0f1f2] focus:bg-transparent w-full text-sm font-semibold text-black border border-gray-300 outline-none rounded transition-all placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <label className="mb-1 text-sm text-slate-900 font-medium block">Last Name</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value)
                            clearError()
                          }}
                          className="px-4 py-2 pr-10 bg-[#f0f1f2] focus:bg-transparent w-full text-sm font-semibold text-black border border-gray-300 outline-none rounded transition-all placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 text-sm text-slate-900 font-medium block">Email</label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          clearError()
                        }}
                        readOnly={isEmailPrefilled}
                        className={`px-4 py-2 pr-10 w-full text-sm font-semibold text-black border border-gray-300 outline-none rounded transition-all placeholder:text-gray-500 ${
                          isEmailPrefilled 
                            ? 'bg-gray-50 cursor-not-allowed' 
                            : 'bg-[#f0f1f2] focus:bg-transparent'
                        }`}
                        required
                      />
                      {isEmailPrefilled && (
                        <div className="absolute right-3 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          From order
                        </div>
                      )}
                    </div>
                    {isEmailPrefilled && (
                      <p className="text-xs text-gray-500 mt-1">
                        Email from your recent order. Need to change it? <button type="button" onClick={() => { setIsEmailPrefilled(false); setEmail(''); }} className="text-blue-600 hover:underline">Click here</button>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 text-sm text-slate-900 font-medium block">Phone Number</label>
                    <div className="relative flex items-center">
                      <input
                        type="tel"
                        placeholder="Enter Phone Number"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                          clearError()
                        }}
                        className="px-4 py-2 pr-10 bg-[#f0f1f2] focus:bg-transparent w-full text-sm font-semibold text-black border border-gray-300 outline-none rounded transition-all placeholder:text-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 text-sm text-slate-900 font-medium block">Password</label>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          clearError()
                        }}
                        className="px-4 py-2 pr-10 bg-[#f0f1f2] focus:bg-transparent w-full text-sm font-semibold text-black border border-gray-300 outline-none rounded transition-all placeholder:text-gray-500"
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
                    {/* Password Strength Indicator */}
                    <PasswordStrengthIndicator 
                      passwordStrength={passwordStrength} 
                      password={password} 
                    />
                  </div>

                  <div>
                    <label className="mb-1 text-sm text-slate-900 font-medium block">Confirm Password</label>
                    <div className="relative flex items-center">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          clearError()
                        }}
                        className={`px-4 py-2 pr-10 bg-[#f0f1f2] focus:bg-transparent w-full text-sm font-semibold text-black border outline-none rounded transition-all placeholder:text-gray-500 ${
                          confirmPassword && password === confirmPassword ? 'border-green-500' :
                          confirmPassword && password !== confirmPassword ? 'border-red-500' :
                          'border-gray-300'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 text-gray-500 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                    )}
                    {confirmPassword && password === confirmPassword && (
                      <p className="text-green-500 text-xs mt-1">Passwords match</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 shrink-0" required />
                    <label className="text-sm text-slate-900 ml-3">I agree to the Terms and Conditions</label>
                  </div>
                </>
              ) : (
                // Step 2: Verification Code
                <>
                  <div className="text-center mb-6">
                    <p className="text-gray-600 mb-4">
                      We&apos;ve sent a verification code to <span className="font-semibold">{email}</span>.
                      Please enter the code below to verify your email address.
                    </p>
                  </div>
                  
                  <div>
                    <label className="mb-1 text-sm text-slate-900 font-medium block">Verification Code</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="Enter verification code"
                        value={verificationCode}
                        onClick={() => clearError()}
                        onChange={(e) => {
                          setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))
                          clearError()
                        }}
                        className="px-4 py-2 bg-[#f0f1f2] focus:bg-transparent w-full text-sm font-semibold text-black border border-gray-300 outline-none rounded transition-all placeholder:text-gray-500"
                        required
                        maxLength={6}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Didn&apos;t receive the code?
                    </p>
                    <button
                      type="button"
                      onClick={
                        async () => {
                          await resendVerificationCodeHandler()
                          clearError()
                        }
                      }
                      disabled={isResendDisabled}
                      className={`text-sm font-medium ${isResendDisabled ? 'text-gray-400' : 'text-[#fabc20] hover:underline'}`}
                    >
                      {isResendDisabled 
                        ? `Resend code in ${formatCountdown()}` 
                        : "Resend verification code"}
                    </button>
                  </div>
                </>
              )}

              <button
                type="submit"
                className={`px-5 py-2.5 w-full mt-6 text-sm font-medium rounded transition-all ${
                  loading || (currentStep === 1 && (password !== confirmPassword || !confirmPassword))
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#fabc20] hover:bg-[#f5c508] text-black active:bg-[#f5c508] active:scale-95 hover:cursor-pointer'
                }`}
                disabled={loading || !!successMessage || 
                  (currentStep === 1 && (password !== confirmPassword || !confirmPassword)) ||
                  (currentStep === 2 && verificationCode.length < 4)}
              >
                {loading 
                  ? (currentStep === 1 ? "Processing..." : "Verifying...") 
                  : (currentStep === 1 ? "Continue" : "Verify & Create Account")}
              </button>

              <div className="text-center mt-4">
                <p className="text-md font-bold text-gray-900">
                  Already a member?{" "}
                  <Link href="/login" className="text-[#fabc20] hover:cursor-pointer hover:underline">
                    Login Now
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Image section */}
        <div className="w-full lg:w-1/2 hidden lg:block relative">
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
  )
}

export default Signup
