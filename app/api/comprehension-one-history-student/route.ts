import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const comprehensionHistories = await prisma.comprehensionHistory.findMany({
      where: {
        ComprehensionTest: {
          grade: "GradeOne",
        },
      },
      select: {
        id: true,
        score: true,
        feedback: true,
        chooseAnswer: true,
        correctAnswersCount: true,
        wrongAnswersCount: true,
        CorrectAnswer: true,
        createdAt: true, 
        ComprehensionTest: {
          select: {
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

   
    const formattedHistory = comprehensionHistories.map((history) => ({
      id: history.id,
      score: history.score,
      feedback: history.feedback,
      correctAnswersCount : history.correctAnswersCount ,
      wrongAnswersCount: history. wrongAnswersCount,
      CorrectAnswer: history.CorrectAnswer,
      createdAt: history.createdAt,
      question: history.ComprehensionTest.question,
      Option1: history.ComprehensionTest.Option1,
      Option2: history.ComprehensionTest.Option2,
      Option3: history.ComprehensionTest.Option3,
      Student: history.Student,
      voice: history.ComprehensionTest?.VoiceExcercises?.voice,
    }));

    return NextResponse.json({ status: "success", history: formattedHistory });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "error", message: 'Failed to fetch comprehension history' }, { status: 500 });
  }
}