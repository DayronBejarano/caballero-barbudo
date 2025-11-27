// app/api/reservar/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setHours, setMinutes, parse } from 'date-fns';

// Función para generar código de 6 caracteres (Ej: A7X9P2)
function generarCodigo() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // SOLO MAYÚSCULAS
  let resultado = '';
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, telefono, fecha, hora, barberoId } = body;

    if (!nombre || nombre.length < 3) return NextResponse.json({ error: 'Nombre inválido.' }, { status: 400 });
    if (!/^\d{7,15}$/.test(telefono)) return NextResponse.json({ error: 'Teléfono inválido.' }, { status: 400 });

    // CAMBIO CRÍTICO: Usamos 'parse' para entender "02:00 PM"
    // Toma la fecha base y le incrusta la hora AM/PM correctamente
    const fechaCita = parse(hora, 'hh:mm aa', new Date(fecha));

    // Validaciones de seguridad (Anti-Spam)
    const citaExistente = await prisma.cita.findFirst({
      where: { clienteTelefono: telefono, estado: 'CONFIRMADA', fecha: { gte: new Date() } }
    });

    if (citaExistente) {
      return NextResponse.json({ error: 'Ya tienes una reserva activa pendiente.' }, { status: 429 });
    }

    const turnoOcupado = await prisma.cita.findFirst({
        where: { fecha: fechaCita, barberoId: barberoId, estado: 'CONFIRMADA' }
    });

    if (turnoOcupado) {
        return NextResponse.json({ error: 'Alguien ganó el turno hace un segundo.' }, { status: 409 });
    }
// Generamos el código
    const tokenCorto = generarCodigo();
    
    // DETECTIVE AL GUARDAR:
    console.log("💾 Guardando nueva cita con Código:", tokenCorto);

    const nuevaCita = await prisma.cita.create({
      data: {
        clienteNombre: nombre,
        clienteTelefono: telefono,
        fecha: fechaCita,
        barberoId: barberoId,
        estado: 'CONFIRMADA',
        tokenCancelacion: tokenCorto // Se guarda el código corto
      }
    });

    return NextResponse.json(nuevaCita);
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}