import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define types for the report
interface StudentScore {
  name: string;
  score: number;
}

interface QuizPerformanceReport {
  totalQuizzes: number;
  totalScores: number;
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  averageScore: number;
  students: StudentScore[];
}

// Define a type for error responses
interface ErrorResponse {
  error: string;
}

// Union type for the response
type QuizPerformanceResponse = QuizPerformanceReport | ErrorResponse;

// Named export for the GET method
export async function GET(): Promise<NextResponse<QuizPerformanceResponse>> {
  try {
    const quizzes = await prisma.questions.findMany({
      include: {
        StudentQuizHistory: {
          select: {
            score: true,
            Student: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });

    const report: QuizPerformanceReport = {
      totalQuizzes: quizzes.length,
      totalScores: 0,
      totalQuestions: quizzes.length,
      totalCorrect: 0,
      totalWrong: 0,
      averageScore: 0,
      students: [],
    };

    quizzes.forEach((quiz) => {
      quiz.StudentQuizHistory.forEach((history) => {
        report.totalScores += history.score;

        if (history.score > 0) {
          report.totalCorrect += 1;
        } else {
          report.totalWrong += 1;
        }

        const firstname = history.Student.firstname || 'Unknown';
        const lastname = history.Student.lastname || 'Student';

        report.students.push({
          name: `${firstname} ${lastname}`,
          score: history.score,
        });
      });
    });

    report.averageScore = report.students.length > 0 ? report.totalScores / report.students.length : 0;

    return NextResponse.json(report); // Return the report as a JSON response
  } catch (error) {
    console.error("Error fetching quiz performance report:", error);
    // Return an error response with a specific status
    return NextResponse.json({ error: "Unable to fetch report" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure the database connection is closed
  }
}