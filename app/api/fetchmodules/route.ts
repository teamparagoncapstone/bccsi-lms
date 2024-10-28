import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    
    const modules = await prisma.module.findMany({
      select: {
        id: true,
        moduleTitle: true,
        moduleDescription:true,
        learnOutcome1: true,
        videoModule: true,
        imageModule: true,
        subjects: true,
        grade: true,
        createdAt: true,
        updatedAt: true,
      },
    });

   
    return NextResponse.json({
      status: 'success',
      modules,
    });
  } catch (error) {
      console.error("Error during data fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching data',
    }, { status: 500 });
  }
}