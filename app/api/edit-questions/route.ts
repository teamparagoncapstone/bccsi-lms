import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/auditLogger'; 

enum Grade {
  GradeOne = 'GradeOne',
  GradeTwo = 'GradeTwo',
  GradeThree = 'GradeThree',
}

interface UpdateQuestionRequestBody {
  id: string;
  question: string;
  Option1: string;
  Option2: string;
  Option3: string;
  CorrectAnswers: string;
  moduleId: string;
  grade: Grade;
  // userId: string;
}

interface DeleteQuestionRequestBody {
  id: string;
}

export async function PUT(req: Request) {
  try {
    const body: UpdateQuestionRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

 
    const updatedQuestion = await prisma.questions.update({
      where: { id: body.id },
      data: {
        question: body.question,
        Option1: body.Option1,
        Option2: body.Option2,
        Option3: body.Option3,
        CorrectAnswers: body.CorrectAnswers,
        grade: body.grade,
        moduleId: body.moduleId,
        // userId: body.userId,
      },
    });

    
    // await logAudit(body.userId, 'Update Question', 'Question', `Updated question : ${body.question}`);

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);

    if (error instanceof Error) {
      if (error.message.includes('P2025')) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body: DeleteQuestionRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

   
    const deletedQuestion = await prisma.questions.delete({
      where: { id: body.id },
    });

   
    // await logAudit(null, 'Delete Module', 'Question', `Deleted question with ID: ${body.id}`);

    return NextResponse.json(deletedQuestion);
  } catch (error) {
    console.error('Error deleting question:', error);

    if (error instanceof Error) {
      if (error.message.includes('P2025')) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}