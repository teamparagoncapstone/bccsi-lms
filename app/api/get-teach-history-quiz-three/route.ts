import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Student {
  id: string;
  firstname: string | null; // Updated
  lastname: string | null;
  grade: string;
}

interface Quiz {
  id: string;
  question: string;
  score: number;
  Question: {
    Module: {
      id: string;
      moduleTitle: string;
    };
  };
}

interface GroupedHistory {
  [studentId: string]: {
    student: Student;
    modules: {
      [moduleId: string]: {
        moduleTitle: string;
        totalScore: number;
        quizzes: Quiz[];
      };
    };
  };
}

async function getStudentQuizHistoryByGrades() {
  try {
    const quizHistory = await prisma.studentQuizHistory.findMany({
      include: {
        Student: true,
        Question: {
          include: {
            Module: true,
          },
        },
      },
    });

    // Filter for Grade One students
    const filteredQuizHistory = quizHistory.filter(item => item.Student.grade === 'GradeThree');

    const groupedHistory: GroupedHistory = filteredQuizHistory.reduce((acc, curr) => {
      const studentId = curr.studentId;
      const moduleId = curr.Question.Module.id;

      if (!acc[studentId]) {
        acc[studentId] = {
          student: curr.Student,
          modules: {},
        };
      }

      if (!acc[studentId].modules[moduleId]) {
        acc[studentId].modules[moduleId] = {
          moduleTitle: curr.Question.Module.moduleTitle,
          totalScore: curr.score,
          quizzes: [curr], 
        };
      } else {
       
        acc[studentId].modules[moduleId].quizzes.push(curr);
      }

      return acc;
    }, {} as GroupedHistory);

    return Object.values(groupedHistory).map(student => ({
      ...student,
      modules: Object.values(student.modules),
    }));
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    throw new Error("Failed to fetch quiz history");
  }
}

export async function GET() {
  try {
    const history = await getStudentQuizHistoryByGrades();
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quiz history' }, { status: 500 });
  }
}