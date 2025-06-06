import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  const notes = await prisma.note.findMany({ orderBy: { position: 'asc' } })
  return NextResponse.json(notes)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const note = await prisma.note.create({ data })
  return NextResponse.json(note)
}

export async function PUT(req: NextRequest) {
  const data = await req.json()
  const { id, content, color, checkedStates, position, groupId } = data
  // Only update fields that are present and valid
  const updateData: any = {}
  if (content !== undefined) updateData.content = content
  if (color !== undefined) updateData.color = color
  if (checkedStates !== undefined) updateData.checkedStates = checkedStates
  if (position !== undefined) updateData.position = position
  if (groupId !== undefined) updateData.groupId = groupId

  const note = await prisma.note.update({
    where: { id },
    data: updateData,
  })
  return NextResponse.json(note)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await prisma.note.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const updates = await req.json() // [{id, position, groupId?, checkedStates?}, ...]
  const results = []
  for (const { id, position, groupId, checkedStates } of updates) {
    const note = await prisma.note.update({ where: { id }, data: { position, groupId, checkedStates } })
    results.push(note)
  }
  return NextResponse.json({ success: true, notes: results })
} 