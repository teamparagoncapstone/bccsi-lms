import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/auditLogger'; 

enum Grade {
  GradeOne = 'GradeOne',
  GradeTwo = 'GradeTwo',
  GradeThree = 'GradeThree',
}

interface UpdateComprehensionRequestBody {
  id: string;
  question: string;
  Option1: string;
  Option2: string;
  Option3: string;
  CorrectAnswers: string;
  image: string;
  grade: Grade;
  // userId: string;
}

interface DeleteComprehensionRequestBody {
  id: string;
}

export async function PUT(req: Request) {
  try {
    const body: UpdateComprehensionRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Comprehension Test ID is required' }, { status: 400 });
    }

    const updatedComprehension = await prisma.comprehensionTest.update({
      where: { id: body.id },
      data: {
        question: body.question,
        Option1: body.Option1,
        Option2: body.Option2,
        Option3: body.Option3,
        image: body.image,
        CorrectAnswers: body.CorrectAnswers,
        grade: body.grade,
        // userId: body.userId,
      },
    });

   
    // await logAudit(body.userId, 'Update ComprehensionTest', 'ComprehensionTest', `Updated comprehension test : ${body.question}`);

    return NextResponse.json(updatedComprehension);
  } catch (error) {
    console.error('Error updating comprehension test:', error);

    if (error instanceof Error) {
      if (error.message.includes('P2025')) {
        return NextResponse.json({ error: 'Comprehension Test not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to update comprehension test' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body: DeleteComprehensionRequestBody = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Comprehension Test ID is required' }, { status: 400 });
    }

    const deletedComprehension = await prisma.comprehensionTest.delete({
      where: { id: body.id },
    });

    
    // await logAudit(null, 'Delete ComprehensionTest', 'ComprehensionTest', `Deleted comprehension test with ID: ${body.id}`);

    return NextResponse.json(deletedComprehension);
  } catch (error) {
    console.error('Error deleting comprehension test:', error);

    if (error instanceof Error) {
      if (error.message.includes('P2025')) {
        return NextResponse.json({ error: 'Comprehension Test not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to delete comprehension test' }, { status: 500 });
  }
}