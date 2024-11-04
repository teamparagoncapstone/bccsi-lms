
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/auditLogger"

export async function POST(req: Request) {
  try {
    const { moduleTitle, moduleDescription, learnOutcome1, videoModule, imageModule, grade, subjects, userId } = await req.json();

    if (!moduleTitle || !moduleDescription || !learnOutcome1 || !videoModule || !imageModule || !grade || !subjects || !userId) {
      return NextResponse.json({
        status: 'error',
        message: 'Please provide all required fields',
      }, { status: 400 }); 
    }

    const  newModule = await prisma.module.create({
      data: {
        moduleTitle,
        moduleDescription,
        learnOutcome1,
        videoModule,
        imageModule,
        grade,
        subjects,
        userId, 
      },
    });
    
    await logAudit(userId, "Module Creation",  newModule.id, `Created module: ${moduleTitle}`);
    
    return NextResponse.json({
      status: 'success',
      user: {
        moduleTitle:  newModule.moduleTitle,
      },
    });
  } catch (error) {
    console.error("Error during creation", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while processing your request',
    }, { status: 500 });
  }
}