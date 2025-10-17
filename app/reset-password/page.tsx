'use client';

import PasswordReset from '@/components/auth/reset';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  return <PasswordReset token={token || ''} email={email || ''} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
