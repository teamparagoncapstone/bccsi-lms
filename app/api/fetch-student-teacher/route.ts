import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
   
    const studentCount = await prisma.student.count();
    const teacherCount = await prisma.user.count({
      where: {
        role: 'Teacher',
      },
    });

 
    const gradeCounts = await Promise.all([
      prisma.student.count({ where: { grade: 'GradeOne' } }),
      prisma.student.count({ where: { grade: 'GradeTwo' } }),
      prisma.student.count({ where: { grade: 'GradeThree' } }),
    ]);

 
    const educatorCounts = await Promise.all([
      prisma.educator.count({ where: { educatorLevel: 'EducatorOne' } }),
      prisma.educator.count({ where: { educatorLevel: 'EducatorTwo' } }),
      prisma.educator.count({ where: { educatorLevel: 'EducatorThree' } }),
    ]);

   
    const response = {
      studentCount,
      teacherCount,
      students: {
        GradeOne: gradeCounts[0],
        GradeTwo: gradeCounts[1],
        GradeThree: gradeCounts[2],
      },
      educators: {
        EducatorOne: educatorCounts[0],
        EducatorTwo: educatorCounts[1],
        EducatorThree: educatorCounts[2],
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error counting students and teachers:', error);
    return NextResponse.json({ error: 'Failed to count' }, { status: 500 });
  }
}