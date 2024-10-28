import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { username, password, name, image, email, role } = await req.json();

    if (!username || !password || !name || !email ||!image ||!role ) {
      return NextResponse.json({
        status: 'error',
        message: 'Please provide all required fields: email, password, name',
      }, { status: 400 }); 
    }

  
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({
        status: 'error',
        message: 'A user with this username already exists',
      }, { status: 400 });
    }

    const hashed = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashed,
        image,
        role
      },
    });

    return NextResponse.json({
      status: 'success',
      user: {
        email: user.email,
        name: user.name,
        username: user.username,

      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while processing your request',
    }, { status: 500 });
  }
}
