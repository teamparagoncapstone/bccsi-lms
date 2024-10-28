import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getVoiceExercisesHistoryForGradeOne() {
  try {
    const students = await prisma.student.findMany({
      where: {
        grade: 'GradeOne',
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
    console.error("Error fetching voice exercises history:", error);
    throw new Error("Failed to fetch voice exercises history");
  }
}

export async function GET() {
  try {
    const history = await getVoiceExercisesHistoryForGradeOne();
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch voice exercises history' }, { status: 500 });
  }
}