import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"

export const metadata: Metadata = {
  title: "Noteprism - Your Organized Workspace",
  description: "Capture every idea, shower thought, and task as a digital sticky note in Noteprism",
}

export default async function Home() {
  // Render the dashboard in public mode by default
  // This ensures fast loading without database checks
  return <Dashboard isPublic={true} />;
}
