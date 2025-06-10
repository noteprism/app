import type { Metadata } from "next"
import { cookies } from 'next/headers';
import { PrismaClient } from '../lib/generated/prisma';
import Dashboard from "@/components/dashboard"
import ConnectForm from "@/components/ConnectForm";

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
    return <Dashboard />;
  } else {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
        {/* Background gradient elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3" />
        
        {/* Content */}
        <div className="relative mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-center">Noteprism</h1>
          <p className="text-muted-foreground text-center mt-2">Your organized workspace</p>
        </div>
        <div className="relative z-10 bg-background/80 backdrop-blur-md p-8 rounded-lg border shadow-sm">
          <ConnectForm />
        </div>
      </div>
    );
  }
}
