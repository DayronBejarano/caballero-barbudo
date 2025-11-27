// app/api/admin-cancelar/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Falta el ID' }, { status: 400 });
    }

    // Actualizamos el estado a CANCELADA
    const citaActualizada = await prisma.cita.update({
      where: { id: id },
      data: { estado: 'CANCELADA' }
    });

    return NextResponse.json(citaActualizada);
  } catch (error) {
    return NextResponse.json({ error: 'Error al cancelar' }, { status: 500 });
  }
}