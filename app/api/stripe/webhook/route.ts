import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/lib/generated/prisma';

// Ensure we have the required Stripe environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(stripeSecretKey);
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  
  if (!sig) {
    return new NextResponse('Missing Stripe signature', { status: 400 });
  }
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
  }
  
  let event;
  const body = await req.text();

  try {
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
      await prisma.user.update({
        where: { id: userId },
        data: { plan: 'standard' },
      });
      return new NextResponse('Success', { status: 200 });
    } catch (err) {
      console.error('Failed to update user plan:', err);
      return new NextResponse('DB Error', { status: 400 });
    }
  }

  return new NextResponse('Unhandled event', { status: 200 });
} 