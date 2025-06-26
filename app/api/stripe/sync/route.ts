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
          plan: 'inactive',
          stripeSubscriptionStatus: null,
          stripeSubscriptionId: null
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        plan: 'inactive'
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
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: 'active',
          stripeSubscriptionStatus: subscription.status,
          stripeSubscriptionId: subscription.id,
          subscriptionVerifiedAt: new Date()
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        plan: 'active'
      });
    } else {
      // No active subscription found
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          plan: 'inactive',
          stripeSubscriptionStatus: null,
          stripeSubscriptionId: null
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        plan: 'inactive'
      });
    }
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
} 