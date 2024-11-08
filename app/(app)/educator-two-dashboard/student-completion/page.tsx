"use client";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { UserNav } from "../components/user-nav";
import TeamSwitcher from "../components/team-switcher";
import { SystemMenu } from "../components/system-menu";
import { Separator } from "@/components/ui/separator";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSession } from "next-auth/react";
import UnauthorizedPage from "@/components/forms/unauthorized";
import Loading from "../loading";

type StudentData = {
  id: string;
  firstname: string;
  lastname: string;
  StudentProgress: {
    module: {
      moduleTitle: string;
    };
    progress: number;
  }[];
  StudentQuizHistory: { completed: boolean }[];
  VoiceExcercisesHistory: { completed: boolean }[];
  totalModules: number;
  averageProgress: number;
};

// ProgressBar Component
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-sm">
    <div
      className={`absolute top-0 left-0 h-4 transition-all duration-300 ease-in-out ${
        progress >= 75
          ? "bg-green-500"
          : progress >= 50
          ? "bg-yellow-400"
          : "bg-red-500"
      }`}
      style={{ width: `${progress}%` }}
      title={`${progress}% Complete`}
    >
      <span className="text-xs text-white absolute right-1 top-0.5">
        {progress}%
      </span>
    </div>
  </div>
);

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex justify-between items-center mt-6">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all disabled:bg-gray-300"
    >
      <IoChevronBack className="mr-1" /> Previous
    </button>
    <span className="text-gray-700 font-semibold">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all disabled:bg-gray-300"
    >
      Next <IoChevronForward className="ml-1" />
    </button>
  </div>
);

export default function StudentCompletion() {
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/studentCompletion-two");
        const data: StudentData[] = await response.json();
        setStudentData(data);
      } catch (error) {
        setError("Error fetching student completion data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStudents = studentData.filter((student) =>
    `${student.firstname} ${student.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const displayedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Export to Excel
  const handleExportToExcel = () => {
    // Prepare filtered student data for export
    const exportData = filteredStudents.map(
      ({
        id,
        StudentProgress,
        StudentQuizHistory,
        VoiceExcercisesHistory,
        ...rest
      }) => rest
    );
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "student_completion.xlsx");
  };

  // Export to PDF
  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Student Completion Data", 14, 16);

    // Prepare data for the table
    const tableColumn = [
      "Student Name",
      "Total Modules",
      "Average Completion %",
    ];
    const tableRows = filteredStudents.map((student) => [
      `${student.firstname} ${student.lastname}`,
      student.totalModules,
      student.averageProgress ? student.averageProgress.toFixed(2) : "0.00%",
    ]);

    // Add autoTable
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid", // Optional: specify the theme of the table
    });

    doc.save("student_completion.pdf");
  };

  if (status === "loading") return <Loading />;
  if (status === "unauthenticated") return <UnauthorizedPage />;

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
      <div className="p-8 font-sans bg-blue-50 flex-grow">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Student Completion
        </h2>
        {/* Search Input */}
        <div className="mb-6 flex justify-center items-center relative w-3/4 md:w-1/2 mx-auto">
          <FiSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search students by name"
            className="border border-gray-300 rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-4 mb-2">
          <CSVLink
            data={filteredStudents.map(
              ({
                id,
                StudentProgress,
                StudentQuizHistory,
                VoiceExcercisesHistory,
                ...rest
              }) => rest
            )}
            filename="student_completion.csv"
            className="flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
          >
            Export to CSV
          </CSVLink>
          <button
            onClick={handleExportToExcel}
            className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
          >
            Export to Excel
          </button>
          <button
            onClick={handleExportToPDF}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-all"
          >
            Export to PDF
          </button>
        </div>
        {loading ? (
          <div className="text-center text-gray-600 animate-pulse">
            Loading data...
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 border-b border-gray-300">
                  <th className="px-6 py-3 text-left text-white font-semibold">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-center text-white font-semibold">
                    Total Modules
                  </th>
                  <th className="px-6 py-3 text-center text-white font-semibold">
                    Average Completion %
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-200 hover:bg-gray-100 transition duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {`${student.firstname} ${student.lastname}`}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 font-semibold">
                      {student.totalModules}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-green-700 mb-1">
                          {student.averageProgress
                            ? student.averageProgress.toFixed(2)
                            : "0.00"}
                          %
                        </span>
                        <ProgressBar progress={student.averageProgress || 0} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="text-center py-6 text-gray-600 font-medium">
                No students found.
              </div>
            )}
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
