import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetching all quiz histories
    const quizHistories = await prisma.studentQuizHistory.findMany({
      select: {
        score: true,
      },
    });

    // Initialize score distribution
    const scoreDistribution = {
      labels: ['0-50', '51-70', '71-85', '86-100'],
      values: [0, 0, 0, 0],
    };

    // Calculate score distribution
    quizHistories.forEach((history) => {
      if (history.score <= 50) {
        scoreDistribution.values[0]++;
      } else if (history.score <= 70) {
        scoreDistribution.values[1]++;
      } else if (history.score <= 85) {
        scoreDistribution.values[2]++;
      } else {
        scoreDistribution.values[3]++;
      }
    });

    // Respond with the score distribution
    return NextResponse.json(scoreDistribution, { status: 200 });
  } catch (error) {
    console.error('Error fetching quiz scores:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}