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

  const notes = await prisma.note.findMany({ 
    where: { userId: user.id },
    orderBy: { position: 'asc' } 
  })
  return NextResponse.json(notes)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  
  // Find the highest position for existing notes in the same group context
  const noteGroupId = data.groupId || null;
  const existingNotes = await prisma.note.findMany({
    where: { 
      userId: user.id,
      noteGroupId: noteGroupId
    },
    orderBy: { position: 'asc' }
  });
  
  // Shift all existing notes down by 1 to make room for the new note at position 0
  if (existingNotes.length > 0) {
    await prisma.$transaction(
      existingNotes.map(note => 
        prisma.note.update({
          where: { id: note.id },
          data: { position: note.position + 1 }
        })
      )
    );
  }
  
  // Create the new note at position 0
  const note = await prisma.note.create({ 
    data: {
      ...data,
      position: 0, // Set to top position (0)
      user: {
        connect: { id: user.id }
      }
    } 
  })
  
  return NextResponse.json(note)
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const { id, content, color, checkedStates, position, groupId } = data
  
  // Only update fields that are present and valid
  const updateData: any = {}
  if (content !== undefined) updateData.content = content
  if (color !== undefined) updateData.color = color
  if (checkedStates !== undefined) updateData.checkedStates = checkedStates
  if (position !== undefined) updateData.position = position
  if (groupId !== undefined) updateData.groupId = groupId

  // Ensure user can only update their own notes
  const note = await prisma.note.update({
    where: { 
      id,
      userId: user.id // Only allow updating their own notes
    },
    data: updateData,
  })
  return NextResponse.json(note)
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  
  // Ensure user can only delete their own notes
  await prisma.note.delete({ 
    where: { 
      id,
      userId: user.id 
    } 
  })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const updates = await req.json() // [{id, position, groupId?, checkedStates?}, ...]
  const results: any[] = []
  
  // Process updates as a transaction to ensure consistency
  await prisma.$transaction(async (tx) => {
    for (const update of updates) {
      const { id, position, checkedStates } = update
      const updateData: any = { position }
      
      if (checkedStates !== undefined) {
        updateData.checkedStates = checkedStates
      }
      
      // Clear or set the noteGroupId based on the groupId from frontend
      if (update.groupId !== undefined) {
        updateData.noteGroupId = update.groupId === null ? null : update.groupId
        
        // Log the update for debugging
        console.log(`Updating note ${id} with noteGroupId: ${updateData.noteGroupId}`)
      }
      
      const note = await tx.note.update({ 
        where: { 
          id,
          userId: user.id // Only allow updating their own notes
        }, 
        data: updateData
      })
      results.push(note)
    }
  }).catch(error => {
    console.error("Error updating note positions:", error)
    throw error
  })
  
  return NextResponse.json({ success: true, notes: results })
} 