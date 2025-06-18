import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/lib/generated/prisma';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get user from session
    const sessionId = req.cookies.get('noteprism_session')?.value;
    if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const user = session.user;
    
    // If user doesn't have a Stripe customer ID, they don't have a subscription
    if (!user.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          plan: 'free',
          stripeSubscriptionStatus: null,
          stripeSubscriptionId: null,
          stripePriceId: null
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        plan: 'free', 
        message: 'User has no Stripe customer ID, set to free plan' 
      });
    }
    
    // User has a customer ID, check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1
    });
    
    if (subscriptions.data.length > 0) {
      // User has an active subscription
      const subscription = subscriptions.data[0];
      const priceId = subscription.items.data[0]?.price.id;
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: 'standard',
          stripeSubscriptionStatus: subscription.status,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        plan: 'standard', 
        message: 'User has active subscription, set to standard plan'
      });
    } else {
      // No active subscription found
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          plan: 'free',
          stripeSubscriptionStatus: null,
          stripeSubscriptionId: null,
          stripePriceId: null
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        plan: 'free', 
        message: 'No active subscription found, set to free plan' 
      });
    }
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
} 