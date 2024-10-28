import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { Grade } from '@prisma/client'; 


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json({
      status: 'error',
      message: 'Student ID is required',
    }, { status: 400 });
  }

  try {
    // Fetch all modules assigned for Grade One students
    const modules = await prisma.module.findMany({
      where: {
        grade: Grade.GradeOne,
      },
      include: {
        Questions: {
          include: {
            StudentQuizHistory: {
              where: { studentId },
            },
          },
        },
        VoiceExcercises: {
          include: {
            VoiceExercisesHistory: {
              where: { studentId },
            },
          },
        },
      },
    });

    let completedModules = [];
    let inProgressModules = [];

    // Loop through each module to categorize them as in progress or completed
    modules.forEach((module) => {
      const quizzesCompleted = module.Questions?.every((question: any) => {
        const quizHistory = question.StudentQuizHistory;
        return quizHistory.length > 0 && quizHistory.every((quiz: any) => quiz.completed);
      });

      const voiceExercisesCompleted = module.VoiceExcercises?.every((exercise: any) => {
        const voiceExerciseHistory = exercise.VoiceExercisesHistory;
        return voiceExerciseHistory.length > 0 && voiceExerciseHistory.every((exerciseHistory: any) => exerciseHistory.completed);
      });

      if (quizzesCompleted && voiceExercisesCompleted) {
        // If all quizzes and voice exercises are completed, mark the module as completed
        completedModules.push(module);
      } else if (!quizzesCompleted || !voiceExercisesCompleted) {
        // If at least one quiz or voice exercise is incomplete, mark it as in progress
        inProgressModules.push(module);
      }
    });

    // Return all modules as assignedModules and differentiate the other categories
    return NextResponse.json({
      status: 'success',
      assignedModules: modules.length, // All modules for Grade One
      inProgressModules: inProgressModules.length,
      completedModules: completedModules.length,
    });
  } catch (error) {
    console.error('Error fetching assigned modules:', error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching the assigned modules.',
    }, { status: 500 });
  }
}