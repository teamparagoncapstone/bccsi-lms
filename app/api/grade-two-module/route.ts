import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const gradeTwoModules = await prisma.module.findMany({
      where: {
        grade: 'GradeTwo', 
      },
      select: {
        moduleTitle: true,
        imageModule: true,
        videoModule: true, 
        moduleDescription: true, 
        learnOutcome1: true, 
        subjects: true,
      },
    });

    return NextResponse.json({
      status: 'success',
      modules: gradeTwoModules,
    });
  } catch (error) {
    console.error("Error fetching modules", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching modules',
    }, { status: 500 });
  }
}