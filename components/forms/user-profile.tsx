"use client";
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
import { Separator } from "../../components/ui/separator";
import toast from "react-hot-toast";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export function UserProfile() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [userData, setUserData] = useState<User | null>(null);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && session) {
      const username = session.user?.username;
      if (!username) {
        setError("User is not authenticated or username is missing.");
        return;
      }

      fetch(`/api/fetchUser?username=${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            setUserData(data.educator);
          } else {
            setError(data.message);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          setError(error.message);
        });
    }
  }, [loading, session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prevData) => (prevData ? { ...prevData, [id]: value } : null));
  };

  const handleSave = async () => {
    if (!userData) return;

    const updateUser = {
      ...userData,
      password: password || undefined,
    };
    console.log(
      `Fetching: /api/user-profile-educator?educatorId=${userData.id}`
    );
    try {
      const response = await fetch(
        `/api/user-profile-educator?educatorId=${userData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateUser),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setPassword("");
    } catch (error) {
      setError("Failed to update profile");
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-transparent border-none">
          Profile Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 sm:p-8">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          {error && <div className="text-red-500">{error}</div>}
          <Separator />
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={userData?.name || ""}
              className="sm:col-span-3"
              onChange={handleInputChange}
            />
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={userData?.username || ""}
              className="sm:col-span-3 text-xs"
              onChange={handleInputChange}
            />
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={userData?.email || ""}
              className="sm:col-span-3"
              onChange={handleInputChange}
            />
            <Label htmlFor="password">Password</Label>
            <div className="relative sm:col-span-3">
              <Input
                id="password"
                placeholder="Keep existing"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-4 h-4 text-gray-600" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
        <SheetFooter className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={handleSave} className="w-full sm:w-auto py-2">
            Save
          </Button>
          <SheetClose asChild>
            <Button className="w-full sm:w-auto py-2">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
