import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log('Token:', token);
  console.log('Request URL:', req.url);
  console.log('Request Body:', req.body);
  console.log('Request Cookies:', req.cookies);
  console.log('Request NextUrl:', req.nextUrl);
  console.log('AuthSecret', process.env.NEXTAUTH_SECRET);
  console.log('AuthUrl', process.env.NEXTAUTH_URL);


  // Si el usuario no está autenticado, redirige al login (/)
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/paddy/:path*'], // Protege solo esa ruta
};
