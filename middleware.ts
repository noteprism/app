import { NextRequest, NextResponse } from 'next/server';
import { checkSubscriptionStatus } from './app/middleware/subscription-checker';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Only check subscription status when accessing the dashboard
  // Skip for login/auth endpoints
  if (path === '/dashboard') {
    // Check and update subscription status if needed
    await checkSubscriptionStatus(request);
  }
  
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/dashboard',
  ],
}; 