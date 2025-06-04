import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  const groups = await prisma.noteGroup.findMany({ include: { notes: true } })
  return NextResponse.json(groups)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const group = await prisma.noteGroup.create({ data })
  return NextResponse.json(group)
}

export async function PUT(req: NextRequest) {
  const data = await req.json()
  const group = await prisma.noteGroup.update({
    where: { id: data.id },
    data,
  })
  return NextResponse.json(group)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await prisma.noteGroup.delete({ where: { id } })
  return NextResponse.json({ success: true })
} 