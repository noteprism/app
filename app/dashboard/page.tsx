"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation';
import Dashboard from "@/components/dashboard"

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);
  
  useEffect(() => {
    async function checkAuth() {
      try {
        // Check if user is logged in and has an active subscription
        const userResponse = await fetch('/api/user');
        
        if (!userResponse.ok) {
          // Not logged in or other error
          router.push('/');
          return;
        }
        
        const userData = await userResponse.json();
        
        // Check if we're coming from a successful payment flow
        const isPostPayment = searchParams.get('subscription') === 'active';
        
        if (isPostPayment) {
          // Clear the subscription parameter from URL without reloading the page
          const url = new URL(window.location.href);
          url.searchParams.delete('subscription');
          window.history.replaceState({}, '', url);
          
          setShowSubscriptionSuccess(true);
        }
        
        // Check if user has an active plan
        const hasActivePlan = userData.subscription?.status === 'active';
        const isLocalDev = process.env.NEXT_PUBLIC_LOCAL_DEV_MODE === 'true' || userData.localDevelopment;
        
        if (!hasActivePlan && !isLocalDev && !isPostPayment) {
          // If user doesn't have an active plan and we're not in local dev mode, redirect to homepage
          router.push('/');
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push('/');
      }
    }
    
    checkAuth();
  }, [router, searchParams]);
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  return <Dashboard showSubscriptionSuccess={showSubscriptionSuccess} />;
} 