"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { KeyRoundIcon } from "lucide-react";
import { OtpVerificationDialog } from "./otpVerification";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function LoginModal() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOtpDialog, setShowOtpDialog] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false); // New state for password visibility

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!password.trim()) {
      toast.error("Password is required.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (res?.error) {
        toast.error("Invalid username or password. Please try again.");
      } else {
        const session = await getSession();
        if (session) {
          if (session.user.role === "Student") {
            toast.success("Sign in successful. Redirecting...");
            const grade = session.user.grade;
            switch (grade) {
              case "GradeOne":
                router.push("/grade-one-dashboard");
                break;
              case "GradeTwo":
                router.push("/grade-two-dashboard");
                break;
              case "GradeThree":
                router.push("/grade-three-dashboard");
                break;
              default:
                toast.error("Grade level is not recognized.");
            }
          } else {
            const otpResponse = await fetch("/api/send-otp", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username }),
            });

            if (!otpResponse.ok) {
              toast.error("Failed to send OTP. Please try again.");
              return;
            }

            toast.success("OTP sent to your email. Please verify.");
            setShowOtpDialog(true);
          }
        }
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      toast.error("An error occurred during sign-in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    getSession().then((session) => {
      if (session) {
        switch (session.user.role) {
          case "Teacher":
            const educatorLevel = session.user.educatorLevel;
            switch (educatorLevel) {
              case "EducatorOne":
                router.push("/educator-one-dashboard");
                break;
              case "EducatorTwo":
                router.push("/educator-two-dashboard");
                break;
              case "EducatorThree":
                router.push("/educator-three-dashboard");
                break;
              default:
                toast.error("Educator level is not recognized.");
            }
            break;
          case "Administrator":
          case "Principal":
          case "Registrar":
            router.push("/admin-dashboard");
            break;
          default:
            toast.error("User role is not recognized.");
        }
      }
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Sign in</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={onSubmit}>
            <CardHeader className="space-y-1 rounded">
              <CardTitle className="text-2xl text-center rounded">
                Sign in
              </CardTitle>
              <CardDescription className="text-center rounded">
                Enter your username and password to login
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 rounded">
              <div className="grid gap-2 rounded">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2 rounded">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"} // Toggle password visibility
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {passwordVisible ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}{" "}
                    {/* Use appropriate icons */}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 rounded">
                <p className="mt-2 text-sm text-center text-gray-700 mb-2">
                  <Link
                    href="/reset-password"
                    className="text-indigo-500 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" onClick={onSubmit}>
                {isLoading ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <KeyRoundIcon className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Signing in.." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </DialogContent>
      </Dialog>
      {showOtpDialog && (
        <OtpVerificationDialog
          username={username}
          onClose={() => setShowOtpDialog(false)}
          onSuccess={handleOtpSuccess}
        />
      )}
    </>
  );
}
