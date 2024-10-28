import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name:true,
        email: true,
        role: true,
        image: true
      },
      where: {
        role: {
          in: ['Administrator', 'Principal', 'Registrar'], 
        },
      },
    });

  
    return NextResponse.json({
      status: 'success',
      users,
    });
  } catch (error) {
    console.error("Error during data fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching data',
    }, { status: 500 });
  }
}