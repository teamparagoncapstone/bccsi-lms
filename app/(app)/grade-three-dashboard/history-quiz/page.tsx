"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TeamSwitcher from "@/app/(app)/grade-one-dashboard/_components/team-switcher";
import { UserNav } from "@/app/(app)/grade-one-dashboard/_components/user-nav";
import { SystemMenu } from "../_components/system-menu";
import { Separator } from "@/components/ui/separator";
import Loading from "../loading";
import { AiOutlineTrophy } from "react-icons/ai";

interface QuizHistoryItem {
  id: string;
  question: string;
  correctAnswersCount: string;
  wrongAnswersCount: string;
  totalQuestions: string;
  score: number;
  feedback: string;
  createdAt: string;
  Question: {
    Module: {
      id: string;
      moduleTitle: string;
    };
  };
}

const ITEMS_PER_PAGE = 5;

export default function HistoryQuiz() {
  const { data: session } = useSession();
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      if (!session) return;
      const studentId = session.user.studentId;

      try {
        const response = await fetch(
          `/api/get-quiz-history?studentId=${studentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz history");
        }
        const data = await response.json();
        const uniqueModules = new Map();

        data.history.forEach((quiz: QuizHistoryItem) => {
          const moduleId = quiz.Question.Module.id;
          if (!uniqueModules.has(moduleId)) {
            uniqueModules.set(moduleId, quiz);
          }
        });

        setQuizHistory(Array.from(uniqueModules.values()));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, [session]);

  const filteredQuizzes = quizHistory.filter((quiz) =>
    quiz.Question.Module.moduleTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE);
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  if (error) return <p className="text-red-500 text-center text-lg">{error}</p>;

  return (
    <div className="w-full relative">
      {/* Navbar */}
      <div className="w-full bg-blue-50 h-auto md:h-16 shadow-lg">
        <div className="flex h-16 items-center px-4">
          <div className="hidden sm:block pr-2">
            <TeamSwitcher />
          </div>
          <div className="flex pl-2">
            <SystemMenu />
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <Separator />
      </div>

      <div
        className="bg-gradient-to-r from-blue-200 to-yellow-300 min-h-screen p-4 flex flex-col items-center bg-center bg-cover"
        style={{
          backgroundImage: 'url("/images/student-history-math1.png")',
          backgroundSize: "cover",
        }}
      >
        <h1 className="text-4xl font-bold mb-4 text-center text-blue-700">
          <AiOutlineTrophy className="inline-block text-yellow-500" /> Quiz
          History
        </h1>

        {/* Search Input */}
        <div className="mb-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Search by Module Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded"
          />
        </div>

        {filteredQuizzes.length === 0 ? (
          <p className="text-center text-lg font-semibold">
            No quiz history available.
          </p>
        ) : (
          <div className="overflow-x-auto w-full max-w-4xl mb-4">
            <table className="min-w-full bg-yellow-100 border border-gray-300 rounded-lg shadow-lg">
              <thead className="bg-blue-300">
                <tr className="text-left text-lg">
                  <th className="py-3 px-2 md:px-4">Module Title</th>
                  <th className="py-3 px-2 md:px-4">Total Questions</th>
                  <th className="py-3 px-2 md:px-4">Correct</th>
                  <th className="py-3 px-2 md:px-4">Wrong</th>
                  <th className="py-3 px-2 md:px-4">Score</th>
                  <th className="py-3 px-2 md:px-4">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {paginatedQuizzes.map((quiz: QuizHistoryItem) => (
                  <tr
                    key={quiz.id}
                    className="hover:bg-yellow-200 transition duration-200"
                  >
                    <td className="py-2 px-2 md:px-4">
                      {quiz.Question.Module.moduleTitle}
                    </td>
                    <td className="py-2 px-2 md:px-4">{quiz.totalQuestions}</td>
                    <td className="py-2 px-2 md:px-4">
                      {quiz.correctAnswersCount}
                    </td>
                    <td className="py-2 px-2 md:px-4">
                      {quiz.wrongAnswersCount}
                    </td>
                    <td className="py-2 px-2 md:px-4">{quiz.score}</td>
                    <td className="py-2 px-2 md:px-4">{quiz.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center w-full max-w-md mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mx-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
