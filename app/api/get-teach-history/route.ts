import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getStudentQuizHistoryByGrades() {
  try {
    const quizHistory = await prisma.studentQuizHistory.findMany({
      include: {
        Student: true,
      },
    });
    return quizHistory;
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