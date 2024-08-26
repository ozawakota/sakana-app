import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await prisma.fish.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Fish deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Failed to delete fish:', error)
    return NextResponse.json({ error: 'Failed to delete fish' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { name, species, waterType, description } = body

    const updatedFish = await prisma.fish.update({
      where: { id },
      data: {
        name,
        species,
        waterType,
        description,
      },
    })

    return NextResponse.json(updatedFish, { status: 200 })
  } catch (error) {
    console.error('Failed to update fish:', error)
    return NextResponse.json({ error: 'Failed to update fish' }, { status: 500 })
  }
}