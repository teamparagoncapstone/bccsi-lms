"use client";

import VoiceExercisesList from "@/components/forms/VoiceExercisesList";
import { useSearchParams } from "next/navigation";
import TeamSwitcher from "@/app/(app)/grade-one-dashboard/_components/team-switcher";
import { UserNav } from "@/app/(app)/grade-one-dashboard/_components/user-nav";

import { SystemMenu } from "../_components/system-menu";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const searchParams = useSearchParams();
  const moduleTitle = searchParams.get("title") || "Default Module Title"; // Provide a default value

  return (
    <div className="relative w-full md:h-16">
      <div className="w-full h-auto md:h-16 ">
        <div className="flex h-16 items-center px-4">
          <div className="flex-1 flex items-center space-x-2 md:pr-2">
            <div className="hidden sm:block pr-2">
              <TeamSwitcher />
            </div>
            <div className="flex pl-2">
              <SystemMenu />
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <Separator />
      </div>
      <VoiceExercisesList moduleTitle={moduleTitle} />
    </div>
  );
}
