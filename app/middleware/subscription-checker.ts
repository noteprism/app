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

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null; // Invalid or expired session
    }

    const user = session.user as unknown as User;
    const now = new Date();
    
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
        console.log(`Updated user ${user.id} from trial to free plan due to expired trial`);
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
          console.log(`Updated user ${user.id} from trial to free plan due to calculated trial expiration`);
        } 
        // Otherwise, set the trial end date
        else {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              trialEndsAt
            }
          });
          console.log(`Set trial end date for user ${user.id} to ${trialEndsAt}`);
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
          console.log(`Marked user ${user.id} as trial ending soon`);
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
        console.log(`Verifying subscription for user ${user.id} with Stripe`);
        
        try {
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          
          // Update the verification date and subscription status
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionVerifiedAt: now,
              stripeSubscriptionStatus: subscription.status,
              // If subscription is not active, downgrade to free
              plan: subscription.status === 'active' ? 'paid' : 'free'
            } as any // Type assertion to bypass TypeScript checking
          });
          
          console.log(`Updated subscription status for user ${user.id} to ${subscription.status}`);
        } catch (error) {
          console.error(`Error verifying subscription with Stripe:`, error);
          // If we can't verify with Stripe, we'll try again next time
        }
      }
    }
    
    return null; // Continue with the request
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return null; // Continue with the request despite error
  }
} 