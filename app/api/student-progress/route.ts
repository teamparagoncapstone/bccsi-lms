import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server";


enum Grade {
  GradeOne = "GradeOne",
  GradeTwo = "GradeTwo",
  GradeThree = "GradeThree",
}


interface ModuleProgress {
  total: number;
  completed: number;
}


interface Student {
  id: string;
  firstname: string;
  lastname: string;
  grade: Grade; 
  moduleProgress: ModuleProgress; 
  gradeProgress: string; 
}

export async function GET() {
  try {
    // Fetch all modules
    const modules = await prisma.module.findMany();

    const totalModulesCount = modules.length;

    // Initialize the count of modules per grade
    const modulesByGrade = {
      GradeOne: 0,
      GradeTwo: 0,
      GradeThree: 0,
    };

    // Count modules by grade
    modules.forEach((module) => {
      if (module.grade in modulesByGrade) {
        modulesByGrade[module.grade] += 1;
      }
    });

    // Fetch students with quiz and exercise history
    const students = await prisma.student.findMany({
      include: {
        StudentQuizHistory: {
          include: {
            Question: {
              include: {
                Module: true,
              },
            },
          },
        },
        VoiceExcercisesHistory: {
          include: {
            VoiceExcercises: {
              include: {
                Module: true,
              },
            },
          },
        },
      },
    });

    // Calculate progress for each student
    const studentsWithProgress = students.map((student) => {
      const moduleProgress: ModuleProgress = {
        total: totalModulesCount,
        completed: 0,
      };

      const completedModules = new Set<string>(); // Set to track unique completed modules

      // Iterate over the student's quiz history
      student.StudentQuizHistory.forEach((quizHistory) => {
        if (quizHistory.completed && quizHistory.Question.Module) {
          completedModules.add(quizHistory.Question.Module.id); // Add unique module ID
        }
      });

      // Iterate over the student's voice exercise history
      student.VoiceExcercisesHistory.forEach((exerciseHistory) => {
        if (exerciseHistory.completed && exerciseHistory.VoiceExcercises?.Module) {
          completedModules.add(exerciseHistory.VoiceExcercises.Module.id); // Add unique module ID
        }
      });

      // Update completed modules count
      moduleProgress.completed = completedModules.size; // Count unique completed modules

      // Calculate grade progress as a percentage
      const gradeProgress = moduleProgress.total > 0
        ? ((moduleProgress.completed / moduleProgress.total) * 100).toFixed(2)
        : "0.00";

      return {
        ...student,
        moduleProgress,
        gradeProgress,
      };
    });

    return NextResponse.json({
      students: studentsWithProgress,
      totalModules: totalModulesCount,
      modulesByGrade,
    });
  } catch (error) {
    console.error("Error fetching student progress:", error);
    return NextResponse.json({ error: "Failed to fetch student progress" }, { status: 500 });
  }
}