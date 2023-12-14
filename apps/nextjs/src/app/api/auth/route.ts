import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs";

export async function POST(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", status: 403 });
  }

  const body = await request.json();

  const user = await clerkClient.users.updateUser(userId, {
    primaryEmailAddressID: body.email,
  });

  return user;
}
