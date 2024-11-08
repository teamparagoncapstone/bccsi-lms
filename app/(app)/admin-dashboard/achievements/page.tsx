"use client";
import { useState, useEffect } from "react";
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
  studentUsername: string;
}

type AwardType = "Gold Badge" | "Silver Badge" | "Bronze Badge" | "Star Badge";

interface Award {
  id: string;
  student: Student;
  awardType: AwardType;
  tier?: string;
  createdAt: string;
  exercisesCompleted?: number;
  totalExercises?: number;
  quizId?: string;
}

const tierStyles = {
  Gold: {
    color: "bg-yellow-400",
    gradient: "bg-gradient-to-r from-yellow-300 to-yellow-600",
    glow: "glow-gold",
    icon: "🥇",
    ariaLabel: "Gold Badge",
    description: "Exemplary performance in all areas!",
  },
  Silver: {
    color: "bg-gray-300",
    gradient: "bg-gradient-to-r from-gray-200 to-gray-500",
    glow: "glow-silver",
    icon: "🥈",
    ariaLabel: "Silver Badge",
    description: "Outstanding efforts and achievements!",
  },
  Bronze: {
    color: "bg-orange-400",
    gradient: "bg-gradient-to-r from-orange-300 to-orange-600",
    glow: "glow-bronze",
    icon: "🥉",
    ariaLabel: "Bronze Badge",
    description: "Great commitment and growth!",
  },
  Star: {
    color: "bg-blue-400",
    gradient: "bg-gradient-to-r from-blue-300 to-blue-600",
    glow: "glow-star",
    icon: "⭐",
    ariaLabel: "Star Badge",
    description: "Shining bright with excellence!",
  },
};

const awardTypeToTier: Record<AwardType, keyof typeof tierStyles> = {
  "Gold Badge": "Gold",
  "Silver Badge": "Silver",
  "Bronze Badge": "Bronze",
  "Star Badge": "Star",
};

function Filter({
  onFilterChange,
}: {
  onFilterChange: (filter: string) => void;
}) {
  return (
    <div className="flex justify-center mb-4">
      <input
        type="text"
        placeholder="Search by student name..."
        onChange={(e) => onFilterChange(e.target.value)}
        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: any) {
  return (
    <div className="flex justify-center mt-4">
      <button
        className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-md transition-colors duration-200"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>
      <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
      <button
        className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-md transition-colors duration-200"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default function AchievementPage() {
  const { data: session, status } = useSession();
  const [awards, setAwards] = useState<Award[]>([]);
  const [filteredAwards, setFilteredAwards] = useState<Award[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await fetch("/api/achievements");
        const data: Award[] = await res.json();
        setAwards(data);
        setFilteredAwards(data);
      } catch (error) {
        console.error("Error fetching awards:", error);
      }
    };

    fetchAwards();
  }, []);

  const getTierStyle = (awardType: AwardType) => {
    const tier = awardTypeToTier[awardType];
    return tierStyles[tier];
  };

  const handleFilterChange = (filter: string) => {
    if (filter === "") {
      setFilteredAwards(awards);
    } else {
      const filtered = awards.filter((award) =>
        `${award.student.firstname} ${award.student.lastname}`
          .toLowerCase()
          .includes(filter.toLowerCase())
      );
      setFilteredAwards(filtered);
    }
  };

  const uniqueAwards = Array.from(
    new Map(
      filteredAwards.map((award) => [
        `${award.student.id}-${award.quizId}`,
        award,
      ])
    ).values()
  );

  const totalPages = Math.ceil(uniqueAwards.length / itemsPerPage);
  const displayedAwards = uniqueAwards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <div className="flex flex-1 overflow-y-auto bg-sky-100">
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

        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
            Student Achievements
          </h1>

          <Filter onFilterChange={handleFilterChange} />

          {uniqueAwards.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {displayedAwards.map((award) => {
                  const tierStyle = getTierStyle(award.awardType);
                  const exercisesProgress =
                    award.exercisesCompleted && award.totalExercises
                      ? (award.exercisesCompleted / award.totalExercises) * 100
                      : 0;

                  return (
                    <div
                      key={award.id}
                      className={`relative p-6 rounded-xl shadow-lg transition-transform duration-300 transform hover:scale-105 ${tierStyle.gradient} ${tierStyle.glow} text-white`}
                      style={{
                        border: `4px solid ${tierStyle.color}`,
                        boxShadow: `0 0 20px ${tierStyle.color}, 0 4px 30px rgba(0, 0, 0, 0.2)`,
                      }}
                      title={tierStyle.description}
                    >
                      <div className="absolute top-0 right-0 bg-white text-gray-800 py-1 px-3 text-xs font-bold rounded-bl-lg shadow-lg">
                        {tierStyle.icon} {award.awardType}
                      </div>

                      <div className="flex items-center">
                        <span
                          className="text-5xl mr-4 transition-transform duration-200 hover:scale-110"
                          aria-label={tierStyle.ariaLabel}
                          title={tierStyle.ariaLabel}
                          style={{
                            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))",
                          }}
                        >
                          {tierStyle.icon}
                        </span>
                        <div>
                          <h2 className="text-2xl font-bold tracking-wider">{`${award.student.firstname} ${award.student.lastname}`}</h2>
                          <p className="text-lg font-semibold mt-1">
                            Award:{" "}
                            <span className="font-extrabold">
                              {award.awardType}
                            </span>
                          </p>
                          <p className="text-md font-light mt-1">
                            Activities: {award.tier}
                          </p>
                          <p className="italic mt-2 text-sm">
                            {tierStyle.description}
                          </p>

                          {award.exercisesCompleted && award.totalExercises && (
                            <div className="mt-2">
                              <p className="text-sm font-light">
                                Exercises Completed:
                              </p>
                              <div className="relative w-full bg-gray-300 rounded-full h-3 mb-2">
                                <div
                                  className={`h-3 rounded-full transition-all duration-500 ease-out ${
                                    exercisesProgress === 100
                                      ? "bg-green-600"
                                      : exercisesProgress > 75
                                      ? "bg-yellow-500"
                                      : exercisesProgress > 50
                                      ? "bg-orange-500"
                                      : "bg-blue-600"
                                  }`}
                                  style={{ width: `${exercisesProgress}%` }}
                                ></div>
                              </div>
                              <p className="text-sm">{`${award.exercisesCompleted}/${award.totalExercises} completed`}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <p className="text-center text-gray-500">No awards found</p>
          )}
        </div>
      </div>
    </div>
  );
}
