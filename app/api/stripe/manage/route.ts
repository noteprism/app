import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/lib/generated/prisma';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
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

  // Check if user has a Stripe customer ID
  if (!session.user.stripeCustomerId) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 400 });
  }

  try {
    // Create a Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: session.user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard`,
    });

    // Redirect to the customer portal
    return NextResponse.redirect(portalSession.url);
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
} 