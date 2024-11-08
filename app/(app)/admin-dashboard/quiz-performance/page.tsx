"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import UnauthorizedPage from "@/components/forms/unauthorized";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
// Register necessary components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Define types for the report
interface StudentScore {
  name: string;
  score: number;
}

interface QuizPerformanceReport {
  totalQuizzes: number;
  totalScores: number;
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  averageScore: number;
  students: StudentScore[];
}

export default function QuizPerformance() {
  const [report, setReport] = useState<QuizPerformanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch("/api/quiz-performance");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setReport(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (status === "loading")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  if (status === "unauthenticated") return <UnauthorizedPage />;
  if (error)
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  if (!report) {
    return <div className="text-center py-10">No report available</div>;
  }

  // Prepare chart data
  const chartData = {
    labels: report.students.map((student) => student.name),
    datasets: [
      {
        label: "Scores",
        data: report.students.map((student) => student.score),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Student Quiz Scores",
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-teal-600">
        Quiz Performance Report
      </h1>
      <div className="mb-6 bg-gray-50 p-4 rounded-md shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Overview</h2>
        <p>
          Total Quizzes Taken:{" "}
          <span className="font-medium">{report.totalQuizzes}</span>
        </p>
        <p>
          Average Score:{" "}
          <span className="font-medium">{report.averageScore.toFixed(2)}%</span>
        </p>
        <p>
          Total Questions Attempted:{" "}
          <span className="font-medium">{report.totalQuestions}</span>
        </p>
        <p>
          Total Correct Answers:{" "}
          <span className="font-medium">{report.totalCorrect}</span>
        </p>
        <p>
          Total Wrong Answers:{" "}
          <span className="font-medium">{report.totalWrong}</span>
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Student Performance</h2>
      <div className="mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <table className="min-w-full bg-white border border-gray-200 mt-4 rounded-md shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">Student Name</th>
            <th className="py-2 px-4 border-b text-left">Score</th>
          </tr>
        </thead>
        <tbody>
          {report.students.map((student, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{student.name}</td>
              <td className="py-2 px-4 border-b">{student.score}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
