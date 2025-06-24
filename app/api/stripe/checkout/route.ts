import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/lib/generated/prisma';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  return handleCheckout(req);
}

export async function GET(req: NextRequest) {
  return handleCheckout(req);
}

async function handleCheckout(req: NextRequest) {
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
    
    // Ensure user has a Stripe customer ID
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id }
      });
      
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });
    }
    
    // Check if user already has an active subscription
    if (user.stripeSubscriptionId && user.stripeSubscriptionStatus === 'active') {
      // Redirect to the billing portal to manage existing subscription
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard`,
      });
      
      return NextResponse.redirect(portalSession.url);
    }
    
    // Create checkout session without trial period since we handle it ourselves
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [{ 
        price: 'price_1RcXSgK0jvA0kTsf1gcrQDUn', // New price ID without trial
        quantity: 1 
      }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/?checkout=cancel`,
      metadata: { userId: user.id },
    });

    // Return URL based on request method
    if (req.method === 'POST') {
      return NextResponse.json({ url: checkoutSession.url });
    }
    
    // Ensure we have a valid URL before redirecting
    if (!checkoutSession.url) {
      throw new Error('No checkout URL returned from Stripe');
    }
    
    return NextResponse.redirect(checkoutSession.url);
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
} 