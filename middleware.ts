import { NextRequest, NextResponse } from "next/server";

export const config = { matcher: ["/api/:path*"] };

export function middleware(req: NextRequest) {
  const apiKey = process.env.ATLAS_API_KEY;
  if (!apiKey) {
    return new NextResponse(JSON.stringify({ error: "Server misconfigured: ATLAS_API_KEY not set." }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" }
    });
  }
  const incoming = req.headers.get("x-api-key");
  if (incoming !== apiKey) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" }
    });
  }
  return NextResponse.next();
}
