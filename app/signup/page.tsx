'use client';

import Signup from '@/components/auth/signup';
import { Suspense } from 'react';

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <Signup />
    </Suspense>
  );
}
