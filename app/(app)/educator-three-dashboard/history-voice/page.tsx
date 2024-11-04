"use client";
import React, { useEffect, useState } from "react";
import { UserNav } from "../components/user-nav";
import TeamSwitcher from "../components/team-switcher";
import { SystemMenu } from "../components/system-menu";
import { Separator } from "@/components/ui/separator";
import Loading from "../loading";
import * as XLSX from "xlsx"; // Import for Excel export
import { jsPDF } from "jspdf"; // Import for PDF export
import autoTable from "jspdf-autotable"; // Import for PDF table

interface Student {
  id: string;
  firstname?: string;
  lastname?: string;
}

interface VoiceExerciseHistory {
  id: string;
  voice: string;
  recognizedText: string;
  score: number;
  moduleTitle?: string;
  Student?: Student;
}

const VoiceExerciseModal = ({
  exercise,
  onClose,
}: {
  exercise: VoiceExerciseHistory;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform scale-100">
        <h2 className="text-2xl font-bold mb-4">
          {exercise.Student?.firstname} {exercise.Student?.lastname}
        </h2>
        <p>
          <strong>Module Title:</strong> {exercise.moduleTitle}
        </p>
        <p>
          <strong>Voice:</strong> {exercise.voice}
        </p>
        <p>
          <strong>Recognized Text:</strong> {exercise.recognizedText}
        </p>
        <p>
          <strong>Score:</strong> {exercise.score}
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function VoiceExercisesHistory() {
  const [history, setHistory] = useState<VoiceExerciseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<
    VoiceExerciseHistory[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedExercise, setSelectedExercise] =
    useState<VoiceExerciseHistory | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/get-teach-history-voice-three");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setHistory(data);
        setFilteredHistory(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const filtered = history.filter(
      (exercise) =>
        exercise.Student?.firstname
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        exercise.Student?.lastname
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  }, [searchTerm, history]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const currentHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSort = () => {
    const sorted = [...filteredHistory].sort((a, b) =>
      sortDirection === "asc" ? a.score - b.score : b.score - a.score
    );
    setFilteredHistory(sorted);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleExportCSV = () => {
    const csvRows = [];
    const headers = [
      "Student First Name",
      "Student Last Name",
      "Module Title",
      "Voice",
      "Recognized Text",
      "Score",
    ];
    csvRows.push(headers.join(","));
    filteredHistory.forEach((exercise) => {
      const row = [
        exercise.Student?.firstname || "",
        exercise.Student?.lastname || "",
        exercise.moduleTitle || "",
        exercise.voice,
        exercise.recognizedText,
        exercise.score,
      ];
      csvRows.push(row.join(","));
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "voice_exercises_history.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredHistory.map((exercise) => ({
        "Student First Name": exercise.Student?.firstname,
        "Student Last Name": exercise.Student?.lastname,
        "Module Title": exercise.moduleTitle,
        Voice: exercise.voice,
        "Recognized Text": exercise.recognizedText,
        Score: exercise.score,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Voice Exercises History"
    );
    XLSX.writeFile(workbook, "voice_exercises_history.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Voice Exercises History", 20, 10);
    autoTable(doc, {
      head: [
        [
          "Student First Name",
          "Student Last Name",
          "Module Title",
          "Voice",
          "Recognized Text",
          "Score",
        ],
      ],
      body: filteredHistory.map((exercise) => [
        exercise.Student?.firstname || "",
        exercise.Student?.lastname || "",
        exercise.moduleTitle || "",
        exercise.voice,
        exercise.recognizedText,
        exercise.score,
      ]),
      startY: 20,
      margin: { horizontal: 10 },
    });
    doc.save("voice_exercises_history.pdf");
  };

  if (loading)
    return (
      <p className="text-center align-center text-lg">
        <Loading />
      </p>
    );
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen flex flex-col">
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
      <div className="flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/voice-history1.png")',
            filter: "blur(0px)",
            zIndex: -1,
          }}
        ></div>
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-8 bg-white rounded-lg shadow-md mt-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
            Voice Exercises History
          </h1>

          <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
            <input
              type="text"
              placeholder="Search by student name..."
              className="border rounded px-3 py-2 mb-2 sm:mb-0 w-full sm:w-1/2"
              onChange={handleSearch}
            />
            <button
              onClick={handleSort}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Sort by Score {sortDirection === "asc" ? "↑" : "↓"}
            </button>
          </div>

          <ul className="space-y-4">
            {currentHistory.map((exercise) => (
              <li
                key={exercise.id}
                className="p-4 bg-gray-100 rounded-lg shadow-sm"
                onClick={() => setSelectedExercise(exercise)}
              >
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-blue-600">
                    {exercise.Student?.firstname} {exercise.Student?.lastname}
                  </h2>
                  <p>
                    <strong>Module Title:</strong> {exercise.moduleTitle}
                  </p>
                </div>
                <div className="text-gray-700">
                  <p>
                    <strong>Voice:</strong> {exercise.voice}
                  </p>
                  <p>
                    <strong>Recognized Text:</strong> {exercise.recognizedText}
                  </p>
                  <p>
                    <strong>Score:</strong> {exercise.score}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row justify-between my-4">
            <button
              onClick={handlePrevious}
              className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={handleExportCSV}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportExcel}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full sm:w-auto"
            >
              Export Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
            >
              Export PDF
            </button>
          </div>

          {selectedExercise && (
            <VoiceExerciseModal
              exercise={selectedExercise}
              onClose={() => setSelectedExercise(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
