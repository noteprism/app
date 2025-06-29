'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CheckoutSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // If we have a session ID, do a quick verification and redirect
    if (sessionId) {
      // Quick verification call but don't wait for it
      fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      }).catch(() => {
        // Ignore errors - just redirect anyway
      });

      // Redirect to dashboard immediately after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      // No session ID - just redirect immediately
      router.push('/dashboard');
    }
  }, [sessionId, router]);

  // Show a simple success message while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}