import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: 'Noteprism',
  description: 'Your organized workspace',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
