import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // TEMPORAL: Autenticación desactivada - Quitar comentarios para reactivar
  /*
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // secureCookie: true, // ✅ importante en producción
  });

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  */

  // Permitir acceso directo mientras la autenticación está desactivada
  return NextResponse.next();
}

export const config = {
  matcher: ['/paddy/:path*'],
};
