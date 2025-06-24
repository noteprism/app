import type { Metadata } from "next";
import { cookies } from 'next/headers';
import { PrismaClient } from '@/lib/generated/prisma';
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { calculateTrialDaysRemaining } from "../logic/plan";

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Trial Activated - Noteprism",
  description: "Your free trial has been activated",
}

export default async function TrialActivatedPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('noteprism_session')?.value;
  
  if (!sessionId) {
    redirect('/connect?intent=trial');
  }
  
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  
  if (!session || session.expiresAt <= new Date()) {
    redirect('/connect?intent=trial');
  }
  
  const user = session.user;
  const trialDaysRemaining = calculateTrialDaysRemaining(user.trialEndsAt);
  
  // If user doesn't have an active trial, redirect to homepage
  if (!user.trialEndsAt || new Date(user.trialEndsAt) <= new Date()) {
    redirect('/');
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#101113] relative overflow-hidden">
      <div className="z-10 w-full max-w-md">
        <div className="bg-[#18191A] p-8 rounded-lg border border-[#232425] shadow-sm flex flex-col items-center">
          <div className="mb-6 flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold">Trial Activated!</h1>
            <p className="text-center mt-2 text-muted-foreground">
              Your 7-day free trial of Noteprism Pro has started.
            </p>
          </div>
          
          <div className="w-full p-4 bg-[#1E1F20] rounded-md mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Trial period:</span>
              <span className="font-medium">{trialDaysRemaining} days remaining</span>
            </div>
            <div className="w-full bg-[#2A2B2C] rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(trialDaysRemaining / 7) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <p className="mb-2">You now have full access to all Noteprism features:</p>
            <ul className="list-none space-y-2 text-sm">
              <li>✔ Unlimited Notes</li>
              <li>✔ Search All Notes</li>
              <li>✔ Note Groups</li>
              <li>✔ Custom Colors</li>
            </ul>
          </div>
          
          <Link href="/dashboard" className="w-full">
            <Button className="w-full">
              Continue to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 