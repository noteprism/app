import type { Metadata } from "next"
import { cookies } from 'next/headers';
import { PrismaClient } from '../lib/generated/prisma';
import Dashboard from "@/components/dashboard"
import ConnectForm from "@/components/ConnectForm";
import PricingTable from "@/components/PricingTable";
import { hasUpgradeIntentCookie } from "./logic/upgrade-intent";
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Noteprism - Your Organized Workspace",
  description: "A fusion of Notion and TickTick for organizing your notes and tasks",
}

export default async function Home() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  let isLoggedIn = false;
  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    if (session && session.expiresAt > new Date()) {
      isLoggedIn = true;
    }
  }

  if (isLoggedIn) {
    // Server-side upgrade intent check and redirect
    if (await hasUpgradeIntentCookie()) {
      redirect('/api/stripe/checkout');
    }
    return <Dashboard />;
  } else {
    return <PricingTable />;
  }
}
