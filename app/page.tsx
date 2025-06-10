import type { Metadata } from "next"
import { cookies } from 'next/headers';
import { PrismaClient } from '../lib/generated/prisma';
import Dashboard from "@/components/dashboard"

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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h1>Noteprism</h1>
        <a href="/api/auth/linkedin/login">
          <button style={{ padding: '1em 2em', fontSize: '1.2em', borderRadius: '8px', background: '#0077b5', color: 'white', border: 'none', cursor: 'pointer' }}>
            Sign in with LinkedIn
          </button>
        </a>
      </div>
    );
  }
}
