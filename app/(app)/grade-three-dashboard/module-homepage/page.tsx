"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

import TeamSwitcher from "@/app/(app)/grade-three-dashboard/_components/team-switcher";

import { SystemMenu } from "../_components/system-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserNav } from "@/app/(app)/grade-three-dashboard/_components/user-nav";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function DashboardPage() {
  const [modules, setModules] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchModules() {
      try {
        const response = await fetch("/api/grade-three-module");
        if (!response.ok) throw new Error("Failed to fetch modules");
        const data = await response.json();
        setModules(data.modules);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    }

    fetchModules();
  }, []);

  // Filter modules based on subject
  const readingModules = modules.filter((module: any) =>
    module.subjects.includes("Reading")
  );
  const mathModules = modules.filter((module: any) =>
    module.subjects.includes("Math")
  );

  return (
    <div className="w-full md:h-screen">
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
      <div className="flex">
        <div
          className="bg-cover bg-center h-screen -z-10 absolute top -0 left-0 w-full bg-opacity-100"
          style={{ backgroundImage: 'url("/images/bgfront1.jpg")' }}
        ></div>
        <div className="flex-1 space-y-4 p-8 md:p-4 pt-6 relative ">
          <Button
            className="text-blue-500 bg-black hover:bg-blue-100 p-4 rounded-full shadow-lg"
            onClick={() => router.push("/grade-three-dashboard")}
          >
            <FaArrowLeft className="text-2xl" />
          </Button>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:items-center pt-10">
            {modules.length > 0 ? (
              <Tabs
                defaultValue="reading"
                className="w-[90%] md:w-[600px] bg-blue-200 rounded-lg shadow-lg"
              >
                <TabsList className="flex mb-3 bg-blue-400 text-white rounded-t-lg">
                  <TabsTrigger
                    className="flex-1 py-2 text-lg font-semibold"
                    value="reading"
                  >
                    Reading
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex-1 py-2 text-lg font-semibold"
                    value="math"
                  >
                    Math
                  </TabsTrigger>
                </TabsList>
                <TabsContent className="text-center p-4" value="reading">
                  {readingModules.length > 0 ? (
                    readingModules.map((module: any, index: number) => (
                      <Card
                        className="bg-yellow-100 text-black rounded-lg shadow-md p-4 mb-4"
                        key={index}
                      >
                        <CardTitle className="text-xl font-bold mb-2">
                          {module.moduleTitle}
                        </CardTitle>
                        <Image
                          src={
                            module.imageModule || "/images/default-image1.jpg"
                          }
                          alt="module image"
                          className="mx-auto my-auto"
                          width={200}
                          height={200}
                        />
                        <Button
                          onClick={() => {
                            // Ensure module properties are defined
                            if (module) {
                              // Create a URLSearchParams object to encode query parameters
                              const queryParams = new URLSearchParams({
                                title: module.moduleTitle || "",
                                video: module.videoModule || "",
                                description: module.moduleDescription || "",
                                learnOutcome: module.learnOutcome1 || "",
                              });

                              // Use the encoded query string in the router.push call
                              router.push(
                                `/grade-three-dashboard/module-reading?${queryParams.toString()}`
                              );
                            }
                          }}
                          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
                        >
                          Start Reading
                        </Button>
                      </Card>
                    ))
                  ) : (
                    <p className="text-lg">No Reading modules available.</p>
                  )}
                </TabsContent>
                <TabsContent className="text-center p-4" value="math">
                  {mathModules.length > 0 ? (
                    mathModules.map((module: any, index: number) => (
                      <Card
                        className="bg-yellow-100 text-black rounded-lg shadow-md p-4 mb-4"
                        key={index}
                      >
                        <CardTitle className="text-xl font-bold mb-2">
                          {module.moduleTitle}
                        </CardTitle>
                        <Image
                          src={
                            module.imageModule || "/images/default-image.jpg"
                          }
                          alt="module image"
                          className="mx-auto my-auto"
                          width={200}
                          height={200}
                        />
                        <Button
                          onClick={() => {
                            // Ensure module properties are defined
                            if (module) {
                              // Create a URLSearchParams object to encode query parameters
                              const queryParams = new URLSearchParams({
                                title: module.moduleTitle || "",
                                video: module.videoModule || "",
                                description: module.moduleDescription || "",
                                learnOutcome: module.learnOutcome1 || "",
                              });

                              // Use the encoded query string in the router.push call
                              router.push(
                                `/grade-three-dashboard/module-math?${queryParams.toString()}`
                              );
                            }
                          }}
                          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
                        >
                          Start Math
                        </Button>
                      </Card>
                    ))
                  ) : (
                    <p className="text-lg">No Math modules available.</p>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <p className="text-lg">No modules available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
