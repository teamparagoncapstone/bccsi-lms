import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/auditLogger"; 

export async function POST(req: Request) {
  try {
    const comprehensionArray = await req.json(); 

    
    if (!Array.isArray(comprehensionArray) || comprehensionArray.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Please provide a valid array of comprehension test',
      }, { status: 400 });
    }

   
    for (const ComprehensionTest of comprehensionArray) {
      const { voiceId, question: qText, Option1, Option2, Option3, CorrectAnswers, grade, userId } = ComprehensionTest;

      if (!voiceId || !qText || !Option1 || !Option2 || !Option3 || !CorrectAnswers || !grade || !userId) {
        console.error("Missing fields in comprehension:", ComprehensionTest);
        return NextResponse.json({
          status: 'error',
          message: 'Please provide all required fields for each comprehension',
        }, { status: 400 });
      }
    }

   
    const createdComprehension = await prisma.comprehensionTest.createMany({
      data: comprehensionArray,
    });

    
    for (const ComprehensionTest of comprehensionArray) {
      await logAudit(ComprehensionTest.userId, 'ComprehensionTest Creation', 'ComprehensionTest', `Created comprehension test for voice Exercises ${ComprehensionTest.voiceId}`);
    }

    return NextResponse.json({
      status: 'success',
      count: createdComprehension.count, 
    });
  } catch (error) {
    console.error("Error during comprehension test creation", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while processing your request',
    }, { status: 500 });
  }
}