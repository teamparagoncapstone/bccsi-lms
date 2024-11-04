"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { lists } from "../data/lists";
import TeamSwitcher from "../components/team-switcher";
import { UserNav } from "@/app/(app)/admin-dashboard/components/user-nav";
import { Sidebar } from "../components/sidebar";
import SummaryCard from "../components/SummaryCard";
import Loading from "@/components/loading";
import Pagination from "../components/pagination";
import QuizHistoryTable from "../components/quizHistoryTable";
import VoiceExerciseTable from "../components/voiceExerciseTable";
import ComprehensionHistoryTable from "../components/comprehensionHistoryTable";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Bar } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import autoTable from "jspdf-autotable";
import {
  FaTrophy,
  FaChartLine,
  FaCheckCircle,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Student {
  id: string;
  firstname: string;
  lastname: string;
}

interface StudentQuizHistory {
  student: string;
  moduleTitle: string;
  totalQuestions: number;
  score: number;
}
interface VoiceExercise {
  id: string;
  voice: string;
  recognizedText: string;
  score: number;
  moduleTitle: string;
  Student: Student;
}

interface ComprehensionTest {
  id: string;
  question: string;
  Option1: string;
  Option2: string;
  Option3: string;
  CorrectAnswer: string;
  VoiceExcercises: {
    voice: string;
  };
}

interface ComprehensionHistory {
  id: string;
  ComprehensionTest: ComprehensionTest;
  Student: Student;
  score: number;
  feedback: string;
  chooseAnswer: string;
  totalQuestions: number;
}

interface CombinedHistory {
  quizHistory?: StudentQuizHistory[];
  voiceExercisesHistory?: VoiceExercise[];
  comprehensionHistory?: ComprehensionHistory[];
}

export default function Reports() {
  const [grade, setGrade] = useState("GradeOne");
  const [historyData, setHistoryData] = useState<CombinedHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizPage, setQuizPage] = useState(1);
  const [voicePage, setVoicePage] = useState(1);
  const [comprehensionPage, setComprehensionPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setSidebarOpen(false);
    let isMounted = true;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports?grade=${grade}`);
        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }
        const data: CombinedHistory = await response.json();
        console.log("Fetched History Data: ", data);
        if (isMounted) {
          setHistoryData(data);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [grade]);

  const paginatedQuizHistory = historyData?.quizHistory?.slice(
    (quizPage - 1) * itemsPerPage,
    quizPage * itemsPerPage
  );
  const paginatedVoiceExercises = historyData?.voiceExercisesHistory?.slice(
    (voicePage - 1) * itemsPerPage,
    voicePage * itemsPerPage
  );
  const paginatedComprehensionHistory =
    historyData?.comprehensionHistory?.slice(
      (comprehensionPage - 1) * itemsPerPage,
      comprehensionPage * itemsPerPage
    );

  const exportQuizToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(historyData?.quizHistory || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz History");
    XLSX.writeFile(workbook, "quiz_history.xlsx");
  };

  const exportQuizToPDF = () => {
    const doc = new jsPDF();
    doc.text("Quiz History", 20, 10);
    autoTable(doc, {
      head: [["Student", "Module Title", "Total Questions", "Score"]],
      body:
        historyData?.quizHistory?.map((q) => [
          q.student,
          q.moduleTitle,
          q.totalQuestions,
          q.score,
        ]) || [],
    });
    doc.save("quiz_history.pdf");
  };

  const exportVoiceToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      historyData?.voiceExercisesHistory || []
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Voice Exercises");
    XLSX.writeFile(workbook, "voice_exercises.xlsx");
  };

  const exportVoiceToPDF = () => {
    const doc = new jsPDF();
    doc.text("Voice Exercises History", 20, 10);
    autoTable(doc, {
      head: [["Student", "Voice", "Recognized Text", "Score", "Module Title"]],
      body:
        historyData?.voiceExercisesHistory?.map((v) => [
          v.Student.firstname,
          v.voice,
          v.recognizedText,
          v.score,
          v.moduleTitle,
        ]) || [],
    });
    doc.save("voice_exercises.pdf");
  };

  const exportComprehensionToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      historyData?.comprehensionHistory || []
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Comprehension History");
    XLSX.writeFile(workbook, "comprehension_history.xlsx");
  };

  const exportComprehensionToPDF = () => {
    const doc = new jsPDF();
    doc.text("Comprehension History", 20, 10);
    autoTable(doc, {
      head: [["Student", "Question", "Chosen Answer", "Score"]],
      body:
        historyData?.comprehensionHistory?.map((c) => [
          c.Student.firstname,
          c.ComprehensionTest.question,
          c.chooseAnswer,
          c.score,
        ]) || [],
    });
    doc.save("comprehension_history.pdf");
  };

  if (loading)
    return (
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <div className="w-full h-16 bg-white shadow-md flex items-center px-4 relative">
          <div className="flex items-center pr-2">
            <button
              className="md:hidden p-2 hover:bg-gray-200 rounded transition duration-300 flex items-center justify-center"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-6 w-6 md:hidden"
              >
                {sidebarOpen ? (
                  <>
                    <path d="M6 18L18 6" />
                    <path d="M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                  </>
                )}
              </svg>
            </button>
            <TeamSwitcher />
          </div>
          <div className="flex-1 flex items-center pl-2">
            <div className="ml-auto flex items-center space-x-2">
              <UserNav />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-1 overflow-y-auto">
          {/* Sidebar */}
          <aside className="w-64 bg-blue-300 p-4 drop-shadow-lg md:block hidden">
            <Sidebar className="w-full" lists={lists} />
          </aside>

          {/* Sidebar Mobile Menu */}
          <div
            className={`fixed top-0 left-0 w-full z-10 h-full bg-blue-300 p-4 drop-shadow-lg md:hidden transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar className="w-full" lists={lists} />
            <button
              className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-6 w-6 text-gray-600"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main content skeleton */}
          <div className="p-4 w-[100%] md:w-[85%] flex flex-col h-full overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              Reports Dashboard
            </h1>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Skeleton height={100} />
              <Skeleton height={100} />
              <Skeleton height={100} />
            </div>
            <Skeleton count={6} height={40} />
          </div>
        </div>
      </div>
    );

  if (error) return <div className="text-red-500">Error: {error}</div>;

  const quizHistory = historyData?.quizHistory ?? [];
  const voiceExercisesHistory = historyData?.voiceExercisesHistory ?? [];
  const comprehensionHistory = historyData?.comprehensionHistory ?? [];

  const getTotalScores = () => {
    const quizMaxScore = 100;
    const voiceMaxScore = 100;
    const comprehensionMaxScore = 100;

    const quizTotal = quizHistory.reduce((acc, curr) => acc + curr.score, 0);
    const voiceTotal = voiceExercisesHistory.reduce(
      (acc, curr) => acc + curr.score,
      0
    );
    const comprehensionTotal = comprehensionHistory.reduce(
      (acc, curr) => acc + curr.score,
      0
    );

    const maxTotal =
      quizHistory.length * quizMaxScore +
      voiceExercisesHistory.length * voiceMaxScore +
      comprehensionHistory.length * comprehensionMaxScore;

    const totalScore = quizTotal + voiceTotal + comprehensionTotal;

    return maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 0;
  };

  const quizScores = quizHistory.reduce((a, b) => a + b.score, 0);
  const voiceScores = voiceExercisesHistory.reduce((a, b) => a + b.score, 0);
  const comprehensionScores = comprehensionHistory.reduce(
    (a, b) => a + b.score,
    0
  );

  const quizPercentage =
    quizHistory.length > 0
      ? Math.round((quizScores / (quizHistory.length * 100)) * 100)
      : 0;
  const voicePercentage =
    voiceExercisesHistory.length > 0
      ? Math.round((voiceScores / (voiceExercisesHistory.length * 100)) * 100)
      : 0;
  const comprehensionPercentage =
    comprehensionHistory.length > 0
      ? Math.round(
          (comprehensionScores / (comprehensionHistory.length * 100)) * 100
        )
      : 0;

  const chartData = {
    labels: ["Quizzes", "Voice Exercises", "Comprehension Tests"],
    datasets: [
      {
        label: "Performance (%)",
        data: [quizPercentage, voicePercentage, comprehensionPercentage],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (tickValue: string | number) {
            return typeof tickValue === "number" ? tickValue + "%" : tickValue;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="w-full h-16 bg-white shadow-md flex items-center px-4 relative">
        <div className="flex items-center pr-2">
          <button
            className="md:hidden p-2 hover:bg-gray-200 rounded transition duration-300 flex items-center justify-center"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-6 w-6 md:hidden"
            >
              {sidebarOpen ? (
                <>
                  <path d="M6 18L18 6" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
          <TeamSwitcher />
        </div>
        <div className="flex-1 flex items-center pl-2">
          <div className="ml-auto flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-y-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-300 p-4 drop-shadow-lg md:block hidden">
          <Sidebar className="w-full" lists={lists} />
        </aside>

        {/* Mobile Sidebar Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-blue-300 p-4 drop-shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
        >
          <Sidebar className="w-full" lists={lists} />
          <button
            className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 z-50"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="h-6 w-6 text-gray-600"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 w-[100%] md:w-[85%] flex flex-col h-full overflow-y-auto scrollbar-thin">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            Reports Dashboard
          </h1>

          {/* Grade Dropdown */}
          <div className="mb-6 flex gap-4 items-center ">
            <label
              htmlFor="grade-select"
              className="text-gray-800 font-semibold text-lg"
            >
              Select Grade:
            </label>
            <div className="relative w-64">
              <select
                id="grade-select"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className=" w-full appearance-none bg-white border border-gray-300 text-gray-800 py-2 px-4 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              >
                <option value="GradeOne">Grade One</option>
                <option value="GradeTwo">Grade Two</option>
                <option value="GradeThree">Grade Three</option>
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                >
                  <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                </svg>
              </span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ">
            <SummaryCard
              title="Total Score"
              value={`${getTotalScores()}%`}
              icon={<FaTrophy />}
            />
            <SummaryCard
              title="Quiz Count"
              value={quizHistory.length}
              icon={<FaChartLine />}
            />
            <SummaryCard
              title="Voice Exercises Count"
              value={voiceExercisesHistory.length}
              icon={<FaCheckCircle />}
            />
          </div>

          {/* Bar Chart */}
          {chartData && (
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Performance Summary
              </h2>
              <Bar
                key={JSON.stringify(chartData)}
                data={chartData}
                options={chartOptions}
              />
            </div>
          )}
          {/* Quiz History Table */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <CSVLink
              data={historyData?.quizHistory || []}
              filename={"quiz_history.csv"}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              <FaFileCsv /> Export as CSV
            </CSVLink>
            <button
              onClick={exportQuizToExcel}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              <FaFileExcel /> Export as Excel
            </button>
            <button
              onClick={exportQuizToPDF}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              <FaFilePdf /> Export as PDF
            </button>
          </div>

          <QuizHistoryTable quizHistory={paginatedQuizHistory ?? []} />
          <Pagination
            currentPage={quizPage}
            totalItems={historyData?.quizHistory?.length || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setQuizPage(page)}
          />

          <div className="flex flex-col sm:flex-row gap-4 mb-6 mt-4">
            <CSVLink
              data={historyData?.voiceExercisesHistory || []}
              filename={"voice_exercises.csv"}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              <FaFileCsv /> Export as CSV
            </CSVLink>
            <button
              onClick={exportVoiceToExcel}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              <FaFileExcel /> Export as Excel
            </button>
            <button
              onClick={exportVoiceToPDF}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              <FaFilePdf /> Export as PDF
            </button>
          </div>

          {/* Voice Exercises Table */}
          <VoiceExerciseTable
            voiceExercisesHistory={paginatedVoiceExercises ?? []}
          />
          <Pagination
            currentPage={voicePage}
            totalItems={historyData?.voiceExercisesHistory?.length || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setVoicePage(page)}
          />
          <div className="flex flex-col sm:flex-row gap-4 mb-6 mt-4">
            <CSVLink
              data={historyData?.comprehensionHistory || []}
              filename={"comprehension_history.csv"}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              <FaFileCsv /> Export as CSV
            </CSVLink>
            <button
              onClick={exportComprehensionToExcel}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              <FaFileExcel /> Export as Excel
            </button>
            <button
              onClick={exportComprehensionToPDF}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              <FaFilePdf /> Export as PDF
            </button>
          </div>
          {/* Comprehension History Table */}

          <ComprehensionHistoryTable
            comprehensionHistory={paginatedComprehensionHistory ?? []}
          />
          <Pagination
            currentPage={comprehensionPage}
            totalItems={historyData?.comprehensionHistory?.length || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setComprehensionPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
