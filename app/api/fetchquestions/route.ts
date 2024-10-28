import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    
    const questions = await prisma.questions.findMany({
      select: {
        id: true,
        question: true,
        Option1: true,
        Option2: true,
        Option3: true,
        CorrectAnswers: true,
        moduleId: true,
        grade:true,
        image: true,
        userId: true,
      },
    });

    
    return NextResponse.json({
      status: 'success',
      questions,
    });
  } catch (error) {
    console.error("Error during data fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching data',
    }, { status: 500 });
  }
}