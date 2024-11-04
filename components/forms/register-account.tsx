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
import { Role } from "@prisma/client";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const UserSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string().email("Invalid email format"),
  role: z.string(),
  image: z.string(),
});

export function AddNewUser() {
  const { data: session } = useNextAuthSession();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    role: "",
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

        if (key === "username") {
          setUsernameExists(false);
        }

        if (key === "password") {
          setFormErrors((prev) => ({ ...prev, password: value.length < 8 }));
        } else if (key === "email") {
          const emailValidation = UserSchema.safeParse({
            ...formData,
            email: value,
          });
          setFormErrors((prev) => ({
            ...prev,
            email: !emailValidation.success,
          }));
        }
      }
    },
    [formData]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (formData.password.length < 8) {
        setFormErrors((prev) => ({ ...prev, password: true }));

        return;
      }

      UserSchema.parse(formData);
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            (session as { accessToken: string })?.accessToken
          }`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData.message.includes("A user with this username already exists")
        ) {
          setUsernameExists(true);
        }
        throw new Error(errorData.message);
      }
      // Reset form
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "",
        image: "",
      });
      toast.success("User added successfully.");
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
          err.message || "User could not be added. Please try again."
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
          <CircleUserRoundIcon className="pr-2 " /> Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] flex flex-col">
        <DialogHeader className="sm:max-w-[600px] flex flex-col items-center justify-center text-center">
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Fill all the required fields to add a new user.
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
                        !UserSchema.safeParse({
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
                  <Label>Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleChange("role")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Role.Administrator}>
                        Administrator
                      </SelectItem>
                      <SelectItem value={Role.Principal}>Principal</SelectItem>
                      <SelectItem value={Role.Registrar}>Registrar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-2">
          <CardContent>
            <Label>User Image</Label>
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
              {isLoading ? "Adding user.." : "Submit"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
