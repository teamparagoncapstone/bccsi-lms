import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"; 

export async function POST(req: Request) {
  try {
    const { username } = await req.json(); 

    if (!username) { 
      return NextResponse.json(
        { status: 'error', message: 'Username is required' }, 
        { status: 400 }
      );
    }

    console.log("Received username:", username); 

    const user = await prisma.user.findUnique({
      where: { username } 
    });

    if (!user) {
      console.warn("User not found:", username);
      return NextResponse.json(
        { status: 'error', message: 'User not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 'success', user }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}