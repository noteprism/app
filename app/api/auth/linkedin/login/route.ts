import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const state = Math.random().toString(36).substring(2); // Simple random state
  const scope = 'openid%20profile%20email';

  if (!clientId || !redirectUri) {
    return new NextResponse('Missing LinkedIn client ID or redirect URI', { status: 500 });
  }

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

  return NextResponse.redirect(authUrl);
} 