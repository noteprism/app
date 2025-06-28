import type { Metadata } from "next"
import { cookies } from 'next/headers';
import { PrismaClient } from '../../lib/generated/prisma';
import Dashboard from "@/components/dashboard"
import { redirect } from 'next/navigation';
import { userHasActivePlan } from "../logic/plan";

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Noteprism - Dashboard",
  description: "Your organized workspace for notes and tasks",
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  
  if (!sessionId) {
    redirect('/');
  }
  
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  
  if (!session || session.expiresAt <= new Date()) {
    redirect('/');
  }
  
  // Check if local development mode is enabled
  const isLocalDev = process.env.NEXT_PUBLIC_LOCAL_DEV_MODE === 'true';
  
  // Check if user has an active subscription
  const user = session.user;
  const hasActivePlan = userHasActivePlan(user);
  
  // If user doesn't have an active plan and we're not in local dev mode, redirect to pricing
  // BUT don't redirect if they're coming from checkout success (give webhook time to process)
  const fromCheckout = searchParams.checkout === 'success';
  
  if (!hasActivePlan && !isLocalDev && !fromCheckout) {
    redirect('/pricing');
  }
  
  return <Dashboard />;
} 