import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const publicRoutes = [
  { path: '/sign-in', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/sign-in';

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);

  const cookie = (await cookies()).get('__Host-financy-session')?.value;

  if (!cookie && publicRoute) {
    return NextResponse.next();
  }

  if (!cookie && !publicRoute) {
    const redirectUrl = new URL(
      REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE,
      req.nextUrl,
    );

    return NextResponse.redirect(redirectUrl);
  }

  if (cookie && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = new URL('/dashboard', req.nextUrl);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
