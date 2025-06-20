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
      const customerId = session.customer as string;
      
      if (!userId) return new NextResponse('Missing userId', { status: 400 });
      
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        
        // Determine if the subscription is in trial
        const isTrialing = subscription.status === 'trialing';
        const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;
        
        await prisma.user.update({
          where: { id: userId },
          data: { 
            plan: 'standard',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripeSubscriptionStatus: subscription.status,
            stripePriceId: priceId,
            trialEndsAt: trialEnd,
            trialEndingSoon: false
          },
        });
        
        console.log(`User ${userId} subscription created with status ${subscription.status}`);
      }
    }
    
    // Handle customer.subscription.created event
    if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      // Find user by customer ID
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
      });
      
      if (user) {
        // Determine if the subscription is in trial
        const isTrialing = subscription.status === 'trialing';
        const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: 'standard',
            stripeSubscriptionId: subscription.id,
            stripeSubscriptionStatus: subscription.status,
            stripePriceId: subscription.items.data[0]?.price.id,
            trialEndsAt: trialEnd
          }
        });
        
        console.log(`User ${user.id} subscription created with status ${subscription.status}`);
      } else {
        // If user not found by customer ID, try to find by metadata
        try {
          const customer = await stripe.customers.retrieve(customerId as string) as Stripe.Customer;
          const userId = customer.metadata?.userId;
          
          if (userId) {
            // Determine if the subscription is in trial
            const isTrialing = subscription.status === 'trialing';
            const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;
            
            await prisma.user.update({
              where: { id: userId },
              data: {
                plan: 'standard',
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscription.id,
                stripeSubscriptionStatus: subscription.status,
                stripePriceId: subscription.items.data[0]?.price.id,
                trialEndsAt: trialEnd
              }
            });
            
            console.log(`User ${userId} found by metadata and subscription created with status ${subscription.status}`);
          }
        } catch (error) {
          console.error('Error retrieving customer:', error);
        }
      }
    }
    
    // Handle subscription updated/deleted
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
      });
      
      if (user) {
        const status = subscription.status;
        const plan = status === 'active' || status === 'trialing' ? 'standard' : 'free';
        const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan,
            stripeSubscriptionStatus: status,
            stripePriceId: subscription.items.data[0]?.price.id,
            trialEndsAt: trialEnd
          }
        });
        
        console.log(`User ${user.id} subscription updated to ${plan} plan with status ${status}`);
      }
    }
    
    // Handle trial ending soon
    if (event.type === 'customer.subscription.trial_will_end') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
      });
      
      if (user) {
        // Here you would typically send an email to the user
        // This is where you'd integrate with your email service
        console.log(`Trial ending soon for user ${user.id}, subscription ${subscription.id}`);
        
        // Update user record to indicate trial ending soon
        await prisma.user.update({
          where: { id: user.id },
          data: { trialEndingSoon: true }
        });
      }
    }
    
    // Handle invoice payment succeeded
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as any;
      const customerId = invoice.customer as string;
      const subscriptionId = invoice.subscription as string;
      
      if (subscriptionId) {
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId }
        });
        
        if (user) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;
          
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'standard',
              stripeSubscriptionStatus: subscription.status,
              stripeSubscriptionId: subscriptionId,
              trialEndsAt: trialEnd,
              trialEndingSoon: false // Reset the trial ending soon flag
            }
          });
          
          console.log(`User ${user.id} payment succeeded, subscription confirmed`);
        }
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
            plan: 'free',
            stripeSubscriptionStatus: 'canceled',
            trialEndsAt: null,
            trialEndingSoon: false
          }
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