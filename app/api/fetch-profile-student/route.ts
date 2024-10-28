import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// GET method to fetch student details
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json(
      { status: 'error', message: 'Student ID not provided' },
      { status: 400 }
    );
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        middlename: true,
        studentUsername: true,
        gname: true,
        image: true,
        user: { 
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { status: 'error', message: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 'success', student });
  } catch (error) {
    console.error("Error during data fetching:", error);
    return NextResponse.json(
      { status: 'error', message: 'Error fetching student data' },
      { status: 500 }
    );
  }
}

// POST method to update student and associated user details
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json(
      { status: 'error', message: 'Student ID not provided' },
      { status: 400 }
    );
  }

  const { firstname, lastname, middlename, studentUsername, password, gname } = await req.json();

  try {
    // Prepare user update data
    const userUpdateData: any = {
      name: `${firstname} ${lastname}`,
      username: studentUsername,
    };

    // Hash the password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      userUpdateData.password = hashedPassword;
    }

    // Prepare student update data, including the nested user update
    const updateData = {
      firstname,
      lastname,
      middlename,
      studentUsername,
      gname,
      user: {
        update: userUpdateData,
      },
    };

    // Execute update operation for student and related user data
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: updateData,
      include: { user: true }, 
    });

    return NextResponse.json({ status: 'success', updatedStudent });
  } catch (error) {
    console.error("Error during profile update:", error);
    return NextResponse.json(
      { status: 'error', message: 'Error updating profile' },
      { status: 500 }
    );
  }
}