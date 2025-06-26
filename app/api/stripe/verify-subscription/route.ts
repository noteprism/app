import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const SESSION_COOKIE_NAME = 'noteprism_session';

// How often to verify with Stripe (in days)
const VERIFICATION_PERIOD_DAYS = 31;

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'No session found' });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ success: false, message: 'Invalid or expired session' });
    }

    const user = session.user;
    const now = new Date();
    let updated = false;
    
    // Skip verification for local development mode
    const isLocalDev = process.env.NEXT_PUBLIC_LOCAL_DEV_MODE === 'true';
    if (isLocalDev) {
      return NextResponse.json({ 
        success: true, 
        updated: false,
        user: {
          id: user.id,
          plan: user.plan,
          stripeSubscriptionStatus: user.stripeSubscriptionStatus
            }
          });
    }
    
    // Handle paid users - check with Stripe only if verification date is old or missing
    if (user.plan === 'active' && user.stripeSubscriptionId) {
      // Only check with Stripe if we haven't verified in the last 31 days
      const needsVerification = !user.subscriptionVerifiedAt || 
        ((now.getTime() - new Date(user.subscriptionVerifiedAt).getTime()) > 
         (VERIFICATION_PERIOD_DAYS * 24 * 60 * 60 * 1000));
      
      if (needsVerification) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          
          // Update the verification date and subscription status
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionVerifiedAt: now,
              stripeSubscriptionStatus: subscription.status,
              // If subscription is not active, downgrade to inactive
              plan: subscription.status === 'active' ? 'active' : 'inactive'
            }
          });
          updated = true;
        } catch (error) {
          console.error(`Error verifying subscription with Stripe:`, error);
          // If we can't verify with Stripe, we'll try again next time
          return NextResponse.json({ 
            success: false, 
            message: 'Failed to verify subscription with Stripe' 
          });
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      updated,
      user: {
        id: user.id,
        plan: user.plan,
        stripeSubscriptionStatus: user.stripeSubscriptionStatus
      }
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
} 