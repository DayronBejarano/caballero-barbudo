import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { usuario, password } = body;

  // 1. Buscamos al barbero en la Base de Datos
  const barbero = await prisma.barbero.findUnique({
    where: { nombre: usuario }
  });

  // 2. Verificamos si existe y si la contraseña coincide
  if (barbero && barbero.password === password) {
    
    const response = NextResponse.json({ 
      message: 'Bienvenido', 
      rol: barbero.rol 
    });

    // 3. Guardamos la cookie (Configuración relajada para que funcione el Admin)
    response.cookies.set('admin_session', `${barbero.id},${barbero.rol}`, {
      httpOnly: false, // False para que el frontend pueda leer el ID y ROL
      secure: false,   // False para que funcione en localhost (http)
      sameSite: 'lax', 
      path: '/',       
      maxAge: 60 * 60 * 24 
    });

    return response;
  }

  return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
}