import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../lib/generated/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { userHasActivePlan } from '@/app/logic/plan';

const prisma = new PrismaClient();

// Ensure required environment variables are set
const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

if (!CLIENT_ID) {
  throw new Error('LINKEDIN_CLIENT_ID environment variable is not set');
}

if (!CLIENT_SECRET) {
  throw new Error('LINKEDIN_CLIENT_SECRET environment variable is not set');
}

if (!REDIRECT_URI) {
  throw new Error('LINKEDIN_REDIRECT_URI environment variable is not set');
}

const SESSION_COOKIE_NAME = 'noteprism_session';
const SESSION_EXPIRY_DAYS = 30;
const SESSION_MAX_AGE_DAYS = 30;
const BASE_URL = new URL(REDIRECT_URI).origin;

async function exchangeCodeForTokens(code: string) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  } as Record<string, string>);
  
  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!res.ok) throw new Error('Failed to exchange code for tokens');
  return res.json();
}

async function fetchUserInfo(accessToken: string) {
  const res = await fetch('https://api.linkedin.com/v2/userinfo', {
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
  const stateParam = searchParams.get('state');
  if (!code) return NextResponse.redirect(`${BASE_URL}/?error=missing_code`);

  try {
    // Parse the state parameter to get the intent
    let intent = '';
    if (stateParam) {
      try {
        const stateObj = JSON.parse(Buffer.from(stateParam, 'base64').toString());
        intent = stateObj.intent || '';
      } catch (e) {
        console.error('Error parsing state parameter:', e);
      }
    }

    // 1. Exchange code for tokens
    const { access_token } = await exchangeCodeForTokens(code);

    // 2. Fetch user info from LinkedIn
    const userInfo = await fetchUserInfo(access_token);
    const { sub: linkedinId, email, name, picture } = userInfo;
    if (!linkedinId || !email) throw new Error('Missing LinkedIn user info');

    // 3. Create or update user in DB
    let user = await prisma.user.findUnique({ where: { email } });
    let isNewUser = false;

    if (user) {
      // Link LinkedIn to existing user
      user = await prisma.user.update({
        where: { email },
        data: { linkedinId, name, profilePicture: picture },
      });
    } else {
      // Create new user with inactive plan by default
      isNewUser = true;
      user = await prisma.user.create({
        data: { 
          linkedinId, 
          email, 
          name, 
          profilePicture: picture,
          plan: 'inactive'
        },
      });
    }

    // 4. Create a secure session
    const sessionId = generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    // Store session in DB (create sessions table if not exists)
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
    let redirectUrl = `${BASE_URL}/dashboard`;
    
    // Check if we need to enable local development mode
    const localDevMode = process.env.NEXT_PUBLIC_LOCAL_DEV_MODE === 'true';
    if (localDevMode && isNewUser) {
      // For local development, set the plan to active
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          plan: 'active',
          localDevelopment: true
        }
      });
    }
    
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
      path: '/',
    });
    return response;
  } catch (err) {
    console.error('LinkedIn auth error:', err);
    return NextResponse.redirect(`${BASE_URL}/?error=auth_failed`);
  }
} 