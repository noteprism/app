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
    
    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: session.user.email,
      line_items: [{ price: 'price_1RZFRIK0jvA0kTsfXyv67IID', quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/?checkout=cancel`,
      metadata: { userId: session.user.id },
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