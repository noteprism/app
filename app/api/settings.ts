import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../lib/generated/prisma';

const prisma = new PrismaClient();

// For demo: use a hardcoded email. Replace with real auth in production.
const DEMO_EMAIL = 'demo@user.com';

export async function GET(req: NextRequest) {
  const user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  return NextResponse.json({ noteStyle: user?.noteStyle || 'outline' });
}

export async function POST(req: NextRequest) {
  const { noteStyle } = await req.json();
  if (noteStyle !== 'outline' && noteStyle !== 'filled') {
    return NextResponse.json({ error: 'Invalid noteStyle' }, { status: 400 });
  }
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { noteStyle },
    create: { email: DEMO_EMAIL, noteStyle },
  });
  return NextResponse.json({ noteStyle: user.noteStyle });
} 