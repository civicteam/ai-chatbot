import { auth } from "@civic/auth/nextjs/middleware"
import { type NextRequest, NextResponse } from "next/server";

const withCivicAuth = auth();

const otherMiddleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith("/ping")) {
    return NextResponse.json({ status: "pong" });
  }

  return NextResponse.next();
};

export default withCivicAuth(otherMiddleware);

export const config = {
  matcher: [
    "/",
    /*
     * Match all request paths except:
     * - _next directory (Next.js static files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - image files
     */
    "/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.gif).*)",
  ],
};
