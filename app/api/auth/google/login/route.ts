import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Get the intent from the query string
  const url = new URL(req.url);
  const intent = url.searchParams.get('intent') || '';
  
  // Store the intent in the session for later use
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';
  
  // Create the OAuth URL with the state parameter containing the intent
  const state = Buffer.from(JSON.stringify({ intent })).toString('base64');
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID || '');
  googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', 'email profile');
  googleAuthUrl.searchParams.append('state', state);
  
  return NextResponse.redirect(googleAuthUrl.toString());
} 