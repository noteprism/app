import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Noteprism - Your Organized Workspace",
  description: "Capture every idea, shower thought, and task as a digital sticky note in Noteprism",
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 