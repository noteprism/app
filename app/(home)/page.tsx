"use client"

import Dashboard from "@/components/dashboard"

export default function Home() {
  // Render the dashboard in public mode by default
  // This ensures fast loading without database checks
  return <Dashboard isPublic={true} />;
} 