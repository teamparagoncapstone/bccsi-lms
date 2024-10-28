import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateStudentAwards } from '@/lib/award';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Request Body:', body);

    const {
      question,
      Option1,
      Option2,
      Option3,
      CorrectAnswer,
      chooseAnswer,
      studentUsername,
      score,
      feedback,
      attemptCount,
      totalQuestions,
      correctAnswersCount,
      wrongAnswersCount,
      questionId,
    } = body;

    // Validate required fields
    if (!question || !Option1 || !Option2 || !Option3 || !CorrectAnswer || !studentUsername || !questionId) {
      return NextResponse.json({
        status: 'error',
        message: 'Please provide all required fields',
      }, { status: 400 });
    }

    // Find the student by username
    const studentFind = await prisma.student.findUnique({
      where: { studentUsername },
    });

    // Check if the student was found
    if (!studentFind) {
      return NextResponse.json({
        status: 'error',
        message: 'Student not found',
      }, { status: 404 });
    }

    // Create a new entry in the StudentQuizHistory
    await prisma.studentQuizHistory.create({
      data: {
        question,
        Option1,
        Option2,
        Option3,
        CorrectAnswer,
        chooseAnswer,
        score,
        feedback,
        attemptCount,
        correctAnswersCount,
        wrongAnswersCount,
        totalQuestions,
        completed: true,
        Question: {
          connect: { id: questionId }, 
        },
        Student: {
          connect: { id: studentFind.id }, 
        },
      } as any, 
    });


    await calculateStudentAwards(studentFind.id);

    
    return NextResponse.json({
      status: 'success',
      message: 'Quiz submitted successfully',
    });
  } catch (error) {
    console.error('Error during submission:', error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while processing your request',
    }, { status: 500 });
  }
}