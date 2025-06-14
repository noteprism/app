import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  
  if (!clientId) {
    throw new Error('LINKEDIN_CLIENT_ID environment variable is not set');
  }
  
  if (!redirectUri) {
    throw new Error('LINKEDIN_REDIRECT_URI environment variable is not set');
  }
  
  const state = Math.random().toString(36).substring(2); // Simple random state
  const scope = 'openid%20profile%20email';

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

  return NextResponse.redirect(authUrl);
} 