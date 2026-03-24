/**
 * proxy.ts — HIPAA-compliant request proxy
 *
 * Responsibilities:
 *  1. Refresh Supabase session on every request (mandatory for @supabase/ssr)
 *  2. Redirect unauthenticated users away from protected routes
 *  3. Enforce HTTPS in production (reject HTTP)
 *  4. Add HIPAA/security response headers to every response
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Security headers added to every response
const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-XSS-Protection": "1; mode=block",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) =>
    response.headers.set(key, value)
  );
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── HTTPS enforcement (production only) ─────────────────────────────────────
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    const httpsUrl = `https://${request.headers.get("host")}${pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(httpsUrl, { status: 301 });
  }

  // ── Session refresh ──────────────────────────────────────────────────────────
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() must be called to refresh the session token.
  // Do not remove this call.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Route protection ─────────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard") && !user) {
    const res = NextResponse.redirect(
      new URL("/auth/login?redirect=/dashboard", request.url)
    );
    return applySecurityHeaders(res);
  }

  if (pathname.startsWith("/practitioner") && !user) {
    const res = NextResponse.redirect(
      new URL("/auth/login?redirect=/practitioner", request.url)
    );
    return applySecurityHeaders(res);
  }

  return applySecurityHeaders(supabaseResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
