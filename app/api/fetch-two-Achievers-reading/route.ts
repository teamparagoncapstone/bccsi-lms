import { prisma } from "@/lib/prisma"; // Adjust this import according to your setup
import { NextResponse } from "next/server";

// Define the types
interface Student {
  id: string;
  lrnNo: string | null;
  firstname: string | null;
  lastname: string | null;
  middlename: string | null;
  studentUsername: string | null;
  studentPassword: string | null;
  sex: string | null;
  bdate: string | null;
  age: string | null;
  grade: string | null;
  gname: string | null;
  image: string | null;
  userId: string | null;
}

interface VoiceExercises {
  student: Student;
  score: number;
}

interface HighestScores {
  [studentId: string]: VoiceExercises ;
}


export async function GET(req: Request) {
  try {
    const VoiceExercises = await prisma.voiceExcercisesHistory.findMany({
      where: {
        Student: {
          grade: "GradeTwo", 
        },
      },
      include: {
        Student: true,
      },
    });

    const highestScores: HighestScores = VoiceExercises.reduce((acc, curr) => {
      const studentId = curr.studentId;
      if (!acc[studentId] || curr.score > acc[studentId].score) {
        acc[studentId] = {
          student: curr.Student,
          score: curr.score,
        };
      }
      return acc;
    }, {} as HighestScores);

    return NextResponse.json(Object.values(highestScores) as VoiceExercises[]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}