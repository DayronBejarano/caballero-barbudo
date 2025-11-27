// app/api/cancelar/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { token } = body;

    // 1. Limpieza de datos (Seguridad)
    if (!token) return NextResponse.json({ error: 'Falta el código' }, { status: 400 });
    
    // Convertimos a mayúsculas y quitamos espacios invisibles
    token = token.toString().trim().toUpperCase();

    // --- DETECTIVE EN LA TERMINAL (Mira aquí cuando pruebes) ---
    console.log("🛑 INTENTO DE CANCELACIÓN:");
    console.log("👉 Código recibido limpio:", token);

    // 2. Buscar la cita
    // Usamos findFirst en lugar de findUnique para evitar errores de constraints si la BD está sucia
    const cita = await prisma.cita.findFirst({
      where: { tokenCancelacion: token }
    });

    if (!cita) {
      console.log("❌ Resultado: No se encontró ninguna cita con ese código.");
      return NextResponse.json({ error: 'Código inválido o no encontrado' }, { status: 404 });
    }

    console.log("✅ Resultado: Cita encontrada para:", cita.clienteNombre);

    if (cita.estado === 'CANCELADA') {
        return NextResponse.json({ message: 'Esta cita ya estaba cancelada' });
    }

    // 3. Cancelar la cita
    const citaActualizada = await prisma.cita.update({
      where: { id: cita.id },
      data: { estado: 'CANCELADA' }
    });

    return NextResponse.json(citaActualizada);

  } catch (error) {
    console.error("🔥 Error crítico:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}