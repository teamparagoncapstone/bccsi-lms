import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const awards = await prisma.award.findMany({
      include: {
        student: {
          select: {
            firstname: true,
            lastname: true,
            studentUsername: true,
          },
        },
      },
    });

    return NextResponse.json(awards);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch awards" }, { status: 500 });
  }
}