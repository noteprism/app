import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import { TRIAL_PERIOD_DAYS } from '../logic/plan';
import Stripe from 'stripe';
import type { User } from '@/types/user';

const prisma = new PrismaClient();
const SESSION_COOKIE_NAME = 'noteprism_session';

// How often to verify with Stripe (in days)
const VERIFICATION_PERIOD_DAYS = 31;

export async function checkSubscriptionStatus(req: NextRequest) {
  try {
    const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionId) {
      return null; // No session, no user to check
    }

    // Call our API endpoint to verify the subscription
    // This runs in the Node.js runtime where Stripe can be properly initialized
    const baseUrl = req.nextUrl.origin;
    const response = await fetch(`${baseUrl}/api/stripe/verify-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `noteprism_session=${sessionId}`
      }
    });

    if (!response.ok) {
      console.error('Failed to verify subscription:', await response.text());
    }
    
    return null; // Continue with the request
  } catch (error) {
    console.error('Error in subscription checker middleware:', error);
    return null; // Continue with the request despite error
  }
} 