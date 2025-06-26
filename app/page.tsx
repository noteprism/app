import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"
import { cookies } from 'next/headers';
import { PrismaClient } from '@/lib/generated/prisma';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Noteprism - Your Organized Workspace",
  description: "Capture every idea, shower thought, and task as a digital sticky note in Noteprism",
}

export default async function Home() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  
  // If user has a session, check if it's valid
  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    
    // If session is valid, redirect to dashboard
    if (session && session.expiresAt > new Date()) {
      redirect('/dashboard');
    }
  }
  
  // No valid session, render public dashboard
  return <Dashboard isPublic={true} />;
}
