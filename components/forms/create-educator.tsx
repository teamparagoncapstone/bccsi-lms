"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { CheckCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import FileUpload from "./file-upload";
import "@uploadthing/react/styles.css";
import { CircleUserRoundIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { z } from "zod";
import { useSession as useNextAuthSession } from "next-auth/react";
import { EducatorLevel } from "@prisma/client";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  role: string;
}
const EducatorSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string().email("Invalid email format"),
  educatorLevel: z.string(),
  image: z.string(),
  userId: z.string(),
});

export function AddNewEducator() {
  const { data: session } = useNextAuthSession();
  const userId = (session?.user as User)?.id;
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    educatorLevel: "",
    image: "",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof formData, boolean>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [usernameExists, setUsernameExists] = useState(false);

  const handleChange = useCallback(
    (key: keyof typeof formData) => (value: string | undefined) => {
      if (value !== undefined) {
        setFormData((prevState) => ({
          ...prevState,
          [key]: value,
        }));

        if (key === "password") {
          setFormErrors((prev) => ({ ...prev, password: value.length < 8 }));
        } else if (key === "email") {
          const emailValidation = EducatorSchema.safeParse({
            ...formData,
            userId,
            email: value,
          });
          setFormErrors((prev) => ({
            ...prev,
            email: !emailValidation.success,
          }));
        }
      }
    },
    [formData, userId]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (formData.password.length < 8) {
        setFormErrors((prev) => ({ ...prev, password: true }));

        return;
      }

      const validatedData = { ...formData, userId };
      const response = await fetch("/api/create-educator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            (session as { accessToken: string })?.accessToken
          }`,
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData.message.includes(
            "An educator with this username already exists"
          )
        ) {
          setUsernameExists(true);
        }
        throw new Error(errorData.message);
      }

      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        educatorLevel: "",
        image: "",
      });
      toast.success("Educator added successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      const err = error as Error;
      if (err.message.includes("Invalid email format")) {
        console.error("Invalid email:", formData.email);
      } else {
        console.error(err);
        toast.error(
          err.message || "Educator could not be added. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-[192px]" variant="outline">
          <CircleUserRoundIcon className="pr-2 " /> Add New Educator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] flex flex-col">
        <DialogHeader className="sm:max-w-[600px] flex flex-col items-center justify-center text-center">
          <DialogTitle>Educator Details</DialogTitle>
          <DialogDescription>
            Fill all the required fields to add a new educator.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Card>
            <CardContent>
              <div className="flex">
                <div className="w-1/2 pr-4 mt-2">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name")(e.target.value)}
                    className={formErrors.name ? "invalid" : ""}
                  />
                </div>
                <div className="w-1/2 mt-2 pr-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    required
                    value={formData.username}
                    onChange={(e) => handleChange("username")(e.target.value)}
                    onBlur={() => {
                      if (
                        !EducatorSchema.safeParse({
                          ...formData,
                          email: formData.email,
                        }).success
                      ) {
                        setFormErrors((prev) => ({ ...prev, email: true }));
                      } else {
                        setFormErrors((prev) => ({ ...prev, email: false }));
                      }
                    }}
                    className={formErrors.username ? "invalid" : ""}
                  />
                  {usernameExists && (
                    <p className="text-red-600 text-sm">
                      *Username already exists.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2 mt-2 pr-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email")(e.target.value)}
                    className={formErrors.email ? "invalid" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-red-600 text-sm">
                      *Invalid email format
                    </p>
                  )}
                </div>
                <div className="w-1/2 mt-2 pr-4">
                  <div className="relative">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      required
                      type={passwordVisible ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password")(e.target.value)}
                      className={formErrors.password ? "invalid" : ""}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                    >
                      {passwordVisible ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}{" "}
                      {/* Use appropriate icons */}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-600 text-sm">
                      *Password must be strong.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="w-1/2 mt-2 pr-4">
                  <Label>Educator Level</Label>
                  <Select
                    value={formData.educatorLevel}
                    onValueChange={handleChange("educatorLevel")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Educator Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EducatorLevel.EducatorOne}>
                        Educator Grade 1
                      </SelectItem>
                      <SelectItem value={EducatorLevel.EducatorTwo}>
                        Educator Grade 2
                      </SelectItem>
                      <SelectItem value={EducatorLevel.EducatorThree}>
                        Educator Grade 3
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-2">
          <CardContent>
            <Label>Educator Image</Label>
            <FileUpload
              apiEndpoint="userImage"
              value={formData.image}
              onChange={(url) => url && handleChange("image")(url)}
              className={`${formData.image ? "invalid" : ""} items-right`}
            />
          </CardContent>
        </Card>
        <DialogFooter className="mt-4">
          <div className="flex justify-center w-full">
            <Button
              className="w-1/4"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircledIcon className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Adding educator.." : "Submit"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
