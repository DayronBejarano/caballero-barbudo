import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Sesión cerrada' });
  response.cookies.delete('admin_session'); // ESTO ES LO QUE IMPORTA
  return response;
}