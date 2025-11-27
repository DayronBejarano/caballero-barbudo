// app/api/setup/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. LIMPIEZA TOTAL (El orden importa para no romper relaciones)
    // Primero borramos lo que depende de otros (Citas y Portafolio)
    await prisma.cita.deleteMany();
    await prisma.portafolio.deleteMany();
    // Luego borramos a los barberos
    await prisma.barbero.deleteMany();

    // 2. CREAR A KELVIN (EL JEFE)
    const kelvin = await prisma.barbero.create({
      data: {
        nombre: 'kelvin',       // Usuario para login
        password: 'barba2025',  // Contraseña
        rol: 'ADMIN',           // <--- AQUÍ ESTÁ LA MAGIA
        bio: 'Maestro Barbero y Fundador.',
        fotoUrl: '/img/logo.png'
      }
    });

    // 3. CREAR UN EMPLEADO DE PRUEBA (Opcional, para que veas la diferencia)
    await prisma.barbero.create({
      data: {
        nombre: 'carlos',
        password: '1234',
        rol: 'STAFF',           // Este NO es admin
        bio: 'Especialista en cortes modernos.',
        fotoUrl: '/img/logo.png'
      }
    });

    return NextResponse.json({ 
      mensaje: "✅ BASE DE DATOS REINICIADA CORRECTAMENTE",
      admin: kelvin 
    });

  } catch (error) {
    return NextResponse.json({ error: "Error al reiniciar: " + error }, { status: 500 });
  }
}