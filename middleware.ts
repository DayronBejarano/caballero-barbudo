// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Si intenta entrar a /admin...
  if (url.pathname.startsWith('/admin')) {
    
    // PERO NO estamos en la página de login (para evitar bucle infinito)
    if (!url.pathname.startsWith('/admin/login')) {
        
        // Verificamos si tiene la cookie "admin_session"
        const cookie = req.cookies.get('admin_session');

        // Si NO tiene la cookie, lo pateamos al Login Personalizado
        if (!cookie) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
    }
  }

  return NextResponse.next();
}

// Configuración para que solo se active en rutas de admin
export const config = {
  matcher: '/admin/:path*',
};