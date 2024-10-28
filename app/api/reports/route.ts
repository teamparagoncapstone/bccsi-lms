import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server'; // Import NextRequest

const prisma = new PrismaClient();

interface GroupedHistory {
  [studentId: string]: {
    student: any;
    modules: {
      [moduleId: string]: {
        moduleTitle: string;
        totalScore: number;
        quizzes: any[];
        totalQuestions: number; 
      };
    };
  };
}

enum Grade {
  GradeOne = 'GradeOne',
  GradeTwo = 'GradeTwo',
  GradeThree = 'GradeThree',
}


async function getStudentQuizHistoryByGrades(grade: Grade) {
  try {
    const students = await prisma.student.findMany({
      where: {
        grade,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    });

    const studentIds = students.map(student => student.id);

    const quizHistory = await prisma.studentQuizHistory.findMany({
      where: {
        studentId: {
          in: studentIds,
        },
      },
      include: {
        Student: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        Question: {
          include: {
            Module: {
              select: {
                moduleTitle: true,
              },
            },
          },
        },
      },
    });

    return quizHistory.map(history => ({
      student: `${history.Student.firstname} ${history.Student.lastname}`,
      moduleTitle: history.Question.Module.moduleTitle,
      totalQuestions: history.totalQuestions || 0,
      score: history.score,
    }));
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    throw new Error('Failed to fetch quiz history');
  }
}

// Fetches voice exercises history by grade
async function getVoiceExercisesHistory(grade: Grade) {
  try {
    const students = await prisma.student.findMany({
      where: {
        grade,
      },
      select: {
        id: true,
      },
    });

    const studentIds = students.map(student => student.id);

    const history = await prisma.voiceExcercisesHistory.findMany({
      where: {
        studentId: {
          in: studentIds,
        },
      },
      include: {
        Student: true,
        VoiceExcercises: {
          include: {
            Module: {
              select: {
                moduleTitle: true,
              },
            },
          },
        },
      },
    });

    return history.map(item => ({
      ...item,
      moduleTitle: item.VoiceExcercises?.Module?.moduleTitle,
    }));
  } catch (error) {
    console.error('Error fetching voice exercises history:', error);
    throw new Error('Failed to fetch voice exercises history');
  }
}

// Fetches comprehension history by grade
async function getComprehensionHistory(grade: Grade) {
  try {
    const comprehensionHistories = await prisma.comprehensionHistory.findMany({
      where: {
        ComprehensionTest: {
          grade, // Ensure grade is checked in the ComprehensionTest model
        },
      },
      include: {
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

    // Since totalQuestions is part of the ComprehensionHistory, we don't need to fetch it from ComprehensionTest
    return comprehensionHistories.map((history) => ({
      ...history,
      totalQuestions: history.totalQuestions || 0, // Use totalQuestions from ComprehensionHistory
    }));
  } catch (error) {
    console.error('Error fetching comprehension history:', error);
    throw new Error('Failed to fetch comprehension history');
  }
}

// Main endpoint for fetching all histories
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const grade = searchParams.get("grade") as Grade | null;

  if (!grade || !(Object.values(Grade).includes(grade))) {
    return NextResponse.json({ error: 'Invalid or missing grade' }, { status: 400 });
  }

  try {
    const quizHistory = await getStudentQuizHistoryByGrades(grade);
    const voiceExercisesHistory = await getVoiceExercisesHistory(grade);
    const comprehensionHistory = await getComprehensionHistory(grade);

    const combinedHistory = {
      quizHistory,
      voiceExercisesHistory,
      comprehensionHistory,
    };

    return NextResponse.json(combinedHistory);
  } catch (error) {
    console.error('Error fetching histories:', error);
    return NextResponse.json({ error: 'Failed to fetch histories' }, { status: 500 });
  }
}









