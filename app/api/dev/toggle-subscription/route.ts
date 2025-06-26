import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// This route is for local development only
export async function POST(req: NextRequest) {
  // Check if we're in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'This route is only available in development mode' }, { status: 403 });
  }

  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('noteprism_session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    
    if (!session || session.expiresAt <= new Date()) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }
    
    const user = session.user;
    
    // Toggle the plan status
    const newPlan = user.plan === 'active' ? 'inactive' : 'active';
    
    // Update the user with type assertion to bypass TypeScript checking
    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: newPlan,
        localDevelopment: true,
      } as any,
    });
    
    return NextResponse.json({
      success: true,
      message: `Subscription toggled to ${newPlan}`,
      plan: newPlan,
    });
  } catch (error) {
    console.error('Error toggling subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 