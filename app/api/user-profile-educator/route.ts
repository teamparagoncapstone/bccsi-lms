import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const educatorId = url.searchParams.get("educatorId");

  if (!educatorId) {
    return NextResponse.json(
      { status: "error", message: "Educator ID not provided" },
      { status: 400 }
    );
  }

  try {
    const requestBody = await req.json();
    const { name, username, email, password } = requestBody;

    const educator = await prisma.educator.findUnique({
      where: { id: educatorId },
      include: { user: true },
    });

    if (!educator || !educator.user) {
      return NextResponse.json(
        { status: "error", message: "User associated with Educator not found" },
        { status: 404 }
      );
    }

    const educatorUpdateData: any = { name, username, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      educatorUpdateData.password = hashedPassword;
    }

    
    const updatedEducator = await prisma.educator.update({
      where: { id: educatorId },
      data: {
        ...educatorUpdateData,
        user: {
          update: {
            name,
            username,
            email,
            password: educatorUpdateData.password,
          },
        },
      },
      include: { user: true },
    });

    return NextResponse.json({ status: "success", updatedEducator });
  } catch (error) {
    console.error("Error updating educator and user:", error);
    return NextResponse.json(
      { status: "error", message: "Error updating profile" },
      { status: 500 }
    );
  }
}