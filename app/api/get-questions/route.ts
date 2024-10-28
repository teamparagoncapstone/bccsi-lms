import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET(request: Request) {
  const url = new URL(request.url);
  const moduleTitle = url.searchParams.get('moduleTitle');

  if (!moduleTitle) {
    return NextResponse.json({
      status: 'error',
      message: 'Module title parameter is required',
    }, { status: 400 });
  }
      
  try {
    // Fetch questions based on the module title from the database
    const questions = await prisma.questions.findMany({
      where: {
        Module: {
          moduleTitle: moduleTitle,
        },
      },
      include: {
        Module: true, // Include related module if needed
      },
    });

    // Check if questions were retrieved successfully
    if (!questions) {
      return NextResponse.json({
        status: 'error',
        message: 'No questions found',
      }, { status: 404 });
    }

    // Return the questions in the response
    return NextResponse.json({
      status: 'success',
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching questions',
    }, { status: 500 });
  }
}