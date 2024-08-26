import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, waterType, species } = body;

    const fish = await prisma.fish.create({
      data: {
        name,
        description,
        waterType,
        species: species.join(', '), // Convert array to comma-separated string
      },
    });

    return NextResponse.json(fish, { status: 201 });
  } catch (error) {
    console.error('Failed to create fish:', error);
    return NextResponse.json({ error: 'Failed to create fish' }, { status: 500 });
  }
}