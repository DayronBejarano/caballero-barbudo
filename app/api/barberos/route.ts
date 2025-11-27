// app/api/barberos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener todos los barberos y sus fotos para el Home
export async function GET() {
  const barberos = await prisma.barbero.findMany({
    include: {
      portafolio: true // ¡Traer también sus fotos de cortes!
    }
  });
  return NextResponse.json(barberos);
}