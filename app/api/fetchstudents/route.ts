import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        lrnNo: true,
        grade: true,
        sex: true,
        bdate: true,
        age: true,
        image: true,
        gname: true,
        firstname: true,
        lastname: true,
        middlename: true,
        studentUsername: true,
        studentPassword: true,
      },
    });

  
    const updatedStudents = students.map(student => ({
      ...student,
      grade: student.grade
        .replace('GradeOne', 'Grade 1')
        .replace('GradeTwo', 'Grade 2')
        .replace('GradeThree', 'Grade 3'),
    }));

    return NextResponse.json({
      status: 'success',
      students: updatedStudents,
    });
  } catch (error) {
    console.error("Error during data fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching data',
    }, { status: 500 });
  }
}