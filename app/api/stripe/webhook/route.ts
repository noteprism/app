import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/lib/generated/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  const body = await req.text();

  try {
    if (!sig || !webhookSecret) throw new Error('Missing Stripe signature or webhook secret');
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