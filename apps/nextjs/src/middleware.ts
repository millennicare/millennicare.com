import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSession } from "./app/actions";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
