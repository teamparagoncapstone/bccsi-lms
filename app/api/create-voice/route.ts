import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/auditLogger"; // Assuming you have the logAudit function in this path

export async function POST(req: Request) {
  try {
    const voiceArray = await req.json();

   
    if (!Array.isArray(voiceArray) || voiceArray.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Please provide a valid array of voice exercises',
      }, { status: 400 });
    }

  
    for (const voice of voiceArray) {
      const { moduleId, voice: qText, grade, userId } = voice;

      if (!moduleId || !qText || !grade || !userId) {
        console.error("Missing fields in voice exercise:", voice); 
        return NextResponse.json({
          status: 'error',
          message: 'Please provide all required fields for each voice exercise',
        }, { status: 400 });
      }
    }

    
    const createdvoice = await prisma.voiceExcercises.createMany({
      data: voiceArray,
    });

    
    for (const voice of voiceArray) {
      await logAudit(voice.userId, 'Voice Exercises Creation', 'VoiceExercise', `Created voice exercise for module ${voice.moduleId}`);
    }

    return NextResponse.json({
      status: 'success',
      count: createdvoice.count, 
    });
  } catch (error) {
    console.error("Error during voice exercise creation", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while processing your request',
    }, { status: 500 });
  }
}
