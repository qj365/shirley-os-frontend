"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { sdk } from "@/config"
import { FetchError } from "@medusajs/js-sdk"
import { handleAuthAction } from "@/services/auth-service";

interface LoginProps {
  onLoginSuccess?: () => void
}

function Login({ onLoginSuccess }: LoginProps) {
  // State hooks for form fields, error handling, and loading state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      // Configure token expiration based on remember me setting
      const tokenExpiresIn = rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined; // 30 days in milliseconds
      
      // Login using Medusa SDK directly
      const token = await sdk.auth.login("customer", "emailpass", {
        email,
        password,
        tokenExpiresIn, // Pass the token expiration time
      });
      
      // Handle third-party authentication if needed
      if (typeof token !== "string") {
        throw new Error("Third-party authentication not supported in this flow");
      }
      
      // Get customer data
      const { customer } = await sdk.store.customer.retrieve();
      
      // Store user info in session storage if needed
      if (customer) {
        localStorage.setItem("user_email", customer.email);
        localStorage.setItem("customer_id", customer.id);
      }
      
      setSuccessMessage("Login successful. Redirecting...");
      
      handleAuthAction(router, {
        action: 'login',
        onSuccess: onLoginSuccess
      });
    } catch (error: unknown) {
      console.error("Login error:", error)
      
      if (error instanceof FetchError) {
        setError(`Login failed: ${error.message}`)
      } else if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Store current path as referrer when component mounts
  useEffect(() => {
    // Store the current URL as the referrer (excluding login/signup pages)
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/signup') {
        sessionStorage.setItem("login_referrer", currentPath)
      }
    }
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
        <div className="w-full lg:w-1/2 p-8 pt-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
            
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 text-sm text-slate-900 font-medium block">Email</label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 pr-10 bg-[#f0f1f2] placeholder:text-gray-500 focus:bg-transparent w-full text-sm font-semibold text-black border outline-[#007bff] rounded transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 text-sm text-slate-900 font-medium block">Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-3 pr-10 bg-[#f0f1f2] focus:bg-transparent w-full text-sm font-semibold text-black border outline-[#007bff] rounded transition-all placeholder:text-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link 
                    href="/reset-password"
                    className="font-medium text-yellow-500 hover:text-yellow-600"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="py-3 px-4 mt-5 w-full text-sm font-medium bg-[#fabc20] hover:bg-[#f5c508] text-black rounded active:bg-[#f5c508] active:scale-95"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>

              <div className="text-center mt-5">
                <p className="text-md font-bold text-gray-900">
                  Not a member?{" "}
                  <Link href="/signup" className="text-[#fabc20] hover:cursor-pointer hover:underline">
                    Signup Now
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

export default Login
