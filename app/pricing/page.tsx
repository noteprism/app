import type { Metadata } from "next"
import { PricingPageContent } from "@/components/pricing-page";
import { cookies } from 'next/headers';
import { PrismaClient } from '@/lib/generated/prisma';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Noteprism - Pricing",
  description: "Subscribe to Noteprism Pro and unlock all features",
}

export default async function PricingPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  
  // If no session, redirect to connect page
  if (!sessionId) {
    redirect('/connect');
  }
  
  // Check if session is valid
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  
  // If invalid session, redirect to connect page
  if (!session || session.expiresAt <= new Date()) {
    redirect('/connect');
  }
  
  // User is logged in, show pricing page
  return <PricingPageContent />;
} 