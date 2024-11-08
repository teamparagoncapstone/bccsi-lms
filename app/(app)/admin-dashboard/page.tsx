"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import TeamSwitcher from "./components/team-switcher";
import { UserNav } from "@/app/(app)/admin-dashboard/components/user-nav";
import { Sidebar } from "./components/sidebar";
import { lists } from "./data/lists";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import UnauthorizedPage from "@/components/forms/unauthorized";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";
export default function AdminMenuBar() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [studentCounts, setStudentCounts] = useState({
    GradeOne: 0,
    GradeTwo: 0,
    GradeThree: 0,
  });
  const [educatorCounts, setEducatorCounts] = useState({
    EducatorOne: 0,
    EducatorTwo: 0,
    EducatorThree: 0,
  });

  useEffect(() => {
    setSidebarOpen(false);
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const response = await fetch("/api/fetch-student-teacher");
      const data = await response.json();
      setStudentCounts(data.students);
      setEducatorCounts(data.educators);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
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
              {sidebarOpen ? (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
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
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-blue-300 p-4 drop-shadow-lg md:block hidden">
          <Sidebar className="w-full" lists={lists} />
        </aside>

        {/* Sidebar Mobile Menu */}
        <div
          className={`fixed top-15 left-0 w-full h-full bg-blue-300 z-10 p-4 drop-shadow-lg md:hidden transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar className="w-full" lists={lists} />
          <button
            className="absolute top-4 right-4 p-2 rounded-full"
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

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card
                onClick={() => router.push("/admin-dashboard/students")}
                className="transition-transform transform hover:scale-105 shadow-lg rounded-lg bg-blue-50"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <span className="mr-2">📚</span> GRADE ONE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {studentCounts.GradeOne}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active students in the system.
                  </p>
                </CardContent>
              </Card>
              <Card
                onClick={() => router.push("/admin-dashboard/users")}
                className="transition-transform transform hover:scale-105 shadow-lg rounded-lg bg-blue-50"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <span className="mr-2">📖</span> GRADE TWO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {studentCounts.GradeTwo}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active students in the system.
                  </p>
                </CardContent>
              </Card>
              <Card
                onClick={() => router.push("/admin-dashboard/voice-exercises")}
                className="transition-transform transform hover:scale-105 shadow-lg rounded-lg bg-blue-50"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <span className="mr-2">🎤</span> GRADE THREE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {studentCounts.GradeThree}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active students in the system.
                  </p>
                </CardContent>
              </Card>
              <Card
                onClick={() => router.push("/admin-dashboard")}
                className="transition-transform transform hover:scale-105 shadow-lg rounded-lg bg-blue-50"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <span className="mr-2">👩‍🏫</span> EDUCATOR - G1
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {educatorCounts.EducatorOne}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active educators in the system.
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-transform transform hover:scale-105 shadow-lg rounded-lg bg-blue-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <span className="mr-2">👩‍🏫</span> EDUCATOR - G2
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {educatorCounts.EducatorTwo}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active educators in the system.
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-transform transform hover:scale-105 shadow-lg rounded-lg bg-blue-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <span className="mr-2">👩‍🏫</span> EDUCATOR - G3
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {educatorCounts.EducatorThree}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active educators in the system.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
