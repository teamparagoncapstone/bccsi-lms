import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const comprehensionHistories = await prisma.comprehensionHistory.findMany({
      where: {
        ComprehensionTest: {
          grade: "GradeThree",
        },
      },
      select: {
        id: true,
        score: true,
        feedback: true,
        chooseAnswer: true,
        CorrectAnswer: true,
        ComprehensionTest: {
          select: {
            id: true,
            question: true,
            Option1: true,
            Option2: true,
            Option3: true,
            CorrectAnswers: true,
            VoiceExcercises: {
              select: {
                voice: true, 
              },
            },
          },
        },
        Student: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return NextResponse.json(comprehensionHistories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch comprehension history' }, { status: 500 });
  }
}