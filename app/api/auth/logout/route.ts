import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '../../../../lib/generated/prisma'

const prisma = new PrismaClient()
const SESSION_COOKIE_NAME = 'noteprism_session'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
    
    // If there's an active session, delete it from the database
    if (sessionId) {
      try {
        await prisma.session.delete({
          where: { id: sessionId }
        })
      } catch (e) {
        // Session might already be expired or deleted, just continue
        console.log('Session not found or already deleted')
      }
    }
    
    // Create a response that redirects to the login page
    const response = NextResponse.json({ success: true })
    
    // Clear the session cookie
    response.cookies.delete(SESSION_COOKIE_NAME)
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
} 