import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../lib/generated/prisma'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()
const SESSION_COOKIE_NAME = 'noteprism_session'

// Helper function to get the current user from the session
async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
    
    if (!sessionId) {
      return null
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      return null
    }

    return session.user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Return user info without sensitive fields
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    profilePicture: user.profilePicture
  })
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await req.json()
    
    // Only allow updating certain fields
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name
      }
    })

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      profilePicture: updatedUser.profilePicture
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
} 