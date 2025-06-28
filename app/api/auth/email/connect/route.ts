import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../lib/generated/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import * as z from 'zod';

const prisma = new PrismaClient();

const SESSION_COOKIE_NAME = 'noteprism_session';
const SESSION_EXPIRY_DAYS = 30; // 30 day session expiration
const SESSION_MAX_AGE_DAYS = 30; // 30 day cookie
const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

// Input validation schema
const connectSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
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
    
    const { email, password } = result.data;
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
      
      // Handle local development mode
      const isLocalDev = process.env.NEXT_PUBLIC_LOCAL_DEV_MODE === 'true';
      
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: email.split('@')[0], // Default name from email
          plan: isLocalDev ? 'active' : 'inactive', // Set plan based on dev mode
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
    
    // Set session cookie and determine redirect URL
    const isLocalDev = process.env.NEXT_PUBLIC_LOCAL_DEV_MODE === 'true';
    let redirectPath = '/dashboard';
    
    if (isLocalDev) {
      // For local development, set the plan to active
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          plan: 'active',
          localDevelopment: true
        }
      });
      redirectPath = '/dashboard';
    } else if (user.plan === 'active') {
      redirectPath = '/dashboard';
    } else {
      // User has inactive plan, send to pricing
      redirectPath = '/pricing';
    }

    return NextResponse.json({
      success: true,
      redirectPath
    }, {
      headers: {
        'Set-Cookie': `noteprism_session=${sessionId}; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_DAYS * 24 * 60 * 60}; Path=/`
      }
    });
  } catch (error) {
    console.error('Email connection error:', error);
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 });
  }
} 