import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Define the shape of the request body
type CreateFishRequest = {
  name: string;
  description?: string;
  waterType: 'FRESHWATER' | 'SALTWATER' | 'BRACKISH';
  species: string;
};

// Define the shape of the response
type CreateFishResponse = {
  id: number;
  name: string;
  description: string | null;
  waterType: 'FRESHWATER' | 'SALTWATER' | 'BRACKISH';
  species: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function POST(
  request: Request
): Promise<NextResponse<CreateFishResponse | { error: string }>> {
  try {
    const body: CreateFishRequest = await request.json();
    const { name, description, waterType, species } = body;

    // Validate input
    if (!name || !waterType || !species) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const fish = await prisma.fish.create({
      data: {
        name,
        description,
        waterType,
        species,
      },
    });

    return NextResponse.json(fish, { status: 201 });
  } catch (error) {
    console.error('Failed to create fish:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create fish' }, { status: 500 });
  }
}