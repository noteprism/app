import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@/lib/generated/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session ID required',
        user_activated: false 
      }, { status: 400 });
    }

    // Get the session from Stripe - this is the source of truth
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // If payment is complete in Stripe, update our database immediately
    if (session.status === 'complete' && session.payment_status === 'paid') {
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;
      
      if (userId && subscriptionId) {
        try {
          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Update user in database immediately - no race condition
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: 'active',
              stripeSubscriptionId: subscriptionId,
              stripeSubscriptionStatus: subscription.status,
              stripePriceId: subscription.items.data[0]?.price.id,
              subscriptionVerifiedAt: new Date()
            },
          });
          
          console.log(`✅ Payment verified via Stripe and user ${userId} activated immediately`);
          
          return NextResponse.json({
            success: true,
            status: session.status,
            payment_status: session.payment_status,
            user_activated: true
          });
        } catch (dbError) {
          console.error('Database update error:', dbError);
          // Still return success since Stripe payment is complete
          return NextResponse.json({
            success: true,
            status: session.status,
            payment_status: session.payment_status,
            user_activated: false,
            warning: 'Payment successful but database update failed'
          });
        }
      }
    }
    
    // Payment not complete yet in Stripe or missing metadata
    return NextResponse.json({
      success: false,
      status: session.status,
      payment_status: session.payment_status,
      user_activated: false
    });
    
  } catch (error) {
    console.error('Error checking Stripe session:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Session check failed',
      user_activated: false 
    }, { status: 500 });
  }
} 