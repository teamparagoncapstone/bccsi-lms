"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TeamSwitcher from "@/app/(app)/grade-two-dashboard/_components/team-switcher";
import { UserNav } from "@/app/(app)/grade-two-dashboard/_components/user-nav";
import { SystemMenu } from "./_components/system-menu";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaClipboardList,
  FaClipboardCheck,
  FaHourglassHalf,
} from "react-icons/fa";
import UnauthorizedPage from "@/components/forms/unauthorized";
import Loading from "./loading";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [assignedCount, setAssignedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);

  // Fetch the data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;

      const studentId = session.user.studentId;

      try {
        const response = await fetch(
          `/api/fetch-assigned-modules-two?studentId=${studentId}`
        );
        const data = await response.json();

        if (response.ok) {
          setAssignedCount(data.assignedModules);
          setInProgressCount(data.inProgressModules);
          setCompletedCount(data.completedModules);
          // You can use data.gradeOneModuleCount to display or use elsewhere
        } else {
          throw new Error(data.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (status === "loading") return <Loading />;

  if (status === "unauthenticated" || session?.user?.grade !== "GradeTwo") {
    return <UnauthorizedPage />;
  }

  return (
    <div className="w-full md:h-16 relative">
      <div className="w-full h-auto md:h-16">
        <div className="flex h-16 items-center px-4">
          <div className="hidden sm:block pr-2">
            <TeamSwitcher />
          </div>
          <div className="flex pl-2 z-30">
            <SystemMenu />
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <Separator />
      </div>
      <div
        className="bg-cover bg-center h-screen absolute top -0 left-0 w-full bg-opacity-100"
        style={{ backgroundImage: 'url("/images/voice2_bg1.jpg")' }}
      >
        <div className="flex-1 space-y-4 p-8 md:p-4 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:items-center">
            <h2 className="text-4xl font-bold tracking-tight text-center text-blue-600 z-10">
              Dashboard
            </h2>
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-center text-green-600 z-10">
                Grade 2
              </h2>
            </div>
            <div className="flex items-center space-x-2 z-10">
              <Button
                onClick={() =>
                  router.push("/grade-two-dashboard/module-homepage")
                }
                size="lg"
                className="ml-auto mt-8 mr-4 bg-orange-500 hover:bg-orange-400 transition z-10"
              >
                Go to Module
              </Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4 mt-16">
              <div className="container grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card
                  className="bg-blue-300 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 z-10"
                  onClick={() =>
                    router.push("/grade-two-dashboard/module-homepage")
                  }
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white flex items-center">
                      <FaClipboardList className="mr-2" /> To-do
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-black">
                      {assignedCount} Assigned
                    </div>
                    <p className="text-sm text-black">
                      activities for this month
                    </p>
                    <div
                      className="h-2 bg-green-200 rounded mt-2"
                      style={{ width: `${(assignedCount / 10) * 100}%` }}
                    ></div>
                  </CardContent>
                </Card>
                <Card
                  className="bg-red-400 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 z-10"
                  onClick={() =>
                    router.push("/grade-two-dashboard/module-homepage")
                  }
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white flex items-center">
                      <FaHourglassHalf className="mr-2" /> In Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-black">
                      {inProgressCount}
                    </div>
                    <p className="text-sm text-black">unfinished activities</p>
                    <div
                      className="h-2 bg-yellow-200 rounded mt-2"
                      style={{
                        width: `${(inProgressCount / 10) * 100}%`,
                      }}
                    ></div>
                  </CardContent>
                </Card>
                <Card
                  className="bg-yellow-400 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 z-10"
                  onClick={() =>
                    router.push("/grade-two-dashboard/history-quiz")
                  }
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white flex items-center">
                      <FaClipboardCheck className="mr-2" /> Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-black">
                      {completedCount}
                    </div>
                    <p className="text-sm text-black">finished activities</p>
                    <div
                      className="h-2 bg-blue-200 rounded mt-2"
                      style={{
                        width: `${(completedCount / 10) * 100}%`,
                      }}
                    ></div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* Playful background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-indigo-300 rounded-full opacity-40 animate-bounce-slow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-yellow-200 to-orange-300 rounded-full opacity-40 animate-bounce-fast"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-gradient-to-r from-green-300 to-teal-400 rounded-full opacity-40 animate-spin-slow"></div>
        <div className="absolute top-40 left-5 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-60 animate-bounce-alt"></div>
        <div className="absolute bottom-40 right-5 w-20 h-20 bg-gradient-to-r from-orange-300 to-yellow-500 rounded-full opacity-35 animate-bounce"></div>
        <div className="absolute top-24 left-24 w-36 h-36 bg-gradient-to-r from-red-300 to-purple-300 rounded-full opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-40 w-30 h-30 bg-gradient-to-r from-teal-200 to-blue-300 rounded-full opacity-40 animate-pulse-alt"></div>
        <div className="absolute top-36 right-5 w-20 h-20 bg-gradient-to-r from-indigo-300 to-blue-500 rounded-full opacity-45 animate-spin-fast"></div>
      </div>
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes bounce-fast {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }
        @keyframes pulse-alt {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(0.9);
            opacity: 0.6;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-fast {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        .animate-bounce-fast {
          animation: bounce-fast 2s infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        .animate-pulse-alt {
          animation: pulse-alt 3s infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
        .animate-spin-fast {
          animation: spin-fast 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
