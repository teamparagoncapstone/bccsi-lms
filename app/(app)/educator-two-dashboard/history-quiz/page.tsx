"use client";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { UserNav } from "../components/user-nav";
import TeamSwitcher from "../components/team-switcher";
import { SystemMenu } from "../components/system-menu";
import { Separator } from "@/components/ui/separator";
import Loading from "../loading";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Student {
  id: string;
  firstname: string;
  lastname: string;
}

interface Quiz {
  id: string;
  score: number;
  question: string;
  Option1: string;
  Option2: string;
  Option3: string;
  CorrectAnswer: string;
  chooseAnswer?: string;
  feedback?: string;
  attempts: number;
  createdAt: string;
}

interface Module {
  moduleTitle: string;
  totalScore: number;
  quizzes: Quiz[];
}

interface QuizHistory {
  student: Student;
  modules: Module[];
}

// Define the type for the table data
interface TableData {
  studentName: string;
  moduleTitle: string;
  totalScore: number;
  question: string;
  score: number;
  feedback: string;
}

export default function HistoryQuiz() {
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const response = await fetch("/api/get-teach-history-quiz-two");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: QuizHistory[] = await response.json();
        setQuizHistory(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, []);

  const filteredHistory = quizHistory.filter(({ student }) =>
    `${student.firstname} ${student.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const downloadExcel = () => {
    const rows = paginatedHistory.flatMap(({ student, modules }) =>
      modules.flatMap((module) =>
        module.quizzes.map((quiz) => ({
          "Student Name": `${student.firstname} ${student.lastname}`,
          "Module Title": module.moduleTitle,
          "Total Score": module.totalScore,
          Question: quiz.question,
          Score: quiz.score,
          Feedback: quiz.feedback || "No feedback provided",
        }))
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz History");
    XLSX.writeFile(workbook, "quiz_history.xlsx");
  };

  const downloadCSV = () => {
    const rows = [];
    rows.push([
      "Student Name",
      "Module Title",
      "Total Score",
      "Question",
      "Score",
      "Feedback",
    ]);

    paginatedHistory.forEach(({ student, modules }) => {
      modules.forEach((module) => {
        module.quizzes.forEach((quiz) => {
          rows.push([
            `${student.firstname} ${student.lastname}`,
            module.moduleTitle,
            module.totalScore,
            quiz.question,
            quiz.score,
            quiz.feedback || "No feedback provided",
          ]);
        });
      });
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "quiz_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Quiz History Overview", 14, 10);

    const tableData: TableData[] = [];

    paginatedHistory.forEach(({ student, modules }) => {
      modules.forEach((module) => {
        module.quizzes.forEach((quiz) => {
          tableData.push({
            studentName: `${student.firstname} ${student.lastname}`,
            moduleTitle: module.moduleTitle,
            totalScore: module.totalScore,
            question: quiz.question,
            score: quiz.score,
            feedback: quiz.feedback || "No feedback provided",
          });
        });
      });
    });

    const columns = [
      { header: "Student Name", dataKey: "studentName" },
      { header: "Module Title", dataKey: "moduleTitle" },
      { header: "Total Score", dataKey: "totalScore" },
      { header: "Question", dataKey: "question" },
      { header: "Score", dataKey: "score" },
      { header: "Feedback", dataKey: "feedback" },
    ];

    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: tableData.map((row) => [
        row.studentName,
        row.moduleTitle,
        row.totalScore,
        row.question,
        row.score,
        row.feedback,
      ]),
      startY: 20,
      margin: { horizontal: 10 },
    });

    doc.save("quiz_history.pdf");
  };

  if (loading)
    return (
      <div className="text-center justify-center text-blue-500">
        <Loading />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

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
          className="absolute inset-0 bg-cover bg-top "
          style={{
            backgroundImage: 'url("/images/quiz-history1.png")',
            filter: "blur(3px)",
            zIndex: -1,
          }}
        ></div>
        <div className="w-full max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-4 ">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Quiz History Overview
          </h1>
          <input
            type="text"
            placeholder="Search by student name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 mb-4 w-full"
          />

          <button
            onClick={downloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 mr-2"
          >
            Export CSV
          </button>

          <button
            onClick={downloadExcel}
            className="bg-yellow-500 text-white px-4 py-2 rounded mb-4 mr-2"
          >
            Export Excel
          </button>

          <button
            onClick={downloadPDF}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Export PDF
          </button>

          {paginatedHistory.length > 0 ? (
            <table className="w-full bg-white border border-gray-200 rounded-md shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">Student Name</th>
                  <th className="p-4 text-left">Module Title</th>
                  <th className="p-4 text-left">Total Score</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map(({ student, modules }) => (
                  <React.Fragment key={student.id}>
                    {modules.map((module, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-4 border-b">
                          {student.firstname} {student.lastname}
                        </td>
                        <td className="p-4 border-b">{module.moduleTitle}</td>
                        <td className="p-4 border-b">{module.totalScore}</td>
                        <td className="p-4 border-b">
                          <button
                            className="text-blue-500 underline"
                            onClick={() => setSelectedModule(module)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500">
              No quiz history found.
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Modal for Quiz Details */}
        <Modal
          isOpen={!!selectedModule}
          onRequestClose={() => setSelectedModule(null)}
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          ariaHideApp={false}
        >
          {selectedModule && (
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="font-bold text-2xl mb-4 text-center">
                Module: {selectedModule.moduleTitle}
              </h2>
              <div className="space-y-4">
                {selectedModule.quizzes.map((quiz) => (
                  <div key={quiz.id} className="border-b pb-4">
                    <h3 className="font-semibold text-lg">{quiz.question}</h3>
                    <p className="mt-2 font-medium">Options:</p>
                    <ul className="list-disc ml-5 space-y-1">
                      <li> {quiz.Option1}</li>
                      <li> {quiz.Option2}</li>
                      <li> {quiz.Option3}</li>
                    </ul>
                    <div className="mt-2 text-sm">
                      <p>
                        <strong>Correct Answer:</strong> {quiz.CorrectAnswer}
                      </p>
                      <p>
                        <strong>Chosen Answer:</strong>{" "}
                        {quiz.chooseAnswer || "Not selected"}
                      </p>
                      <p>
                        <strong>Score:</strong> {quiz.score}
                      </p>
                      <p>
                        <strong>Feedback:</strong>{" "}
                        {quiz.feedback || "No feedback provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
