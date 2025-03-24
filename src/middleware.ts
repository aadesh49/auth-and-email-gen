import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    //these are the routes that only new user or logged out users can access
    const publicPath = path === '/login' || path === '/signup' ;

    const token = request.cookies.get("token")?.value || '';

    //if user is accessing public path but they are loggin or have token
    if(publicPath && token){
        return NextResponse.redirect(new URL('/me', request.url));          //redirect them to me route
    }
    //when user is not logged in but they are still accessing something other than public path 
    if(!publicPath && !token){
        return NextResponse.redirect(new URL('/login', request.url));       //redirect them to login route
    }

  
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/login', '/signup', '/verifyemail', '/me'],
}