import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/lib/generated/prisma';
import { cookies } from 'next/headers';

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
  if (!sessionId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Find user by session
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Prevent duplicate upgrade for already paid users
  if (session.user.plan === 'standard') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?already_upgraded=1`);
  }

  // Clear the upgrade intent cookie (if present)
  const c = await cookies();
  c.delete('noteprism_upgrade_intent');

  // Create Stripe Checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: session.user.email,
    line_items: [
      {
        price: 'price_1RZFRIK0jvA0kTsfXyv67IID',
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/?checkout=cancel`,
    metadata: {
      userId: session.user.id,
    },
  });

  // Redirect to Stripe Checkout
  return NextResponse.redirect(checkoutSession.url!);
} 