import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; 
import path from "path";

let iran = 0
export default function handler(req: NextRequest) {
    const cookies = req.headers.get('cookie') || '';

    iran++
    console.log("Request number:", iran);
    const jwt = require('jsonwebtoken');
    // here compare jwt
    const jwtCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('jwt='));
    const pathName = req.nextUrl.pathname
    console.log("Requested path:", pathName)

    const HomeWithJWT = protectedRoutes.includes(pathName) && jwtCookie 
    const LoginWithJWT = pathName === '/login' && jwtCookie

    if(pathName === '/') return NextResponse.redirect(new URL('/home', req.url))
    if(HomeWithJWT || LoginWithJWT){
        const jwtValue = jwtCookie.split('=')[1];
        var decoded = jwt.verify(jwtValue, process.env.JWT_SECRET);
        if(decoded){
            if(pathName === '/login'){
                return NextResponse.redirect(new URL('/home', req.url))
            }
            return NextResponse.next()
        }else{
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }

    if(pathName === '/login' && !jwtCookie){
        return NextResponse.next()
    }

    if(protectedRoutes.includes(pathName) && !jwtCookie){
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if(protectedRoutes.includes(pathName) && !jwtCookie){
        return NextResponse.redirect(new URL('/login', req.url))
    }
        
    return NextResponse.redirect(new URL('/login', req.url))

}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*"
  ],
}

const protectedRoutes = ['/home','/home/', '/home/cennik', '/api/sign-cloudinary-params', '/'];