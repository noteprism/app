import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/lib/generated/prisma';

// Ensure we have the Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(stripeSecretKey);
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Get session cookie
  const sessionId = req.cookies.get('noteprism_session')?.value;
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Find user by session
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user;

  // Check if user has a Stripe customer ID
  if (!user.stripeCustomerId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?no_subscription=1`);
  }

  try {
    // Create a billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard`,
    });

    // Redirect to the billing portal
    return NextResponse.redirect(portalSession.url);
  } catch (error) {
    console.error('Error creating billing portal:', error);
    return NextResponse.json({ error: 'Failed to access billing portal' }, { status: 500 });
  }
}
