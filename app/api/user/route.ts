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

  // Determine connected SSO providers
  const connectedProviders = {
    google: !!user.googleId,
    linkedin: !!user.linkedinId,
    email: !!user.password
  }
  
  // Get subscription information
  let subscriptionInfo = {
    plan: user.plan || 'inactive',
    status: user.stripeSubscriptionStatus || null,
    canManageBilling: !!user.stripeCustomerId,
    localDevelopment: user.localDevelopment || false
  };

  // Return user info without sensitive fields
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    profilePicture: user.profilePicture,
    connectedProviders,
    subscription: subscriptionInfo
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

    // Determine connected SSO providers for the updated user
    const connectedProviders = {
      google: !!updatedUser.googleId,
      linkedin: !!updatedUser.linkedinId,
      email: !!updatedUser.password
    }
    
    // Get subscription information
    let subscriptionInfo = {
      plan: updatedUser.plan || 'inactive',
      status: updatedUser.stripeSubscriptionStatus || null,
      canManageBilling: !!updatedUser.stripeCustomerId,
      localDevelopment: updatedUser.localDevelopment || false
    };

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      profilePicture: updatedUser.profilePicture,
      connectedProviders,
      subscription: subscriptionInfo
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
} 