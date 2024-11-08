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
export default function ModulePage() {
  const [modules, setModules] = useState([]);
  const { data: session, status } = useSession();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/fetchmodules", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Send any necessary data in the request body
        });

        if (!response.ok) {
          throw new Error("Failed to fetch module data");
        }

        const responseData = await response.json();
        setModules(responseData.modules); // Set only the properties field to state

        // Log the properties data to the console
        console.log(responseData.modules);
      } catch (error) {
        console.error("Error fetching module data:", error);
      }
    }

    fetchData();
  }, []); // This useEffect will run only once after the initial render

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
      <div className="flex-1 flex flex-col p-4 ">
        <div className="flex flex-col space-y-5">
          <h2 className="text-2xl font-bold tracking-tight">
            Module Management
          </h2>
          <p className="text-muted-foreground">
            This is where you can manage your modules.
          </p>
          <p></p>
        </div>
        <div className="flex-1 overflow-auto">
          <Suspense fallback={<Skeleton />}>
            <DataTable data={modules} columns={columns} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
