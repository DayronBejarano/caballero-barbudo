import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// OJO: Aquí debe decir "export async function", SIN la palabra "default"
export async function GET() {
  try {
    const citas = await prisma.cita.findMany({
      orderBy: {
        fecha: 'asc',
      }
    });

    return NextResponse.json(citas);
  } catch (error) {
    return NextResponse.json({ error: 'Error cargando agenda' }, { status: 500 });
  }
}