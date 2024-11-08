"use client";
import { Suspense, useEffect, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { UserNav } from "../components/user-nav";
import TeamSwitcher from "../components/team-switcher";
import { SystemMenu } from "../components/system-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import UnauthorizedPage from "@/components/forms/unauthorized";
import Loading from "./loading";

export default function ComprehensionPage() {
  const [comprehensions, setComprehension] = useState([]);
  const { data: session, status } = useSession();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/fetch-comprehension", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch module data");
        }

        const responseData = await response.json();
        setComprehension(responseData.comprehensionTest);

        console.log(responseData.comprehensions);
      } catch (error) {}
    }

    fetchData();
  }, []);

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
      <div className="flex-1 flex flex-col p-4">
        <div className="flex flex-col space-y-5">
          <h2 className="text-2xl font-bold tracking-tight">
            Comprehension Test Management
          </h2>
          <p className="text-muted-foreground">
            This is where you can manage your comprehension.
          </p>
          <p></p>
        </div>
        <div className="flex-1 overflow-auto">
          <Suspense fallback={<Skeleton />}>
            <DataTable data={comprehensions} columns={columns} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
