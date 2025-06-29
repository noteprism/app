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
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      
      console.log(`Checkout completed - userId: ${userId}, customerId: ${customerId}, subscriptionId: ${subscriptionId}`);
      
      // Find user by userId from metadata first, then by customerId, then by email
      let user = null;
      
      if (userId) {
        user = await prisma.user.findUnique({ where: { id: userId } });
        console.log(`Found user by userId: ${user?.id}`);
      }
      
      if (!user && customerId) {
        user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
        console.log(`Found user by customerId: ${user?.id}`);
      }
      
      if (!user && session.customer_details?.email) {
        user = await prisma.user.findUnique({ where: { email: session.customer_details.email } });
        console.log(`Found user by email: ${user?.id}`);
      }
      
      if (!user) {
        console.error('No user found for checkout session');
        return new NextResponse('User not found', { status: 400 });
      }
      
      // Update user with customer ID if not set
      if (customerId && !user.stripeCustomerId) {
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId }
        });
      }
      
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            plan: 'active',
            stripeSubscriptionId: subscriptionId,
            stripeSubscriptionStatus: subscription.status,
            stripePriceId: subscription.items.data[0]?.price.id,
            subscriptionVerifiedAt: new Date()
          },
        });
        
        console.log(`User ${user.id} subscription created with status ${subscription.status} - set to ACTIVE`);
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