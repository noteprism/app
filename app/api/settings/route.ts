import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../lib/generated/prisma';

const prisma = new PrismaClient();

// For demo: use a hardcoded email. Replace with real auth in production.
const DEMO_EMAIL = 'demo@user.com';

export async function GET(req: NextRequest) {
  return NextResponse.json({});
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  // Remove any future references to noteStyle
  const cleanedData = { ...data };
  delete cleanedData.noteStyle;
  
  if (Object.keys(cleanedData).length === 0) {
    return NextResponse.json({});
  }
  
  // Handle other settings if needed in the future
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: cleanedData,
    create: { email: DEMO_EMAIL, ...cleanedData },
  });
  
  return NextResponse.json({});
} 