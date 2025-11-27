import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ESTA LÍNEA ES CRUCIAL: Obliga a Next.js a no guardar caché y consultar siempre
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telefonoRaw = searchParams.get('telefono');

  if (!telefonoRaw) {
    return NextResponse.json({ error: 'Falta el teléfono' }, { status: 400 });
  }

  const telefono = telefonoRaw.trim();

  // CHIVATO 1: Ver qué teléfono llegó
  console.log("---- BUSCANDO CITAS ----");
  console.log("Teléfono recibido:", telefono);

  try {
    // Buscamos TODO (sin filtro de fecha) para ver si aparece la del día 25
    const citas = await prisma.cita.findMany({
      where: {
        clienteTelefono: telefono,
        estado: 'CONFIRMADA'
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    // CHIVATO 2: Ver cuántas encontró
    console.log("Citas encontradas en DB:", citas.length);
    console.log("------------------------");

    return NextResponse.json(citas);
  } catch (error) {
    console.error("Error en base de datos:", error);
    return NextResponse.json({ error: 'Error al buscar' }, { status: 500 });
  }
}