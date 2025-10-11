"use client"

import { useRouter } from "next/navigation"
import { sdk } from "@/config"
import { handleAuthAction } from "@/services/auth-service";

interface LogoutProps {
  onLogoutSuccess?: () => void
  textColor?: string
}

export default function Logout({ onLogoutSuccess, textColor = "text-gray-700 hover:text-gray-900" }: LogoutProps = {}) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Logout using Medusa SDK
      await sdk.auth.logout();
      
      // Clear user data from both sessionStorage and localStorage
      sessionStorage.removeItem("user_email");
      sessionStorage.removeItem("customer_id");
      localStorage.removeItem("user_email");
      localStorage.removeItem("customer_id");
      
      // Also clear the custom auth token we set in config.ts
      localStorage.removeItem("shirleys_auth_token");
      
      // Use the simplified auth action handler
      handleAuthAction(router, {
        action: 'logout',
        onSuccess: onLogoutSuccess
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className={`text-sm font-medium ${textColor}`}
    >
      Logout
    </button>
  )
}