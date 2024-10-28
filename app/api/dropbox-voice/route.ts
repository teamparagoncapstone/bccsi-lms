import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";  

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const grade = url.searchParams.get("grade");

    const query: Prisma.VoiceExcercisesWhereInput = {
        AND: [ 
          grade ? { grade: grade as any } : {}  
        ]
      };
    
    const voice = await prisma.voiceExcercises.findMany({
        where: query,
        select: {
        id: true,
        voice: true,
        grade: true,
      },
    });

    return NextResponse.json({
      status: 'success',
      voice,
    });
  } catch (error) {
    console.error("Error during data fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching data',
    }, { status: 500 });
  }
}