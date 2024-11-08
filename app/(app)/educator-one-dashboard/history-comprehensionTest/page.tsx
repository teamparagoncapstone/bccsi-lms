"use client";
import React, { useEffect, useState } from "react";
import { UserNav } from "../components/user-nav";
import TeamSwitcher from "../components/team-switcher";
import { SystemMenu } from "../components/system-menu";
import { Separator } from "@/components/ui/separator";
import Loading from "../loading";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react";
import UnauthorizedPage from "@/components/forms/unauthorized";

type VoiceExercise = {
  id: string;
  voice: string;
};

type Student = {
  id: string;
  firstname: string;
  lastname: string;
};

type ComprehensionTest = {
  id: string;
  question: string;
  Option1: string;
  Option2: string;
  Option3: string;
  VoiceExcercises?: VoiceExercise | null;
};

type ComprehensionHistory = {
  id: string;
  ComprehensionTest: ComprehensionTest | null;
  Student: Student | null;
  score: number;
  feedback?: string;
  completed: boolean;
  CorrectAnswer: string;
  chooseAnswer: string;
};

const ITEMS_PER_PAGE = 5;

export default function ComprehensionHistory() {
  const { data: session, status } = useSession();
  const [histories, setHistories] = useState<ComprehensionHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedHistory, setSelectedHistory] =
    useState<ComprehensionHistory | null>(null);

  useEffect(() => {
    const fetchHistories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/comprehension-one-history");
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "An unknown error occurred.");
          return;
        }
        const data: ComprehensionHistory[] = await response.json();
        setHistories(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch comprehension history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

  const filteredHistories = histories.filter((history) => {
    if (!history || !history.Student) return false;

    const studentName = `${history.Student.firstname || ""} ${
      history.Student.lastname || ""
    }`;
    return studentName.toLowerCase().includes(studentSearchTerm.toLowerCase());
  });

  const sortedHistories = [...filteredHistories].sort((a, b) => {
    return sortOrder === "asc" ? a.score - b.score : b.score - a.score;
  });

  const totalPages = Math.ceil(sortedHistories.length / ITEMS_PER_PAGE);
  const paginatedHistories = sortedHistories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const exportCSV = () => {
    const csvContent = [
      [
        "Student",
        "Question",
        "Correct Answer",
        "Chosen Answer",
        "Score",
        "Voice",
      ].join(","),
      ...histories.map((history) =>
        [
          history.Student
            ? `${history.Student.firstname} ${history.Student.lastname}`
            : "N/A",
          history.ComprehensionTest?.question || "N/A",
          history.CorrectAnswer || "N/A",
          history.chooseAnswer || "N/A",
          history.score,
          history.ComprehensionTest?.VoiceExcercises?.voice || "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "comprehension_history.csv");
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Comprehension History", 20, 20);

    const tableColumn = [
      "Student",
      "Question",
      "Correct Answer",
      "Chosen Answer",
      "Score",
      "Voice",
    ];

    const tableRows: any[] = [];

    histories.forEach((history) => {
      const historyData = [
        history.Student
          ? `${history.Student.firstname} ${history.Student.lastname}`
          : "N/A",
        history.ComprehensionTest?.question || "N/A",
        history.CorrectAnswer || "N/A",
        history.chooseAnswer || "N/A",
        history.score,
        history.ComprehensionTest?.VoiceExcercises?.voice || "N/A",
      ];
      tableRows.push(historyData);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("comprehension_history.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      histories.map((history) => ({
        Student: history.Student
          ? `${history.Student.firstname} ${history.Student.lastname}`
          : "N/A",
        Question: history.ComprehensionTest?.question || "N/A",
        CorrectAnswer: history.CorrectAnswer || "N/A",
        ChosenAnswer: history.chooseAnswer || "N/A",
        Score: history.score,
        Voice: history.ComprehensionTest?.VoiceExcercises?.voice || "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Comprehension History");
    XLSX.writeFile(workbook, "comprehension_history.xlsx");
  };

  if (status === "loading") return <Loading />;
  if (status === "unauthenticated") return <UnauthorizedPage />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="w-full h-auto md:h-16">
        <div className="flex h-16 items-center px-4">
          <div className="hidden sm:block pr-4">
            <TeamSwitcher />
          </div>
          <SystemMenu />
          <div className="ml-auto flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <Separator />
      </div>
      <div
        className="flex-1 w-full bg-cover bg-center"
        style={{
          backgroundImage:
            'url("/images/comprehension-test-teacher-history1.png")',
        }}
      >
        <div className="w-full md:w-4/5 lg:w-1/2 mx-auto p-8 bg-white rounded-lg shadow-md mt-4">
          <h2 className="text-2xl font-bold text-center mb-4">
            Comprehension History
          </h2>

          <input
            type="text"
            placeholder="Search by student..."
            value={studentSearchTerm}
            onChange={(e) => setStudentSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex justify-between mb-4">
            <div className="flex space-x-2">
              <button
                onClick={exportCSV}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Export CSV
              </button>
              <button
                onClick={exportPDF}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
              >
                Export PDF
              </button>
              <button
                onClick={exportExcel}
                className="bg-yellow-500 text-white p-2 rounded yellow:bg-purple-600 transition duration-200"
              >
                Export Excel
              </button>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-200"
            >
              Sort by Score: {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>

          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Voice Exercises</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistories.map((history) => (
                <tr key={history.id} className="bg-white border-b">
                  <td className="px-4 py-2">
                    {history.Student
                      ? `${history.Student.firstname} ${history.Student.lastname}`
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {history.ComprehensionTest?.VoiceExcercises?.voice || "N/A"}
                  </td>
                  <td className="px-4 py-2">{history.score}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedHistory(history)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-300 p-2 rounded disabled:opacity-50 hover:bg-gray-400 transition duration-200"
            >
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-gray-300 p-2 rounded disabled:opacity-50 hover:bg-gray-400 transition duration-200"
            >
              Next
            </button>
          </div>

          {selectedHistory && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
              <div className="bg-white rounded-lg shadow-lg w-4/5 md:w-1/2 lg:w-1/3 p-6 relative max-h-screen overflow-y-auto">
                <button
                  onClick={() => setSelectedHistory(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
                <h3 className="text-lg font-bold mb-4 text-center">
                  Details for {selectedHistory.Student?.firstname}{" "}
                  {selectedHistory.Student?.lastname}
                </h3>
                <p>
                  <strong>Question:</strong>{" "}
                  {selectedHistory.ComprehensionTest?.question}
                </p>
                <p>
                  <strong>Options:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>{selectedHistory.ComprehensionTest?.Option1}</li>
                  <li>{selectedHistory.ComprehensionTest?.Option2}</li>
                  <li>{selectedHistory.ComprehensionTest?.Option3}</li>
                </ul>
                <p>
                  <strong>Correct Answer:</strong>{" "}
                  {selectedHistory.CorrectAnswer}
                </p>
                <p>
                  <strong>Chosen Answer:</strong> {selectedHistory.chooseAnswer}
                </p>
                <p>
                  <strong>Feedback:</strong> {selectedHistory.feedback || "N/A"}
                </p>
                <button
                  onClick={() => setSelectedHistory(null)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
