import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { status: 'error', message: 'Username is required' },
        { status: 400 }
      );
    }

    console.log("Received username:", username);

    const educator = await prisma.educator.findUnique({
      where: { username }
    });

    if (!educator) {
      console.warn("User not found:", username);
      return NextResponse.json(
        { status: 'error', message: 'Educator not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 'success', educator },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching educator:", error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}