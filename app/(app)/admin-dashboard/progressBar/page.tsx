"use client";
import React, { useEffect, useState } from "react";
import { FaBook, FaUsers } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { UserNav } from "@/app/(app)/admin-dashboard/components/user-nav";
import { Sidebar } from "../components/sidebar";
import { lists } from "../data/lists";
import TeamSwitcher from "../components/team-switcher";
import UnauthorizedPage from "@/components/forms/unauthorized";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
interface Student {
  id: string;
  firstname: string;
  lastname: string;
  grade: string;
  moduleProgress: {
    total: number;
    completed: number;
  };
  achievements?: string[];
}

interface ApiResponse {
  students: Student[];
  totalModules: number;
  modulesByGrade: {
    GradeOne: number;
    GradeTwo: number;
    GradeThree: number;
  };
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-5xl" />
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <FaUsers className="text-gray-400 text-6xl mb-4" />
    <p className="text-xl text-gray-600">
      No students available for this selection.
    </p>
  </div>
);

const GradeSelector = ({
  selectedGrade,
  handleGradeChange,
}: {
  selectedGrade: string;
  handleGradeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="mb-6 flex justify-center items-center space-x-2">
    <label htmlFor="grade-select" className="text-lg font-medium text-gray-700">
      Grade Level:
    </label>
    <div className="relative">
      <select
        id="grade-select"
        value={selectedGrade}
        onChange={handleGradeChange}
        className="p-3 pl-5 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:shadow-lg"
      >
        <option value="">All Grades</option>
        <option value="GradeOne">Grade 1</option>
        <option value="GradeTwo">Grade 2</option>
        <option value="GradeThree">Grade 3</option>
      </select>
    </div>
  </div>
);

const SearchBar = ({
  searchTerm,
  handleSearchChange,
}: {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex justify-center items-center mb-6">
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by student name..."
        className="w-full p-3 pl-12 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:shadow-lg"
      />
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
        <FiSearch className="text-2xl" />
      </span>
    </div>
  </div>
);

const ProgressOverview = ({
  totalModules,
  selectedGrade,
  gradeDisplayNames,
  modulesByGrade,
}: {
  totalModules: number;
  selectedGrade: string;
  gradeDisplayNames: { [key in keyof typeof modulesByGrade]: string };
  modulesByGrade: { GradeOne: number; GradeTwo: number; GradeThree: number };
}) => (
  <div className="text-center mb-6">
    <div className="text-xl font-semibold mb-2 flex justify-center items-center space-x-2">
      <FaBook className="text-blue-600" />
      <p>Total Modules: {totalModules}</p>
    </div>
    {selectedGrade && (
      <div className="text-xl font-semibold">
        <p>
          Total Modules for{" "}
          {gradeDisplayNames[selectedGrade as keyof typeof gradeDisplayNames]}:{" "}
          {modulesByGrade[selectedGrade as keyof typeof modulesByGrade]}
        </p>
      </div>
    )}
  </div>
);

const StudentCard = ({ student }: { student: Student }) => {
  const progressPercentage = (
    (student.moduleProgress.completed / student.moduleProgress.total) *
    100
  ).toFixed(2);

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 75) {
      return "bg-green-500";
    } else if (percentage >= 50) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  };

  return (
    <div className="mb-6 p-6 border border-gray-300 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-bold mb-2">
        {student.firstname} {student.lastname}
      </h3>
      <h4 className="text-lg font-semibold mb-2">Module Progress:</h4>
      <p className="text-xl mb-4">{progressPercentage}%</p>
      <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
        <div
          className={`${getProgressBarColor(
            parseFloat(progressPercentage)
          )} h-4 rounded-full`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      {student.achievements && student.achievements.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Achievements:</h4>
          <ul className="list-disc pl-6">
            {student.achievements.map((achievement, index) => (
              <li key={index} className="text-sm text-gray-600">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function ProgressBarComponent() {
  const { data: session, status } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [totalModules, setTotalModules] = useState<number>(0);
  const [modulesByGrade, setModulesByGrade] = useState<{
    GradeOne: number;
    GradeTwo: number;
    GradeThree: number;
  }>({
    GradeOne: 0,
    GradeTwo: 0,
    GradeThree: 0,
  });
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const gradeDisplayNames: { [key in keyof typeof modulesByGrade]: string } = {
    GradeOne: "Grade 1",
    GradeTwo: "Grade 2",
    GradeThree: "Grade 3",
  };

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      const response = await fetch("/api/student-progress");
      const data: ApiResponse = await response.json();
      setStudents(data.students);
      setTotalModules(data.totalModules);
      setModulesByGrade(data.modulesByGrade);
      setLoading(false);
    }

    fetchStudents();
  }, []);

  const filteredStudents = students
    .filter((student) =>
      `${student.firstname} ${student.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((student) =>
      selectedGrade ? student.grade === selectedGrade : true
    );

  const handleGradeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrade(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  if (status === "loading")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  if (status === "unauthenticated") return <UnauthorizedPage />;
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
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
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

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-y-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-300 p-4 drop-shadow-lg md:block hidden">
          <Sidebar className="w-full" lists={lists} />
        </aside>

        {/* Sidebar for Mobile */}
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

        {/* Main Content */}
        <main className="flex-1 p-8 h-full overflow-auto scrollbar-thin bg-sky-50">
          <h2 className="text-3xl text-center font-bold mb-6">
            Student Progress Overview
          </h2>

          {/* Grade Selector */}
          <GradeSelector
            selectedGrade={selectedGrade}
            handleGradeChange={handleGradeChange}
          />

          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
          />

          {/* Progress Overview */}
          <ProgressOverview
            totalModules={totalModules}
            selectedGrade={selectedGrade}
            gradeDisplayNames={gradeDisplayNames}
            modulesByGrade={modulesByGrade}
          />

          {/* Students Display */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
}
