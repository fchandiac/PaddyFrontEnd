import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // TEMPORAL: Bypass de autenticación mientras el backend no está disponible
  // TODO: Reactivar cuando el backend esté funcionando
  console.log('MIDDLEWARE: Bypass temporal de autenticación activo');
  return NextResponse.next();

  /* CÓDIGO ORIGINAL - REACTIVAR CUANDO EL BACKEND FUNCIONE:
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // secureCookie: true, // ✅ importante en producción
  });

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: ['/paddy/:path*'],
};
