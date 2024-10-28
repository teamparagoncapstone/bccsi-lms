import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { logAudit } from "@/lib/auditLogger"; 

export async function POST(req: Request) {
  try {
    const { username, role, password, email, name, image } = await req.json();

   
    if (!username || !role || !password || !name || !email || !image) {
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
        email,
        username,
        name,
        role,
        password: hashed,
        image,
      },
    });

   
    await logAudit(user.id, "User Creation", "User", `Created user: ${username}`);

    // Return success response
    return NextResponse.json({
      status: 'success',
      user: {
        email: user.email,
        name: user.name,
        username: user.username,
        image: user.image,
        role: user.role,
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