import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../lib/generated/prisma'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()
const SESSION_COOKIE_NAME = 'noteprism_session'

// Helper function to get the current user from the session
async function getCurrentUser() {
  try {
    // In Next.js, cookies() may return a Promise depending on the context
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

  const groups = await prisma.noteGroup.findMany({
    where: { userId: user.id },
    include: { notes: true },
    orderBy: { position: 'asc' },
  })
  
  return NextResponse.json(groups)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  
  const group = await prisma.noteGroup.create({
    data: {
      name: data.name || "Untitled Group", // Make sure we have a fallback
      position: data.position || 0,
      user: {
        connect: { id: user.id }
      }
    }
  })
  
  return NextResponse.json(group)
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const group = await prisma.noteGroup.update({
    where: { 
      id: data.id,
      userId: user.id // Only allow updating own groups
    },
    data: {
      name: data.name,
      position: data.position !== undefined ? data.position : undefined
    },
  })
  
  return NextResponse.json(group)
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  await prisma.noteGroup.delete({ 
    where: { 
      id,
      userId: user.id // Only allow deleting own groups
    } 
  })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { positions } = await req.json() // [{id, position}, ...]
  const updates = await Promise.all(
    positions.map(({ id, position }: { id: string, position: number }) =>
      prisma.noteGroup.update({
        where: { 
          id,
          userId: user.id // Only allow updating own groups
        }, 
        data: { position }
      })
    )
  )
  return NextResponse.json({ success: true, updates })
} 