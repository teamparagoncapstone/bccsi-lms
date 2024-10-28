import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VoiceExercises } from '@/components/forms/voiceExercises';

export async function GET() {
  try {
   
    const voiceExercises = await prisma.voiceExcercisesHistory.findMany({
      where: { VoiceExcercises: { grade: 'GradeThree' } }, 
      select: { score: true },
    });

    const maxVoiceScore = 100;
    const totalVoiceScore = voiceExercises.reduce((acc, exercise) => {
      const normalizedScore = (exercise.score / maxVoiceScore) * 100;
      return acc + normalizedScore;
    }, 0);
    const averageVoiceScore = voiceExercises.length === 0 ? 0 : totalVoiceScore / voiceExercises.length;

    
    const quizHistory = await prisma.studentQuizHistory.findMany({
      where: { Question: { grade: 'GradeThree' } }, 
      select: { score: true },
    });

    const maxQuizScore = 100;
    const totalQuizScore = quizHistory.reduce((acc, quiz) => {
      const normalizedScore = (quiz.score / maxQuizScore) * 100;
      return acc + normalizedScore;
    }, 0);
    const averageQuizScore = quizHistory.length === 0 ? 0 : totalQuizScore / quizHistory.length;

    return NextResponse.json({
      averageVoiceScore: averageVoiceScore.toFixed(2),
      averageQuizScore: averageQuizScore.toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}