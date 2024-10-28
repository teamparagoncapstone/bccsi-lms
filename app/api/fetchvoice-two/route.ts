import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const voice = await prisma.voiceExcercises.findMany({
      where: {
        grade: 'GradeTwo', 
      },
      select: {
        id: true,
        voice: true,
        voiceImage: true,
        grade: true,    
        moduleId: true,
        userId: true,
        Module: { 
          select: {
            id: true,   
            moduleTitle: true, 
          },
        },
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