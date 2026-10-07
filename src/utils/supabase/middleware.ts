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

  const url = request.nextUrl.clone()
  const path = url.pathname

  // Public routes that unauthenticated users can access
  const publicRoutes = ['/', '/features', '/how-it-works', '/about', '/contact', '/login', '/signup', '/forgot-password', '/privacy', '/terms']
  
  // Routes that are strictly protected
  const protectedRoutes = ['/dashboard', '/settings', '/profile', '/admin', '/patients']

  const isPublicRoute = publicRoutes.includes(path) || path.startsWith('/receipt/')
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  if (user) {
    // Authenticated user
    if (path === '/' || path === '/login' || path === '/signup') {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } else {
    // Unauthenticated user
    if (isProtectedRoute || (!isPublicRoute && path !== '/appointments/new' && !path.startsWith('/api') && path !== '/departments' && path !== '/showcase')) {
      // If it's a protected route, or it's not a known public route (and not some other existing public endpoints), redirect to login
      // To be safe and strictly follow the prompt, we enforce login for dashboard, settings, profile.
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
