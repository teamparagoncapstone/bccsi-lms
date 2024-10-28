import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { logAudit } from '@/lib/auditLogger'; 

enum Grade {
  GradeOne = 'GradeOne',
  GradeTwo = 'GradeTwo',
  GradeThree = 'GradeThree',
}

enum Gender {
  Male = 'Male',
  Female = 'Female',
}

interface UpdateStudentRequestBody {
  id: string;
  lrnNo: string;
  firstname: string;
  lastname: string;
  middlename: string;
  studentUsername: string;
  studentPassword: string;
  sex: Gender;
  bdate: string;
  age: string;
  grade: Grade;
  gname: string;
  image: string;
}

interface DeleteStudentRequestBody {
  id: string;
}

export async function PUT(req: Request) {
  try {
    const body: UpdateStudentRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const hashedPassword = await hash(body.studentPassword, 12);

    // Update the student
    const updatedStudent = await prisma.student.update({
      where: { id: body.id },
      data: {
        lrnNo: body.lrnNo,
        firstname: body.firstname,
        lastname: body.lastname,
        middlename: body.middlename,
        studentUsername: body.studentUsername,
        studentPassword: hashedPassword,
        sex: body.sex,
        grade: body.grade,
        age: body.age,
        bdate: body.bdate,
        gname: body.gname,
        image: body.image,
        user: {
          update: {
            name: `${body.firstname} ${body.lastname}`,
            username: body.studentUsername,
            password: hashedPassword,
          },
        },
      },
    });

   
    await logAudit(body.studentUsername, 'Update Student', 'Student', `Updated student : ${body.id}`);

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body: DeleteStudentRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

   
    const student = await prisma.student.findUnique({
      where: { id: body.id },
      select: { userId: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    
    const deletedStudent = await prisma.student.delete({
      where: { id: body.id },
    });

  
    if (student.userId) {
      await prisma.user.delete({
        where: { id: student.userId },
      });
    }


    await logAudit(null, 'Delete Student', 'Student', `Deleted student with ID: ${body.id}`);

    return NextResponse.json(deletedStudent);
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}