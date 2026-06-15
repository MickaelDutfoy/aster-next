import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const GET = async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const animalId = Number(id);

  if (!animalId) {
    return new NextResponse('Invalid animal id', { status: 400 });
  }

  const animal = await prisma.animal.findUnique({
    where: { id: animalId },
    select: { imageKey: true },
  });

  if (!animal?.imageKey) {
    return new NextResponse('Image not found', { status: 404 });
  }

  const blob = await get(animal.imageKey, {
    access: 'private',
  });

  if (!blob) {
    return new NextResponse('Image not found', { status: 404 });
  }

  return new NextResponse(blob.stream, {
    headers: {
      'Content-Type': blob.headers.get('content-type') ?? 'image/jpeg',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
