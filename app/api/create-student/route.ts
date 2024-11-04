import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { logAudit } from "@/lib/auditLogger";

export async function POST(req: Request) {
  try {
    const {
      lrnNo, firstname, lastname, middlename, grade, sex, bdate, age, gname, image,
      studentUsername, studentPassword, userId, 
    } = await req.json();

    const missingFields = [];

    if (!lrnNo) missingFields.push("lrnNo");
    if (!firstname) missingFields.push("firstname");
    if (!lastname) missingFields.push("lastname");
    if (!middlename) missingFields.push("middlename");
    if (!grade) missingFields.push("grade");
    if (!sex) missingFields.push("sex");
    if (!bdate) missingFields.push("bdate");
    if (!age) missingFields.push("age");
    if (!gname) missingFields.push("gname");
    if (!image) missingFields.push("image");
    if (!studentUsername) missingFields.push("studentUsername");
    if (!studentPassword) missingFields.push("studentPassword");

    if (missingFields.length > 0) {
      return NextResponse.json({
        status: 'error',
        message: `Please provide all required fields: ${missingFields.join(', ')}`,
      }, { status: 400 });
    }

    // Check if the username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: studentUsername },
    });

    if (existingUser) {
      return NextResponse.json({
        status: 'error',
        message: 'Username already exists. Please choose another one.',
      }, { status: 400 });
    }

    const hashedPassword = await hash(studentPassword, 12);

    const createdUser = await prisma.user.create({
      data: {
        username: studentUsername,
        password: hashedPassword,
        image: image,
        name: `${firstname} ${lastname}`,
        role: 'Student', 
      },
    });

    if (!createdUser || !createdUser.id) {
      throw new Error("User creation failed");
    }

    const student = await prisma.student.create({
      data: {
        lrnNo,
        firstname,
        lastname,
        middlename,
        grade,
        sex,
        bdate,
        age,
        gname,
        image,
        studentUsername,
        studentPassword: hashedPassword, 
        user: {
          connect: {
            id: createdUser.id,
          },
        },
      },
    });
    
    try {
      
      await logAudit(userId, "Student Creation", student.id, `Created student: ${student.firstname} ${student.lastname}, Username: ${studentUsername}`);
    } catch (auditError) {
      console.error("Audit logging failed:", auditError);
    }

    return NextResponse.json({
      status: 'success',
      student: {
        lrnNo: student.lrnNo,
        firstname: student.firstname,
        lastname: student.lastname,
        middlename: student.middlename,
        grade: student.grade,
        sex: student.sex,
        age: student.age,
        gname: student.gname,
        image: student.image,
        studentUsername: student.studentUsername,
      },
    });
  } catch (error) {
    console.error("Error during creation:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while processing your request',
    }, { status: 500 });
  }
}