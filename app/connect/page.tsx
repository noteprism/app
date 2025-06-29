import type { Metadata } from "next";
import { cookies } from 'next/headers';
import { PrismaClient } from '@/lib/generated/prisma';
import { redirect } from 'next/navigation';
import ConnectForm from "@/components/ConnectForm";
import ConnectPageClient from './connect-page-client';

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Connect to Noteprism",
  description: "Sign in or create an account to get started with Noteprism",
}

export default async function ConnectPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  
  // Check if user is already logged in
  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    
    if (session && session.expiresAt > new Date()) {
      // User is already logged in, redirect to dashboard
      return redirect('/dashboard');
    }
  }

  return <ConnectPageClient />;
} 