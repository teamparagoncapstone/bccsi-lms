import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    
    const students = await prisma.student.findMany({
      select: {
        id: true,
        lrnNo: true,
        firstname: true,
        lastname: true,
        middlename: true,
        sex: true,
        bdate: true,
        age: true,
        grade: true,
        gname: true,
      },
    });

    
    return NextResponse.json({
      status: 'success',
      students,
    });
  } catch (error) {
    console.error("Error during data fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching data',
    }, { status: 500 });
  }
}