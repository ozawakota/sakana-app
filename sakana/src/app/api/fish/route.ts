import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const fish = await prisma.fish.findMany()
    return NextResponse.json(fish)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch fish' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const fish = await prisma.fish.create({
      data: json,
    })
    return NextResponse.json(fish, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create fish' }, { status: 500 })
  }
}