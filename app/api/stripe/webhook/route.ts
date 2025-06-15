import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/lib/generated/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  const body = await req.text();

  try {
    if (!sig || !webhookSecret) throw new Error('Missing Stripe signature or webhook secret');
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new NextResponse('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (!userId) {
      console.error('No userId in session metadata');
      return new NextResponse('No userId', { status: 400 });
    }
    
    try {
      // Get subscription details
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;
      
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        
        await prisma.user.update({
          where: { id: userId },
          data: { 
            plan: 'standard',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripeSubscriptionStatus: subscription.status,
            stripePriceId: priceId
          },
        });
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: { 
            plan: 'standard',
            stripeCustomerId: customerId
          },
        });
      }
      
      return new NextResponse('Success', { status: 200 });
    } catch (err) {
      console.error('Failed to update user plan:', err);
      return new NextResponse('DB Error', { status: 400 });
    }
  }
  
  // Handle subscription updated or deleted
  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    
    try {
      // Find user by Stripe customer ID
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
      });
      
      if (!user) {
        console.error('No user found with Stripe customer ID:', customerId);
        return new NextResponse('User not found', { status: 400 });
      }
      
      // Update subscription status
      const status = subscription.status;
      const priceId = subscription.items.data[0]?.price.id;
      const plan = status === 'active' || status === 'trialing' ? 'standard' : 'free';
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan,
          stripeSubscriptionStatus: status,
          stripePriceId: priceId
        }
      });
      
      return new NextResponse('Success', { status: 200 });
    } catch (err) {
      console.error('Failed to update subscription status:', err);
      return new NextResponse('DB Error', { status: 400 });
    }
  }

  return new NextResponse('Unhandled event', { status: 200 });
} 