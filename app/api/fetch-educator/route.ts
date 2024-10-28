import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const educators = await prisma.educator.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        educatorLevel: true,
        image: true,
      },
      where: {
        educatorLevel: {
          in: ['EducatorOne', 'EducatorTwo', 'EducatorThree'],
        },
      },
    });

    // Replace educator levels
    const updatedEducators = educators.map(educator => ({
      ...educator,
      educatorLevel: educator.educatorLevel ? educator.educatorLevel 
        .replace('EducatorOne', 'Educator 1')
        .replace('EducatorTwo', 'Educator 2')
        .replace('EducatorThree', 'Educator 3')
        : null,
    }));

    return NextResponse.json({
      status: 'success',
      educators: updatedEducators,
    });
  } catch (error) {
    console.error("Error during data fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching data',
    }, { status: 500 });
  }
}