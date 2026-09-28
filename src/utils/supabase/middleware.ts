import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    'https://ctfskadogvzmmeboajgn.supabase.co',
    'sb_publishable_zzp6go7I4NOEtTz90ZFSsA_-ngRHV6s',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect routes here. If unauthenticated and trying to access protected route, redirect to login
  const protectedRoutes = ['/appointments', '/patients', '/settings'] // root (/) can be public or protected, but let's say root dashboard is protected
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) || request.nextUrl.pathname === '/'

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
