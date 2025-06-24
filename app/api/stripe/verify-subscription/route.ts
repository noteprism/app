import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import Stripe from 'stripe';
import { TRIAL_PERIOD_DAYS } from '@/app/logic/plan';

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
    
    // Handle trial users
    if (user.plan === 'trial') {
      // If trial end date is set and it's in the past, update to free plan
      if (user.trialEndsAt && new Date(user.trialEndsAt) < now) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: 'free',
            trialEndingSoon: false
          }
        });
        updated = true;
      } 
      // If trial end date is not set, calculate based on account creation time
      else if (!user.trialEndsAt) {
        // Calculate trial end date based on account creation
        const creationDate = new Date(session.createdAt);
        const trialEndsAt = new Date(creationDate);
        trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_PERIOD_DAYS);
        
        // If calculated trial end date is in the past, update to free
        if (trialEndsAt < now) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'free',
              trialEndingSoon: false
            }
          });
          updated = true;
        } 
        // Otherwise, set the trial end date
        else {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              trialEndsAt
            }
          });
          updated = true;
        }
      }
      // Check if trial is ending within 24 hours and not already marked
      else if (!user.trialEndingSoon) {
        const trialEndDate = new Date(user.trialEndsAt);
        const oneDayFromNow = new Date();
        oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
        
        if (trialEndDate < oneDayFromNow) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              trialEndingSoon: true
            }
          });
          updated = true;
        }
      }
    }
    // Handle paid users - check with Stripe only if verification date is old or missing
    else if (user.plan === 'paid' && user.stripeSubscriptionId) {
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
              // If subscription is not active, downgrade to free
              plan: subscription.status === 'active' ? 'paid' : 'free'
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
        trialEndsAt: user.trialEndsAt,
        trialEndingSoon: user.trialEndingSoon,
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