import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";
interface Student {
  firstname?: string;
  lastname?: string;
  middlename?: string;
  studentUsername?: string;
  password?: string;
  // sex?: string;
  // bdate?: string;
  // grade?: string;
  gname?: string;
  image?: string;
}

export function StudentProfile() {
  const { data: session } = useSession();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentId = session?.user.studentId;
        if (!studentId) {
          setError("Student ID not found");
          return;
        }

        const response = await fetch(
          `/api/fetch-profile-student?studentId=${session?.user.studentId}`
        );
        const result = await response.json();
        if (result.status === "success") {
          setStudentData(result.student);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch student data");
      }
    };

    if (session?.user.studentId) {
      fetchStudentData();
    }
  }, [session?.user.studentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value); // Handle password separately
    } else if (studentData) {
      setStudentData({ ...studentData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updateData = { ...studentData };
    if (password) {
      updateData.password = password; // Only include password if it's not blank
    }

    try {
      const response = await fetch(
        `/api/fetch-profile-student?studentId=${session?.user.studentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        toast.success("Profile updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        setPassword("");
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      toast.error("Failed to update profile");
      setError("Failed to update profile");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-transparent border-none">
          Profile Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto max-h-screen p-4">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto max-h-[80vh] scrollbar-thin">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 py-4"
          >
            {error && <div className="text-red-500">{error}</div>}
            <Separator />
            <Avatar className="h-32 w-32">
              {session?.user?.image ? (
                <AvatarImage src={session.user.image} alt="@user" />
              ) : (
                <AvatarImage src="/assets/usericon.png" alt="@user" />
              )}
              <AvatarFallback>
                <Image
                  src="/assets/usericon.png"
                  alt="Fallback Image"
                  width={200}
                  height={200}
                />
              </AvatarFallback>
            </Avatar>

            {studentData && (
              <>
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  required
                  id="firstname"
                  name="firstname"
                  value={studentData.firstname || ""}
                  onChange={handleChange}
                />

                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  required
                  id="lastname"
                  name="lastname"
                  value={studentData.lastname || ""}
                  onChange={handleChange}
                />

                <Label htmlFor="middlename">Middle Name</Label>
                <Input
                  required
                  id="middlename"
                  name="middlename"
                  value={studentData.middlename || ""}
                  onChange={handleChange}
                />

                <Label htmlFor="studentUsername">Username</Label>
                <Input
                  id="studentUsername"
                  name="studentUsername"
                  value={studentData.studentUsername || ""}
                  onChange={handleChange}
                />

                <Label htmlFor="password">Password</Label>
                <div className="relative w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Leave blank to keep current password"
                    value={password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>

                <Label htmlFor="gname">Guardian Name</Label>
                <Input
                  required
                  id="gname"
                  name="gname"
                  value={studentData.gname || ""}
                  onChange={handleChange}
                />
              </>
            )}

            <SheetFooter>
              <Button type="submit">Save Changes</Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
