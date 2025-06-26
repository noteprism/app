import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get user from session
    const sessionId = req.cookies.get('noteprism_session')?.value;
    if (!sessionId) {
      // No session, redirect to connect page
      return NextResponse.redirect(new URL('/connect', req.url));
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    
    if (!session?.user) {
      // Invalid session, redirect to connect page
      return NextResponse.redirect(new URL('/connect', req.url));
    }
    
    // Temporarily mark the user as active until the webhook confirms the payment
    // This provides a better user experience by not showing the pricing page again
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        plan: 'active',
        subscriptionVerifiedAt: new Date()
      }
    });
    
    // Redirect to dashboard with success parameter
    return NextResponse.redirect(new URL('/dashboard?checkout=success', req.url));
  } catch (error) {
    console.error('Checkout success error:', error);
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
} 