"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "./loading";
import TeamSwitcher from "@/app/(app)/educator-three-dashboard/components/team-switcher";
import { UserNav } from "@/app/(app)/educator-three-dashboard/components/user-nav";
import { SystemMenu } from "./components/system-menu";
import { Suspense, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UnauthorizedPage from "./unauthorized";

interface Student {
  id: string;
  firstname: string | null;
  lastname: string | null;
}
interface VoiceExercises {
  student: Student;
  score: number;
}
interface Achiever {
  student: Student;
  score: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [moduleCount, setModuleCount] = useState(0);
  const [voiceExerciseCount, setVoiceExerciseCount] = useState(0);
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [voiceExercises, setVoiceExercises] = useState<VoiceExercises[]>([]);
  const [quizCount, setQuizCount] = useState(0);
  const [averageQuizScore, setAverageQuizScore] = useState(0);
  const [averageVoiceScore, setAverageVoiceScore] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!session) return;

      try {
        const [
          modulesResponse,
          achieversResponse,
          voicesResponse,
          averageScoreResponse,
        ] = await Promise.all([
          fetch("api/fetch-module-three", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }),
          fetch("/api/fetch-three-Achievers", { method: "GET" }),
          fetch("/api/fetch-three-Achievers-reading", { method: "GET" }),
          fetch("/api/average-three", { method: "GET" }),
        ]);

        // Check if responses are OK
        if (!modulesResponse.ok) {
          throw new Error("Failed to fetch modules");
        }
        if (!achieversResponse.ok) {
          throw new Error("Failed to fetch achievers");
        }
        if (!voicesResponse.ok) {
          throw new Error("Failed to fetch voice exercises");
        }

        const responseData = await modulesResponse.json();
        const achieversData = await achieversResponse.json();
        const voicesData = await voicesResponse.json();
        const averageScoreData = await averageScoreResponse.json();

        setModuleCount(responseData.counts.modules);
        setVoiceExerciseCount(responseData.counts.voiceExercises);
        setQuizCount(responseData.counts.questions);
        setAverageQuizScore(
          Math.round(parseFloat(averageScoreData.averageQuizScore))
        );
        setAverageVoiceScore(
          Math.round(parseFloat(averageScoreData.averageVoiceScore))
        );
        setAchievers(
          achieversData.filter((achiever: Achiever) => achiever.score >= 90)
        );
        setVoiceExercises(
          voicesData.filter((exercise: VoiceExercises) => exercise.score >= 90)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [session]);

  if (status === "loading") return <Loading />;
  if (status === "unauthenticated") return <UnauthorizedPage />;

  return (
    <div className="flex flex-col h-screen">
      <div className="w-full h-auto md:h-16">
        <div className="flex h-16 items-center px-4">
          <div className="hidden sm:block pr-2">
            <TeamSwitcher />
          </div>
          <div className="flex pl-2">
            {" "}
            <SystemMenu />
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <Separator />
      </div>
      <div
        className="flex-1 space-y-4 p-8 md:p-4 pt-6 bg-center bg-cover"
        style={{ backgroundImage: 'url("/images/TEACHER1.jpg")' }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:items-center ">
          <h2 className="text-3xl font-bold tracking-tight  ">Dashboard</h2>
          <div className="flex items-center space-x-2"></div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          <Card
            className="bg-cyan-100 shadow-lg shadow-indigo-500/40"
            onClick={() => router.push("/educator-three-dashboard/modules")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moduleCount}</div>
              <p className="text-xs text-muted-foreground">
                Total modules available in the system.
              </p>
            </CardContent>
          </Card>
          <Card
            className="bg-cyan-400 shadow-lg shadow-indigo-500/40"
            onClick={() => router.push("/educator-three-dashboard/voice")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Voice Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{voiceExerciseCount}</div>
              <p className="text-xs text-gray-800">
                Total voice exercises available in the system.
              </p>
            </CardContent>
          </Card>
          <Card
            className="bg-slate-300 shadow-lg shadow-indigo-500/40"
            onClick={() => router.push("/educator-three-dashboard/questions")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizCount}</div>
              <p className="text-xs text-gray-800">
                Total quizzes available in the system.
              </p>
            </CardContent>
          </Card>
          <Card
            className="bg-lime-100 shadow-lg shadow-indigo-500/40"
            onClick={() =>
              router.push("/educator-three-dashboard/history-quiz")
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Quiz Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageQuizScore}%</div>
              <p className="text-xs text-muted-foreground">
                Average score across all quizzes.
              </p>
            </CardContent>
          </Card>
          <Card
            className="bg-red-400 shadow-lg shadow-indigo-500/40"
            onClick={() =>
              router.push("/educator-three-dashboard/history-voice")
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Voice Exercise Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageVoiceScore}%</div>
              <p className="text-xs text-gray-800">
                Average score across all voice exercises submitted.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <Card
              className="col-span-6 bg-white shadow-md rounded-lg overflow-hidden"
              onClick={() =>
                router.push("/educator-three-dashboard/history-quiz")
              }
            >
              <CardHeader className="bg-yellow-200 p-4">
                <CardTitle className="text-lg font-bold text-gray-800">
                  Achievers Math ✨
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {achievers.length} achievers with scores of 90 and above.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {achievers.length > 0 ? (
                  achievers.map((achiever) => (
                    <div
                      key={achiever.student.id}
                      className="flex justify-between py-2 border-b last:border-b-0"
                    >
                      <span className="text-gray-700">{`${
                        achiever.student.firstname || "Unknown"
                      } ${achiever.student.lastname || ""}`}</span>
                      <span className="font-bold text-green-600">
                        {achiever.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500">No achievers found.</span>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <Card
              className="col-span-6 bg-white shadow-md rounded-lg overflow-hidden"
              onClick={() =>
                router.push("/educator-three-dashboard/history-voice")
              }
            >
              <CardHeader className="bg-yellow-200 p-4">
                <CardTitle className="text-lg font-bold text-gray-800">
                  Achievers Reading ✨
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {voiceExercises.length} achievers with scores of 90 and above.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {voiceExercises.length > 0 ? (
                  voiceExercises.map((exercise) => (
                    <div
                      key={exercise.student.id}
                      className="flex justify-between py-2 border-b last:border-b-0"
                    >
                      <span className="text-gray-700">{`${
                        exercise.student.firstname || "Unknown"
                      } ${exercise.student.lastname || ""}`}</span>
                      <span className="font-bold text-green-600">
                        {exercise.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500">No achievers found.</span>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
