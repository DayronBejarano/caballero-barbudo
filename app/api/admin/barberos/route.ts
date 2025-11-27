import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Lista para el admin
export async function GET() {
  return NextResponse.json(await prisma.barbero.findMany());
}

// POST: Crear Barbero (Solo Kelvin) o Agregar Foto (Cualquiera)
export async function POST(request: Request) {
  const body = await request.json();
  
  // MODO 1: AGREGAR FOTO AL PORTAFOLIO
  if (body.accion === 'subir_foto') {
      const nuevaFoto = await prisma.portafolio.create({
          data: {
              titulo: body.titulo,
              imagenUrl: body.imagenUrl, // URL de la foto (ej: /img/corte1.jpg)
              barberoId: parseInt(body.barberoId)
          }
      });
      return NextResponse.json(nuevaFoto);
  }

  // MODO 2: CREAR NUEVO BARBERO (Solo Kelvin)
  try {
    const nuevo = await prisma.barbero.create({
      data: {
        nombre: body.nombre,
        password: body.password,
        rol: 'STAFF',
        bio: body.bio,
        fotoUrl: '/img/logo.png' // Foto por defecto
      }
    });
    return NextResponse.json(nuevo);
  } catch (e) {
    return NextResponse.json({ error: 'El nombre ya existe' }, { status: 400 });
  }
}

// DELETE: Despedir
export async function DELETE(request: Request) {
  const { id } = await request.json();
  const target = await prisma.barbero.findUnique({ where: { id } });
  if (target?.rol === 'ADMIN') return NextResponse.json({ error: 'No' }, { status: 403 });
  
  await prisma.barbero.delete({ where: { id } });
  return NextResponse.json({ success: true });
}