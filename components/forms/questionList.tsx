import React, { useEffect, useState } from "react";
import { AnswerForm } from "./answerForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

interface Question {
  id: string;
  question: string;
  Option1: string;
  Option2: string;
  Option3: string;
  CorrectAnswers: string;
  image?: string;
}

interface QuestionListProps {
  moduleTitle: string;
}

export function QuestionList({ moduleTitle }: QuestionListProps) {
  const { data: session } = useSession();
  const studentId = session?.user.studentId || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const statusResponse = await fetch(
          `/api/check-submission?studentId=${studentId}&moduleTitle=${moduleTitle}`
        );
        const statusData = await statusResponse.json();

        if (!statusResponse.ok || statusData.status === "error") {
          setErrorMessage(statusData.message);
          return;
        }

        // If the quiz has been submitted, mark it as submitted and stop further execution
        if (statusData.isSubmitted) {
          setIsSubmitted(true);
          return;
        }

        // Fetch questions if the quiz has not been submitted
        const questionsResponse = await fetch(
          `/api/get-questions?moduleTitle=${moduleTitle}`
        );
        const questionsData = await questionsResponse.json();

        if (!questionsResponse.ok || questionsData.status === "error") {
          setErrorMessage(questionsData.message);
          return;
        }

        setQuestions(questionsData.questions);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setErrorMessage("Failed to load quiz data.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [moduleTitle, studentId]);

  const handleSubmit = async (answers: { [key: string]: string }) => {
    const allAnswered = questions.every(
      (question) => answers[question.id] !== undefined
    );
    if (!allAnswered) {
      setErrorMessage("Please answer all questions before submitting.");
      return;
    }

    const correctCount = questions.reduce(
      (count, question) =>
        count + (answers[question.id] === question.CorrectAnswers ? 1 : 0),
      0
    );

    const percentage = (correctCount / questions.length) * 100;
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

    const submissionData = questions.map((question) => ({
      question: question.question,
      Option1: question.Option1,
      Option2: question.Option2,
      Option3: question.Option3,
      CorrectAnswer: question.CorrectAnswers,
      chooseAnswer: answers[question.id],
      questionId: question.id,
      studentId: studentId,
      studentUsername: session?.user.studentUsername || "",
      score: percentage,
      totalQuestions: questions.length,
      feedback: feedbackMessage,
      attemptCount: 1,
      correctAnswersCount: correctCount,
      wrongAnswersCount: questions.length - correctCount,
    }));

    try {
      await Promise.all(
        submissionData.map(async (data) => {
          const response = await fetch("/api/submit-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error("Failed to submit quiz");
          }
        })
      );

      setIsSubmitted(true);
      setScore(percentage);
      setCorrectAnswersCount(correctCount);
      setShowScoreDialog(true);
      toast({ description: "Quiz submitted successfully!" });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({ description: "An error occurred while submitting the quiz." });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="mb-2 mt-2 bg-blue-500 hover:bg-indigo-500"
            disabled={isSubmitted}
          >
            Start the Quiz
          </Button>
        </DialogTrigger>
        <DialogContent
          className={`max-w-3xl max-h-[90vh] h-auto overflow-y-auto ${
            isSubmitted ? "w-96" : '"w-full'
          }`}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quiz Questions</CardTitle>
              <CardDescription>
                Please answer the following questions.
              </CardDescription>
            </CardHeader>
            <CardContent className={isSubmitted ? "p-2" : "p-6"}>
              {isSubmitted ? (
                <p className="text-green-500 text-center p-4">
                  You have already submitted the quiz.
                </p>
              ) : (
                <AnswerForm
                  questions={questions.map((q) => ({
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
                  errorMessage={errorMessage} // Pass the error message here
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
              <CardTitle>Quiz Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                Overall score: {score !== null ? Math.round(score) : 0}%
              </p>
              <p className="text-lg font-medium">
                Total Questions: {questions.length}
              </p>
              <p className="text-lg font-medium">
                Correct Answers: {correctAnswersCount}
              </p>
              <p className="text-lg font-medium">
                Wrong Answers: {questions.length - correctAnswersCount}
              </p>
              <p className="text-lg font-medium">Feedback: {feedback}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setShowScoreDialog(false)}>Close</Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
