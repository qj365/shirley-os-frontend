'use client';

import { User } from 'firebase/auth';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Email Step Component
interface Props {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  validationError?: string;
  isCartEmpty: boolean;
  user: User | null;
}

const EmailInfoFormStep: React.FC<Props> = ({
  email,
  setEmail,
  onSubmit,
  validationError,
  isCartEmpty,
  user,
}) => {
  const handleLoginClick = () => {
    // Save current path to redirect back after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Contact Information</h2>
        {!user && (
          <Link
            href="/login"
            onClick={handleLoginClick}
            className="md: flex items-center gap-2 rounded-full text-sm font-semibold text-black hover:text-yellow-500 md:text-base"
          >
            Log in
          </Link>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <div
            className={`border-2 ${validationError ? 'border-red-500' : 'border-[#797979]'} rounded p-2`}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-[#797979]"
              placeholder="your@email.com"
              required
              disabled={!!user} // Disable input if logged in
            />
          </div>
          {validationError && (
            <p className="mt-1 text-sm text-red-500">{validationError}</p>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={!email || isCartEmpty}
            className="flex items-center gap-2 rounded-full border-2 border-[#FFD56A] bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] px-8 py-2 text-base font-semibold shadow-inner shadow-black/25 transition-all hover:from-[#F3C03F]/90 hover:to-[#FFBA0A]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailInfoFormStep;
