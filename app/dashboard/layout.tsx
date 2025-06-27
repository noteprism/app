import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Noteprism - Dashboard",
  description: "Your organized workspace for notes and tasks",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 