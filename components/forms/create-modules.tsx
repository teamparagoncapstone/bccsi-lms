"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import { PlusCircleIcon } from "lucide-react";
import { Grade, Subject } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Card, CardContent } from "../ui/card";
import FileUpload from "./file-upload";
import { z } from "zod";
import "@uploadthing/react/styles.css";
import { useSession as useNextAuthSession } from "next-auth/react";
import FileUploadDropzone from "./FileUploadDropzone";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

const moduleSchema = z.object({
  moduleTitle: z.string(),
  moduleDescription: z.string(),
  learnOutcome1: z.string(),
  videoModule: z.string(),
  imageModule: z.string(),
  subjects: z.string(),
  grade: z.string(),
});

export function CreateModules() {
  const { data: session } = useNextAuthSession();
  const userId = (session?.user as User)?.id;
  const [formData, setFormData] = useState({
    moduleTitle: "",
    moduleDescription: "",
    learnOutcome1: "",
    videoModule: "",
    imageModule: "",
    subjects: "",
    grade: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof formData, boolean>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    key: keyof typeof formData,
    value: string | number | Date | undefined
  ) => {
    if (value !== undefined) {
      const formattedValue =
        value instanceof Date ? value.toISOString() : value;
      setFormData((prevState) => ({
        ...prevState,
        [key]: formattedValue,
      }));
    } else if (value === "") {
      // Handle removal of the file
      setFormData((prevState) => ({
        ...prevState,
        [key]: "",
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      moduleSchema.parse(formData);
      const response = await fetch("/api/create-modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            (session as { accessToken: string })?.accessToken
          }`,
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "An error occurred");
      }

      setFormData({
        moduleTitle: "",
        moduleDescription: "",
        learnOutcome1: "",
        videoModule: "",
        imageModule: "",
        grade: "",
        subjects: "",
      });
      toast.success("Module added successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      const err = error as Error;
      console.error(err);
      toast.error(
        err.message || "Module could not be added. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircleIcon className="pr-2" /> Create Module
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-auto flex flex-col">
        <DialogHeader className="sm:max-w-auto flex flex-col items-center justify-center text-center">
          <DialogTitle>Module Details</DialogTitle>
          <DialogDescription>
            Fill all the required fields to add a new module.
          </DialogDescription>
        </DialogHeader>
        <div className="mx-auto w-full">
          <div className="flex">
            <div className="w-full mt-2 pr-4">
              <Label>Select Subject</Label>
              <Select
                onValueChange={(value) => handleChange("subjects", value)}
                value={formData.subjects}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Subject.Math}>Math</SelectItem>
                  <SelectItem value={Subject.Reading}>Reading</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full mt-2 pr-4">
              <Label>Select Grade</Label>
              <Select
                onValueChange={(value) => handleChange("grade", value)}
                value={formData.grade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Grade.GradeOne}>Grade 1</SelectItem>
                  <SelectItem value={Grade.GradeTwo}>Grade 2</SelectItem>
                  <SelectItem value={Grade.GradeThree}>Grade 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-full pr-4 mt-2">
            <Label htmlFor="moduletitle" className="text-right">
              Module Title
            </Label>
            <Input
              required
              type="moduleTitle"
              value={formData.moduleTitle}
              onChange={(e) => handleChange("moduleTitle", e.target.value)}
              className={formErrors.moduleTitle ? "invalid" : ""}
            />
          </div>
          <div className="w-full mt-2 pr-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              required
              type="moduleDescription"
              value={formData.moduleDescription}
              onChange={(e) =>
                handleChange("moduleDescription", e.target.value)
              }
              className={formErrors.moduleDescription ? "invalid" : ""}
            />
          </div>
          <div className="w-full mt-2 pr-4">
            <Label htmlFor="learningoutcome1" className="text-right">
              Learning Outcome
            </Label>
            <Input
              required
              type="learningOutcome1"
              value={formData.learnOutcome1}
              onChange={(e) => handleChange("learnOutcome1", e.target.value)}
              className={formErrors.learnOutcome1 ? "invalid" : ""}
            />
          </div>
          <Card className="mt-2">
            <CardContent>
              <Label>Upload Video</Label>
              <FileUpload
                apiEndpoint="video"
                value={formData.videoModule}
                onChange={(url) => handleChange("videoModule", url)}
                className={`${
                  formData.videoModule ? "invalid" : ""
                } items-right`}
              />
            </CardContent>
          </Card>
          <Card className="mt-2">
            <CardContent>
              <Label>Module Image (Module Cover Page)</Label>
              <FileUpload
                apiEndpoint="moduleImage"
                value={formData.imageModule}
                onChange={(url) => handleChange("imageModule", url)}
                className={`${
                  formData.imageModule ? "invalid" : ""
                } items-right`}
              />
            </CardContent>
          </Card>

          <DialogFooter className="mt-4">
            <div className="flex justify-center w-full">
              <Button className="w-full" onClick={handleSubmit}>
                {isLoading ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircledIcon className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Adding module.." : "Submit"}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
