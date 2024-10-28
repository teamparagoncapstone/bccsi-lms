"use client";
import React from "react";
import { Suspense, useEffect, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { UserNav } from "../components/user-nav";
import TeamSwitcher from "../components/team-switcher";
import { Toaster } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { lists } from "../data/lists";
import { Sidebar } from "../components/sidebar";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/fetchstudents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }

        const responseData = await response.json();
        setStudents(responseData.students);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full h-auto md:h-16">
        <div className="flex h-16 items-center px-4">
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
          <div className="ml-auto flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <Separator />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col w-64 bg-blue-300 p-4 drop-shadow-lg h-screen">
          <Sidebar className="w-full" lists={lists} />
        </aside>

        {/* Sidebar Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-blue-300 p-4 drop-shadow-lg md:hidden transition-transform duration-300 ease-in-out z-40 ${
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

        <div className="flex-1 p-4 overflow-auto">
          <div className="flex flex-col space-y-5">
            <h2 className="text-2xl font-bold tracking-tight">
              Student Management
            </h2>
            <p className="text-muted-foreground">
              This is where you can manage your students.
            </p>
          </div>

          <div className="flex-1 overflow-auto">
            <Suspense fallback={<Skeleton />}>
              <DataTable data={students} columns={columns} />
            </Suspense>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
