"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import FileUpload from "./file-upload";
import "@uploadthing/react/styles.css";
import { PlusCircleIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Grade } from "@prisma/client";

interface Module {
  id: string;
  moduleTitle: string;
}

export function CreateQuestions() {
  const [grade, setGrade] = useState("");
  const [module, setModules] = useState("");
  const [description, setDescription] = useState("");
  const [LearningOutcome1, setLearningOutcome1] = useState("");
  const [LearningOutcome2, setLearningOutcome2] = useState("");
  const [LearningOutcome3, setLearningOutcome3] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/dropbox-modules") // replace with your API route
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setModules(data.module))
      .catch((error) => console.error("Failed to fetch tenants:", error));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation
    if (
      !grade ||
      !module ||
      !description ||
      !LearningOutcome1 ||
      !LearningOutcome2 ||
      !LearningOutcome3
    ) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const res = await fetch("/api/create-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grade,
          module,
          description,
          LearningOutcome1,
          LearningOutcome2,
          LearningOutcome3,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Questions added successfully");
      window.location.reload();

      setGrade("");
      setModules("");
      setDescription("");
      setLearningOutcome1("");
      setLearningOutcome2("");
      setLearningOutcome3("");
    } catch (error: any) {
      // Registration failed
      toast.error(
        error.message || "An error occurred while processing your request"
      );
    }
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          {" "}
          <PlusCircleIcon className="pr-2" /> Create Question
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-auto flex flex-col">
        <DrawerHeader className="sm:max-w-auto flex flex-col items-center justify-center text-center">
          <DrawerTitle>Question Details</DrawerTitle>
          <DrawerDescription>
            Fill all the required fields to add a new questions.
          </DrawerDescription>
        </DrawerHeader>
        <div className="mx-auto w-full">
          <Card className="w-full">
            <CardContent className="mx-auto w-full max-w-sm">
              <div className="flex">
                <div className="w-full mt-2 pr-4">
                  <Label>Select Grade Level</Label>
                  <Select onValueChange={(value) => setGrade(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Grade.GradeOne}>Grade 1</SelectItem>
                      <SelectItem value={Grade.GradeTwo}>Grade 2</SelectItem>
                      <SelectItem value={Grade.GradeThree}>Grade 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex">
                <div className="w-full mt-2 pr-4">
                  <Label>Select Module</Label>
                  <Select onValueChange={(value) => setGrade(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Module" />
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
                  id="moduletitle"
                  type="text"
                  required
                  placeholder=""
                  value={module}
                  onChange={(e) => setModules(e.target.value)}
                />
              </div>
              <div></div>
              <div className="w-full mt-2 pr-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  type="text"
                  required
                  placeholder=""
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="w-full mt-2 pr-4">
                <Label htmlFor="learningoutcome1" className="text-right">
                  Learning Outcome
                </Label>
                <Input
                  id="learningoutcome1"
                  type="text"
                  required
                  placeholder=""
                  value={LearningOutcome1}
                  onChange={(e) => setLearningOutcome1(e.target.value)}
                />
              </div>

              <div className="flex"></div>
            </CardContent>
          </Card>
        </div>

        <DrawerFooter className="mt-4">
          <div className="flex justify-center w-full">
            <Button className="w-1/4 mb-8" onClick={onSubmit}>
              {isLoading ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircledIcon className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Adding questions.." : "Submit"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
