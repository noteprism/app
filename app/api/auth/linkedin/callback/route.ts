import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../lib/generated/prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const prisma = new PrismaClient();

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;
const SESSION_COOKIE_NAME = 'noteprism_session';
const SESSION_EXPIRY_DAYS = 30;
const SESSION_MAX_AGE_DAYS = 30;
const BASE_URL = process.env.LINKEDIN_REDIRECT_URI ? new URL(process.env.LINKEDIN_REDIRECT_URI).origin : 'http://localhost:3000';

async function exchangeCodeForTokens(code: string) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI!,
    client_id: CLIENT_ID!,
    client_secret: CLIENT_SECRET!,
  });
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
  const state = searchParams.get('state');
  if (!code) return NextResponse.redirect(`${BASE_URL}/?error=missing_code`);

  try {
    // 1. Exchange code for tokens
    const { access_token } = await exchangeCodeForTokens(code);

    // 2. Fetch user info from LinkedIn
    const userInfo = await fetchUserInfo(access_token);
    const { sub: linkedinId, email, name, picture } = userInfo;
    if (!linkedinId || !email) throw new Error('Missing LinkedIn user info');

    // 3. Create or update user in DB
    const user = await prisma.user.upsert({
      where: { linkedinId },
      update: { email, name, profilePicture: picture },
      create: { linkedinId, email, name, profilePicture: picture },
    });

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
    const response = NextResponse.redirect(`${BASE_URL}/`);
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