import { prisma } from "@/lib/prisma"; 

export async function calculateStudentAwards(studentId: string){
  
  const quizHistory = await prisma.studentQuizHistory.findMany({
    where: { studentId },
  });

  const voiceHistory = await prisma.voiceExcercisesHistory.findMany({
    where: { studentId },
  });


  if (quizHistory.length === 0 && voiceHistory.length === 0) {
    return; 
  }

  
  const totalQuizScore = quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
  const totalVoiceScore = voiceHistory.reduce((sum, voice) => sum + voice.score, 0);

  const averageQuizScore = quizHistory.length > 0 ? totalQuizScore / quizHistory.length : 0;
  const averageVoiceScore = voiceHistory.length > 0 ? totalVoiceScore / voiceHistory.length : 0;

  const quizAward = assignAward(averageQuizScore);
  const voiceAward = assignAward(averageVoiceScore);

 
  if (quizAward) {
    await prisma.award.create({
      data: {
        studentId,
        awardType: quizAward,
        tier: "Quiz",  
        createdAt: new Date(),
      },
    });
  }

  if (voiceAward) {
    await prisma.award.create({
      data: {
        studentId,
        awardType: voiceAward,
        tier: "Voice",  
        createdAt: new Date(),
      },
    });
  }
}

function assignAward(averageScore: number) {
  if (averageScore >= 95) return "Star Badge"; 
  if (averageScore >= 90) return "Gold Badge";
  if (averageScore >= 80) return "Silver Badge";
  if (averageScore >= 70) return "Bronze Badge";
  return null;
}