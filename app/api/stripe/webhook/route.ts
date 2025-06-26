import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/lib/generated/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new NextResponse('Missing signature', { status: 400 });
  
  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    
    console.log(`Webhook event received: ${event.type}`);
    
    // Handle checkout session completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;
      
      if (!userId) return new NextResponse('Missing userId', { status: 400 });
      
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        await prisma.user.update({
          where: { id: userId },
          data: { 
            plan: 'active',
            stripeSubscriptionId: subscriptionId,
            stripeSubscriptionStatus: subscription.status,
            stripePriceId: subscription.items.data[0]?.price.id,
            subscriptionVerifiedAt: new Date()
          },
        });
        
        console.log(`User ${userId} subscription created with status ${subscription.status}`);
      }
    }
    
    // Handle subscription updated
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
      });
      
      if (user) {
        const status = subscription.status;
        const plan = status === 'active' ? 'active' : 'inactive';
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan,
            stripeSubscriptionStatus: status,
            subscriptionVerifiedAt: new Date()
          },
        });
        
        console.log(`User ${user.id} subscription updated to ${plan} plan with status ${status}`);
      }
    }
    
    // Handle subscription deleted (canceled)
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
      });
      
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: 'inactive',
            stripeSubscriptionStatus: 'canceled',
            subscriptionVerifiedAt: new Date()
          },
        });
        
        console.log(`User ${user.id} subscription canceled`);
      }
    }
    
    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Webhook failed', { status: 400 });
  }
} 