import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID environment variable is not set');
  }
  
  if (!redirectUri) {
    throw new Error('GOOGLE_REDIRECT_URI environment variable is not set');
  }
  
  const state = Math.random().toString(36).substring(2); // Simple random state
  const scope = 'openid+profile+email';

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}&prompt=select_account`;

  return NextResponse.redirect(authUrl);
} 