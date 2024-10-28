import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    
    const comprehensionTest = await prisma.comprehensionTest.findMany({
      select: {
        id: true,
        question: true,
        Option1: true,
        Option2: true,
        Option3: true,
        CorrectAnswers: true,
        voiceId: true,
        image: true,
        userId: true,
      },
    });

    
    return NextResponse.json({
      status: 'success',
      comprehensionTest,
    });
  } catch (error) {
    console.error("Error during data fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching data',
    }, { status: 500 });
  }
}