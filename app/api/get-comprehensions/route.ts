import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET(request: Request) {
  const url = new URL(request.url);
  const voice = url.searchParams.get('voice');

  if (!voice) {
    return NextResponse.json({
      status: 'error',
      message: 'Voice title parameter is required',
    }, { status: 400 });
  }
      
  try {

    const comprehensions = await prisma.comprehensionTest.findMany({
      where: {
        VoiceExcercises: {
          voice: voice,
        },
      },
      include: {
        VoiceExcercises: true, 
      },
    });

   
    if (!comprehensions) {
      return NextResponse.json({
        status: 'error',
        message: 'No comprehensions found',
      }, { status: 404 });
    }

   
    return NextResponse.json({
      status: 'success',
      comprehensions,
    });
  } catch (error) {
    console.error("Error fetching comprehensions:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching comprehensions',
    }, { status: 500 });
  }
}