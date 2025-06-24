import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../lib/generated/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import * as z from 'zod';
import { TRIAL_PERIOD_DAYS } from '@/app/logic/plan';

const prisma = new PrismaClient();

const SESSION_COOKIE_NAME = 'noteprism_session';
const SESSION_EXPIRY_DAYS = 30; // 30 day session expiration
const SESSION_MAX_AGE_DAYS = 30; // 30 day cookie
const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

// Input validation schema
const connectSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  intent: z.string().optional(),
});

function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

// Hash password function
function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const result = connectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    const { email, password, intent } = result.data;
    const hashedPassword = hashPassword(password);
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });
    
    let isNewUser = false;
    
    if (user) {
      // Check if user has a password (in case they previously logged in with social)
      if (!user.password) {
        // First time logging in with email, set password
        user = await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
      } else if (user.password !== hashedPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    } else {
      // Create new user
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: email.split('@')[0], // Default name from email
        }
      });
    }
    
    // Create session
    const sessionId = generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        createdAt: now,
        expiresAt,
        lastActiveAt: now,
      },
    });
    
    // Handle trial activation
    let redirectPath = '';
    
    if (intent === 'trial' || isNewUser) {
      // Set trial period for the user if not already set
      if (!user.trialEndsAt) {
        const trialEndsAt = new Date(now.getTime() + TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000);
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            trialEndsAt,
            plan: 'trial' // Set plan to trial during trial
          }
        });
      }
      redirectPath = '/trial-activated';
    }
    
    // Set cookie and return response
    const response = NextResponse.json({ 
      success: true,
      redirectPath
    });
    
    response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Email connection error:', error);
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 });
  }
} 