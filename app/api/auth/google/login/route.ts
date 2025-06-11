import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
  const state = Math.random().toString(36).substring(2); // Simple random state
  const scope = 'openid+profile+email';

  if (!clientId || !redirectUri) {
    return new NextResponse('Missing Google client ID or redirect URI', { status: 500 });
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}&prompt=select_account`;

  return NextResponse.redirect(authUrl);
} 