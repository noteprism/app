import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Get the intent from the query string
  const url = new URL(req.url);
  const intent = url.searchParams.get('intent') || '';
  
  // Store the intent in the session for later use
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || '';
  
  // Create the OAuth URL with the state parameter containing the intent
  const state = Buffer.from(JSON.stringify({ intent })).toString('base64');
  
  const linkedinAuthUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
  linkedinAuthUrl.searchParams.append('client_id', process.env.LINKEDIN_CLIENT_ID || '');
  linkedinAuthUrl.searchParams.append('redirect_uri', redirectUri);
  linkedinAuthUrl.searchParams.append('response_type', 'code');
  linkedinAuthUrl.searchParams.append('scope', 'r_liteprofile r_emailaddress');
  linkedinAuthUrl.searchParams.append('state', state);
  
  return NextResponse.redirect(linkedinAuthUrl.toString());
} 