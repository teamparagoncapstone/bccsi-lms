import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    
    const gradeOneModules = await prisma.module.findMany({
      where: {
        grade: "GradeThree",
      },
      select: {
        id: true,
        moduleTitle: true,
      },
    });

   
    const studentCompletion = await prisma.student.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        StudentProgress: {
          select: {
            progress: true,
            moduleId: true,
          },
        },
        StudentQuizHistory: {
          select: {
            completed: true,
            score: true,
          },
        },
        VoiceExcercisesHistory: {
          select: {
            completed: true,
            score: true, 
          },
        },
      },
    });

    
    const filteredData = studentCompletion.map((student) => {
      const gradeOneProgress = student.StudentProgress.filter((progress) =>
        gradeOneModules.some((module) => module.id === progress.moduleId)
      );

      const totalModules = gradeOneModules.length;
      const totalProgress = gradeOneProgress.reduce(
        (acc, progress) => acc + progress.progress,
        0
      );

      const averageModuleProgress =
        totalModules > 0 ? totalProgress / totalModules : 0;

      
      const quizScores = student.StudentQuizHistory
        .filter((q) => q.completed)
        .map((q) => q.score || 0); 
      const voiceExerciseScores = student.VoiceExcercisesHistory
        .filter((v) => v.completed)
        .map((v) => v.score || 0);

      const averageQuizScore =
        quizScores.length > 0
          ? quizScores.reduce((acc, score) => acc + score, 0) / quizScores.length
          : 0;

      const averageVoiceExerciseScore =
        voiceExerciseScores.length > 0
          ? voiceExerciseScores.reduce((acc, score) => acc + score, 0) /
            voiceExerciseScores.length
          : 0;

      
      const combinedCompletionAverage =
        (averageModuleProgress + averageQuizScore + averageVoiceExerciseScore) / 3;

      return {
        ...student,
        StudentProgress: gradeOneProgress,
        totalModules,
        averageProgress: combinedCompletionAverage, 
      };
    });

    return new Response(JSON.stringify(filteredData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}