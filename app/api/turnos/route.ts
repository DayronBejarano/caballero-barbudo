import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addMinutes, format, setHours, setMinutes, startOfDay, isBefore } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fechaQuery = searchParams.get('fecha'); 
  const barberoId = searchParams.get('barberoId');

  if (!fechaQuery || !barberoId) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  // Horario: 8:00 AM a 8:00 PM (20:00)
  const inicioDia = setMinutes(setHours(new Date(fechaQuery), 8), 0);
  const finDia = setMinutes(setHours(new Date(fechaQuery), 20), 0);
  const duracionTurno = 40; 

  const citasOcupadas = await prisma.cita.findMany({
    where: {
      barberoId: parseInt(barberoId),
      fecha: {
        gte: startOfDay(new Date(fechaQuery)),
        lt: addMinutes(finDia, 1)
      },
      estado: 'CONFIRMADA'
    }
  });

  let turnos = [];
  let horaActual = inicioDia;

  while (isBefore(horaActual, finDia)) {
    // CAMBIO AQUÍ: 'hh:mm aa' genera "08:00 AM", "04:40 PM"
    const horaFormato = format(horaActual, 'hh:mm aa');
    
    const estaOcupado = citasOcupadas.some(cita => {
      // Comparamos peras con peras (formato 12h con 12h)
      return format(cita.fecha, 'hh:mm aa') === horaFormato;
    });

    turnos.push({
      hora: horaFormato,
      disponible: !estaOcupado 
    });

    horaActual = addMinutes(horaActual, duracionTurno);
  }

  return NextResponse.json(turnos);
}