'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CheckoutSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      return;
    }

    let pollCount = 0;
    const maxPolls = 30;
    
    const pollSubscriptionStatus = async () => {
      try {
        const response = await fetch('/api/stripe/verify-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.hasActiveSubscription) {
            router.push('/dashboard');
            return;
          }
        }

        pollCount++;
        
        if (pollCount >= maxPolls) {
          router.push('/dashboard');
          return;
        }

        setTimeout(pollSubscriptionStatus, 1000);
        
      } catch (error) {
        console.error('Error checking subscription status:', error);
        pollCount++;
        
        if (pollCount >= maxPolls) {
          router.push('/dashboard');
          return;
        }
        
        setTimeout(pollSubscriptionStatus, 1000);
      }
    };

    setTimeout(pollSubscriptionStatus, 2000);
  }, [sessionId, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Setting up your subscription...</p>
      </div>
    </div>
  );
}