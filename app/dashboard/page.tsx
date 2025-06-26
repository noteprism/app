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

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  
  // If no session, allow access to public dashboard
  if (!sessionId) {
    return <Dashboard isPublic={true} />;
  }
  
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  
  // If invalid session, allow access to public dashboard
  if (!session || session.expiresAt <= new Date()) {
    return <Dashboard isPublic={true} />;
  }
  
  // Check if local development mode is enabled
  const isLocalDev = process.env.NEXT_PUBLIC_LOCAL_DEV_MODE === 'true';
  
  // Check if user has an active subscription
  const user = session.user;
  const hasActivePlan = userHasActivePlan(user);
  
  // Always allow access to dashboard for logged-in users
  // They'll see appropriate UI based on their plan status
  return <Dashboard />;
} 