import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

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
    const history = await prisma.voiceExcercisesHistory.findMany({
      where: { studentId: studentId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      status: 'success',
      history: history,
    });
  } catch (error) {
    console.error('Error fetching voice exercises history:', error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching the voice exercises history.',
    }, { status: 500 });
  }
}