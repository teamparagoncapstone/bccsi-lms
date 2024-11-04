import { cn } from "@/lib/utils";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import { list } from "../data/lists";
import {
  CircleUserRoundIcon,
  FileIcon,
  LoaderCircle,
  BarChart3Icon,
  SlidersIcon,
  TrophyIcon,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  lists: list[];
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn(className)}>
      <div className="py-2 bg-blue-300">
        <h2
          className="mb-4 px-6 text-lg text-center
        font-extrabold tracking-tight text-white"
        >
          Administrator Panel
        </h2>
        <Separator />
        {/* User Accounts Section */}

        <div className="space-y-5">
          <h3 className="text-md text-center font-bold text-gray-800 mt-4 mb-2">
            User Accounts
          </h3>
          <Separator />
          <div className="space-y-2">
            <div className="mb-2">
              <Link href="/admin-dashboard">
                <button className="flex items-center w-full p-2 text-left bg-white rounded border-2 border-transparent hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white hover:shadow-xl hover:border-blue-600 transform hover:scale-105 transition-all duration-300">
                  <SlidersIcon className="mr-2 transform transition-transform duration-300 hover:scale-110" />
                  <span className="transition-all duration-300 hover:font-bold">
                    Dashboard
                  </span>
                </button>
              </Link>
            </div>
            <Separator />
            <div className="mb-2">
              <Link href="/admin-dashboard/users">
                <button className="flex items-center w-full p-2 text-left bg-white rounded border-2 border-transparent hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white hover:shadow-xl hover:border-blue-600 transform hover:scale-105 transition-all duration-300">
                  <CircleUserRoundIcon className="mr-2 transform transition-transform duration-300 hover:scale-110" />
                  <span className="transition-all duration-300 hover:font-bold">
                    Add Admin Account
                  </span>
                </button>
              </Link>
            </div>
            <div className="mb-2">
              <Link href="/admin-dashboard/educators">
                <button className="flex items-center w-full p-2 text-left bg-white rounded border-2 border-transparent hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white hover:shadow-xl hover:border-blue-600 transform hover:scale-105 transition-all duration-300">
                  <CircleUserRoundIcon className="mr-2 transform transition-transform duration-300 hover:scale-110" />
                  <span className="transition-all duration-300 hover:font-bold hover:text-sm">
                    Add Educator Account
                  </span>
                </button>
              </Link>
            </div>
            <div className="mb-2">
              <Link href="/admin-dashboard/students">
                <button className="flex items-center w-full p-2 text-left bg-white rounded border-2 border-transparent hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white hover:shadow-xl hover:border-blue-600 transform hover:scale-105 transition-all duration-300">
                  <CircleUserRoundIcon className="mr-2 transform transition-transform duration-300 hover:scale-110" />
                  <span className="transition-all duration-300 hover:font-bold">
                    Add Student Account
                  </span>
                </button>
              </Link>
            </div>
            <Separator />
            <div className="mb-2">
              <Link href="/admin-dashboard/auditLogs">
                <button className="flex items-center w-full p-2 text-left bg-white rounded border-2 border-transparent hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white hover:shadow-xl hover:border-blue-600 transform hover:scale-105 transition-all duration-300">
                  <FileIcon className="mr-2 transform transition-transform duration-300 hover:scale-110" />
                  <span className="transition-all duration-300 hover:font-bold">
                    View Audit Logs
                  </span>
                </button>
              </Link>
            </div>
            <div className="mb-2">
              <Link href="/admin-dashboard/progressBar">
                <button className="flex items-center w-full p-2 text-left bg-white rounded border-2 border-transparent hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white hover:shadow-xl hover:border-blue-600 transform hover:scale-105 transition-all duration-300">
                  <LoaderCircle className="mr-2 transform transition-transform duration-300 hover:scale-110" />
                  <span className="transition-all duration-300 hover:font-bold">
                    Progress Bar
                  </span>
                </button>
              </Link>
            </div>
            <div className="mb-2">
              <Link href="/admin-dashboard/reports">
                <button className="flex items-center w-full p-2 text-left bg-white rounded border-2 border-transparent hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white hover:shadow-xl hover:border-blue-600 transform hover:scale-105 transition-all duration-300">
                  <BarChart3Icon className="mr-2 transform transition-transform duration-300 hover:scale-110" />
                  <span className="transition-all duration-300 hover:font-bold">
                    Reports
                  </span>
                </button>
              </Link>
            </div>
            <div className="mb-2">
              <Link href="/admin-dashboard/achievements">
                <button className="flex items-center w-full p-2 text-left bg-white rounded border-2 border-transparent hover:bg-gradient-to-r from-blue-400 to-blue-500 hover:text-white hover:shadow-xl hover:border-blue-600 transform hover:scale-105 transition-all duration-300">
                  <TrophyIcon className="mr-2 transform transition-transform duration-300 hover:scale-110" />
                  <span className="transition-all duration-300 hover:font-bold hover:text-sm text-sm">
                    Awards & Achievements
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
