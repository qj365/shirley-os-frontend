"use client"

import { useSearchParams } from "next/navigation"
import PasswordReset from "@/components/auth/reset"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")
  
  return (
    <PasswordReset 
      isStandalone={true} 
      token={token || ""}
      email={email || ""}
    />
  )
}