"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComprehensionForm } from "./comprehensionForm";
interface ComprehensionTest {
  id: string;
  question: string;
  Option1: string;
  Option2: string;
  Option3: string;
  CorrectAnswers: string;
  image?: string;
}
interface ComprehensionListProps {
  voice: string;
}
export default function ComprehensionList({ voice }: ComprehensionListProps) {
  const { data: session } = useSession();
  const studentId = session?.user.studentId || "";
  const userId = session?.user.id || "";
  const [comprehensions, setComprehensions] = useState<ComprehensionTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchComprehensions = async () => {
      try {
        const response = await fetch(`/api/get-comprehensions?voice=${voice}`);
        const data = await response.json();

        if (!response.ok || data.status === "error") {
          setErrorMessage(data.message);
          return;
        }

        setComprehensions(data.comprehensions);
      } catch (error) {
        console.error("Error fetching comprehensions:", error);
        setErrorMessage("Failed to fetch comprehensions");
      } finally {
        setLoading(false);
      }
    };

    fetchComprehensions();

    const submissionStatusKey = `quiz-submitted-${studentId}-${voice}`;
    const submissionStatus = localStorage.getItem(submissionStatusKey);
    if (submissionStatus) {
      setIsSubmitted(true);
    }
  }, [voice, studentId]);

  const handleSubmit = async (answers: { [key: string]: string }) => {
    const allAnswered = comprehensions.every(
      (question) => answers[question.id] !== undefined
    );
    if (!allAnswered) {
      setErrorMessage("There are unanswered questions.");
      return;
    }

    const correctCount = comprehensions.reduce(
      (count, question) =>
        count + (answers[question.id] === question.CorrectAnswers ? 1 : 0),
      0
    );

    const percentage = (correctCount / comprehensions.length) * 100;
    const feedbackMessage =
      percentage >= 90
        ? "Excellent"
        : percentage >= 85
        ? "Very Satisfactory"
        : percentage >= 80
        ? "Satisfactory"
        : percentage >= 75
        ? "Fairly Satisfactory"
        : "Did Not Meet Expectations";

    setFeedback(feedbackMessage);

    const submissionData = comprehensions.map((question) => ({
      question: question.question,
      Option1: question.Option1,
      Option2: question.Option2,
      Option3: question.Option3,
      CorrectAnswer: question.CorrectAnswers,
      chooseAnswer: answers[question.id],
      comprehensionId: question.id,
      studentId: studentId,
      studentUsername: session?.user.studentUsername || "",
      userId: userId,
      score: percentage,
      totalQuestions: comprehensions.length,
      feedback: feedbackMessage,
      attemptCount: 1,
      correctAnswersCount: correctCount,
      wrongAnswersCount: comprehensions.length - correctCount,
    }));
    try {
      await Promise.all(
        submissionData.map(async (data) => {
          const response = await fetch("/api/submit-comprehension", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error("Failed to submit quiz");
          }
        })
      );

      // Mark quiz as submitted
      const submissionStatusKey = `quiz-submitted-${studentId}-${voice}`;
      localStorage.setItem(submissionStatusKey, "true");

      setIsSubmitted(true);
      setScore(percentage);
      setCorrectAnswersCount(correctCount);
      setShowScoreDialog(true);
      toast({ description: "Comprehension Test submitted successfully!" });
    } catch (error) {
      console.error("Error submitting comprehension test:", error);
      toast({
        description:
          "An error occurred while submitting the comprehension test.",
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (errorMessage) return <p className="text-red-500">{errorMessage}</p>;

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 font-bold rounded-md p-2 mt-4 "
            disabled={isSubmitted}
          >
            Comprehension Test
          </Button>
        </DialogTrigger>
        <DialogContent
          className={`max-w-3xl max-h-[90vh] h-auto overflow-y-auto ${
            isSubmitted ? "w-96" : '"w-full'
          }`}
        >
          <Card>
            <CardHeader>
              <CardTitle>Comprehension Test</CardTitle>
              <CardDescription>
                Please answer the following comprehension test.
              </CardDescription>
            </CardHeader>
            <CardContent className={isSubmitted ? "p-2" : "p-6"}>
              {isSubmitted ? (
                <p className="text-green-500 text-center p-4">
                  You have already submitted the quiz.
                </p>
              ) : (
                <ComprehensionForm
                  comprehensions={comprehensions.map((q) => ({
                    id: q.id,
                    question: q.question,
                    options: {
                      Option1: q.Option1,
                      Option2: q.Option2,
                      Option3: q.Option3,
                    },
                    correctAnswer: q.CorrectAnswers,
                    image: q.image,
                  }))}
                  onSubmit={handleSubmit}
                  disabled={isSubmitted}
                />
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <Card className="w-full mt-6">
            <CardHeader>
              <CardTitle>Comprehension Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                Overall score: {score !== null ? Math.round(score) : 0}%
              </p>
              <p className="text-lg font-medium">
                Correct Answer: {correctAnswersCount}
              </p>
              <p className="text-lg font-medium">
                Wrong Answer: {comprehensions.length - correctAnswersCount}
              </p>
              <p className="text-lg font-medium">Feedback: {feedback}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setShowScoreDialog(false)}>Close</Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
