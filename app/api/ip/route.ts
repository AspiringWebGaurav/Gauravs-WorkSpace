import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

const getClientIp = (request: NextRequest) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? null;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  // @ts-expect-error - NextRequest.ip is available in Node runtime
  return request.ip ?? "0.0.0.0";
};

export const GET = (request: NextRequest) => {
  const ip = getClientIp(request);
  return NextResponse.json({ ip });
};
