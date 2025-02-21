import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await prisma.address.create({
    data: {
      address: body.address
    }
  });

  return NextResponse.json({ ok: result });
}
