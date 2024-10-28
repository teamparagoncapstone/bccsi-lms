import { NextResponse } from 'next/server';
import { PrismaClient, VoiceExcercises } from '@prisma/client';

const prisma = new PrismaClient();

// Define types for the voice exercises report
interface VoiceExerciseScore {
  name: string;
  score: number;
}

interface VoiceExercisesReport {
  totalExercises: number;
  totalScores: number;
  averageScore: number;
  exercises: VoiceExerciseScore[];
}

// Define type for the exercise with history
interface ExerciseWithHistory extends VoiceExcercises {
  VoiceExercisesHistory: { // Correct property name
    score: number;
    Student: {
      firstname: string | null; // Allow null for optional properties
      lastname: string | null; // Allow null for optional properties
    };
  }[];
}

// Named export for the GET method
export async function GET(): Promise<NextResponse<VoiceExercisesReport | { error: string }>> {
  try {
    const exercises: ExerciseWithHistory[] = await prisma.voiceExcercises.findMany({
      include: {
        VoiceExercisesHistory: { // Correct property name
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

    const report: VoiceExercisesReport = {
      totalExercises: exercises.length,
      totalScores: 0,
      averageScore: 0,
      exercises: [],
    };

    exercises.forEach((exercise) => {
      exercise.VoiceExercisesHistory.forEach((history) => { // Correct property name
        report.totalScores += history.score;

        const firstname = history.Student.firstname || 'Unknown';
        const lastname = history.Student.lastname || 'Student';

        report.exercises.push({
          name: `${firstname} ${lastname}`,
          score: history.score,
        });
      });
    });

    report.averageScore = report.exercises.length > 0 ? report.totalScores / report.exercises.length : 0;

    return NextResponse.json(report); // Return the report as a JSON response
  } catch (error) {
    console.error("Error fetching voice exercises report:", error);
    return NextResponse.json({ error: "Unable to fetch report" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure the database connection is closed
  }
}