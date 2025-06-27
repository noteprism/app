import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/lib/generated/prisma';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get the session ID from the URL
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.redirect(`${req.nextUrl.origin}/pricing?error=missing_session`);
    }
    
    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!checkoutSession || checkoutSession.payment_status !== 'paid') {
      return NextResponse.redirect(`${req.nextUrl.origin}/pricing?error=payment_incomplete`);
    }
    
    // Get the user ID from the metadata
    const userId = checkoutSession.metadata?.userId;
    
    if (!userId) {
      console.error('Missing userId in checkout session metadata');
      return NextResponse.redirect(`${req.nextUrl.origin}/pricing?error=user_not_found`);
    }
    
    // Get subscription ID
    const subscriptionId = checkoutSession.subscription as string;
    
    if (!subscriptionId) {
      console.error('No subscription ID found in checkout session');
      return NextResponse.redirect(`${req.nextUrl.origin}/pricing?error=no_subscription`);
    }
    
    // Retrieve the subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Update the user's plan status in the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'active',
        stripeSubscriptionId: subscriptionId,
        stripeSubscriptionStatus: subscription.status,
        stripePriceId: subscription.items.data[0]?.price.id,
        subscriptionVerifiedAt: new Date()
      }
    });
    
    console.log(`User ${userId} subscription activated via success URL`);
    
    // Redirect to the dashboard with a success message
    return NextResponse.redirect(`${req.nextUrl.origin}/dashboard?subscription=active`);
  } catch (error) {
    console.error('Error processing checkout success:', error);
    return NextResponse.redirect(`${req.nextUrl.origin}/pricing?error=processing_failed`);
  }
} 