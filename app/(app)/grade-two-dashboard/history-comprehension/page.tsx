"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // for dynamic params
import { UserNav } from "@/app/(app)/grade-two-dashboard/_components/user-nav";
import { SystemMenu } from "../_components/system-menu";
import { Separator } from "@/components/ui/separator";
import TeamSwitcher from "@/app/(app)/grade-two-dashboard/_components/team-switcher";
import Loading from "../loading";

interface ComprehensionTest {
  id: string;
  question: string;
  Option1: string;
  Option2: string;
  Option3: string;
  CorrectAnswer: string;
  correctAnswersCount: string;
  wrongAnswersCount: string;
  Student: {
    id: string | null;
    firstname: string;
    lastname: string;
  };
  chooseAnswer: string;
  feedback: string | null;
  score: number;
  createdAt: string;
  voice: string | null;
}

const ComprehensionHistory: React.FC = () => {
  const { studentId } = useParams(); // Dynamically get studentId from URL

  const [history, setHistory] = useState<ComprehensionTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const itemsPerPage = 5;

  useEffect(() => {
    if (!studentId) return; // If no studentId, exit early
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `/api/comprehension-two-history?studentId=${studentId}`
        );
        const data = await response.json();

        if (data.status === "success") {
          setHistory(data.history);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred while fetching the history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [studentId]);

  const filteredHistory = history.filter(
    (item) =>
      (item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.voice &&
          item.voice.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      item.voice
  );

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const currentData = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      className="w-full min-h-screen bg-center bg-cover"
      style={{
        backgroundImage: 'url("/images/comprehension-test-history1.png")',
        backgroundSize: "cover",
      }}
    >
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
      </div>
      <Separator />
      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto font-sans">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Comprehension Test History
        </h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by question or voice exercise..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="py-2 px-4 border-b">Voice Exercises</th>
              <th className="py-2 px-4 border-b">Question</th>
              <th className="py-2 px-4 border-b">Total Score</th>
              <th className="py-2 px-4 border-b">Correct</th>
              <th className="py-2 px-4 border-b">Wrong</th>
              <th className="py-2 px-4 border-b">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-4 px-4 border-b text-blue-600">
                  {item.voice}
                </td>
                <td className="py-4 px-4 border-b text-gray-800">
                  {item.question}
                </td>
                <td className="py-4 px-4 border-b text-green-600 font-medium">
                  {item.score}
                </td>
                <td className="py-4 px-4 border-b text-gray-700">
                  {item.correctAnswersCount}
                </td>
                <td className="py-4 px-4 border-b text-gray-700">
                  {item.wrongAnswersCount}
                </td>
                <td className="py-4 px-4 border-b text-gray-600">
                  {item.feedback || "No feedback"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComprehensionHistory;
