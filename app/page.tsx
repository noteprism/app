import type { Metadata } from "next"
import { cookies } from 'next/headers';
import { PrismaClient } from '../lib/generated/prisma';
import Dashboard from "@/components/dashboard"
import ConnectForm from "@/components/ConnectForm";
import PricingTable from "@/components/PricingTable";
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Noteprism - Your Organized Workspace",
  description: "A fusion of Notion and TickTick for organizing your notes and tasks",
}

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  let isLoggedIn = false;
  
  // Check for checkout success or cancel parameters
  const isCheckoutSuccess = searchParams.checkout === 'success';
  const isCheckoutCancel = searchParams.checkout === 'cancel';
  const startTrialIntent = searchParams.start_trial === '1';
  
  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    if (session && session.expiresAt > new Date()) {
      isLoggedIn = true;
      
      // If user has just logged in and wants to start a trial, redirect to checkout
      if (startTrialIntent) {
        redirect('/api/stripe/checkout');
      }
    }
  }

  if (isLoggedIn) {
    return <Dashboard />;
  } else {
    return <PricingTable />;
  }
}
