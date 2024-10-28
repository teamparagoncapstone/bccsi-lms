import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const studentId = url.searchParams.get('studentId');
  const moduleTitle = url.searchParams.get('moduleTitle');

  if (!studentId || !moduleTitle) {
    return NextResponse.json({
      status: 'error',
      message: 'Student ID and Module title are required',
    }, { status: 400 });
  }

  try {
    // Find if the student has already completed the quiz
    const completedQuiz = await prisma.studentQuizHistory.findFirst({
      where: {
        studentId,
        Question: {
          Module: {
            moduleTitle,
          },
        },
        completed: true,
      },
    });

    return NextResponse.json({
      status: 'success',
      isSubmitted: !!completedQuiz,
    });
  } catch (error) {
    console.error("Error checking quiz completion status:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while checking quiz status',
    }, { status: 500 });
  }
}