import { NextResponse } from "next/server";
import { PrismaClient, Grade } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    
    const moduleCount = await prisma.module.count({
      where: {
        grade: Grade.GradeTwo, 
      },
    });

   
    const questionCount = await prisma.questions.count({
      where: {
        grade: Grade.GradeTwo,
      },
    });

    
    const voiceExerciseCount = await prisma.voiceExcercises.count({
      where: {
        grade: Grade.GradeTwo, 
      },
    });

    return NextResponse.json({
      status: 'success',
      counts: {
        modules: moduleCount,
        questions: questionCount,
        voiceExercises: voiceExerciseCount,
      },
    });
  } catch (error) {
    console.error("Error during data fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching data',
    }, { status: 500 });
  }
}