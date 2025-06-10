import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../lib/generated/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const prisma = new PrismaClient();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
const SESSION_COOKIE_NAME = 'noteprism_session';
const SESSION_EXPIRY_MINUTES = 30;
const SESSION_MAX_AGE_HOURS = 24;
const BASE_URL = process.env.GOOGLE_REDIRECT_URI ? new URL(process.env.GOOGLE_REDIRECT_URI).origin : 'http://localhost:3000';

async function exchangeCodeForTokens(code: string) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID!,
    client_secret: CLIENT_SECRET!,
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) throw new Error('Failed to exchange code for tokens');
  return res.json();
}

async function fetchUserInfo(accessToken: string) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user info');
  return res.json();
}

function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  if (!code) return NextResponse.redirect(`${BASE_URL}/?error=missing_code`);

  try {
    // 1. Exchange code for tokens
    const { access_token } = await exchangeCodeForTokens(code);

    // 2. Fetch user info from Google
    const userInfo = await fetchUserInfo(access_token);
    const { sub: googleId, email, name, picture } = userInfo;
    if (!googleId || !email) throw new Error('Missing Google user info');

    // 3. Check if the email already exists with a LinkedIn account
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      // Update the existing user with Google ID
      user = await prisma.user.update({
        where: { id: user.id },
        data: { 
          googleId,
          // Only update these if they aren't already set
          name: user.name || name,
          profilePicture: user.profilePicture || picture
        }
      });
    } else {
      // Create a new user
      user = await prisma.user.create({
        data: { 
          googleId, 
          email, 
          name, 
          profilePicture: picture 
        }
      });
    }

    // 4. Create a secure session
    const sessionId = generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_EXPIRY_MINUTES * 60 * 1000);
    
    // Store session in DB
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        createdAt: now,
        expiresAt,
        lastActiveAt: now,
      },
    });

    // 5. Set secure, HTTPOnly cookie
    const response = NextResponse.redirect(`${BASE_URL}/`);
    response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_HOURS * 60 * 60,
      path: '/',
    });
    return response;
  } catch (err) {
    console.error('Google auth error:', err);
    return NextResponse.redirect(`${BASE_URL}/?error=auth_failed`);
  }
} 