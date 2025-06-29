import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get('noteprism_session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;

    // Check if local development mode is enabled
    const isLocalDev = process.env.NEXT_PUBLIC_LOCAL_DEV_MODE === 'true';
    
    // Skip verification for local development accounts
    if (isLocalDev && user.localDevelopment) {
      return NextResponse.json({ 
        hasActiveSubscription: true,
        plan: user.plan,
        isLocalDev: true 
      });
    }

    // If user doesn't have a Stripe subscription ID, they don't have an active subscription
    if (!user.stripeSubscriptionId) {
      return NextResponse.json({ 
        hasActiveSubscription: false,
        plan: user.plan 
      });
    }

    // Check how long since last verification
    const VERIFICATION_PERIOD_DAYS = 1; // Check daily for checkout success flow
    const lastVerified = user.subscriptionVerifiedAt;
    const now = new Date();
    
    if (lastVerified) {
      const daysSinceVerification = (now.getTime() - lastVerified.getTime()) / (1000 * 60 * 60 * 24);
      
      // If recently verified and user has active plan, skip Stripe API call
      if (daysSinceVerification < VERIFICATION_PERIOD_DAYS && user.plan === 'active') {
        return NextResponse.json({ 
          hasActiveSubscription: true,
          plan: user.plan 
        });
      }
    }

    // Verify with Stripe
    try {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      const isActive = subscription.status === 'active';
      const plan = isActive ? 'active' : 'inactive';
      
      // Update user's plan and verification timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan,
          stripeSubscriptionStatus: subscription.status,
          subscriptionVerifiedAt: now,
        },
      });

      return NextResponse.json({ 
        hasActiveSubscription: isActive,
        plan,
        stripeStatus: subscription.status 
      });

    } catch (stripeError) {
      console.error('Stripe verification error:', stripeError);
      
      // If Stripe call fails, return current database state
      return NextResponse.json({ 
        hasActiveSubscription: user.plan === 'active',
        plan: user.plan,
        error: 'Could not verify with Stripe' 
      });
    }

  } catch (error) {
    console.error('Subscription verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
} 