import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "A user already exists with this email address.",
        },
        {
          status: 401,
        },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
