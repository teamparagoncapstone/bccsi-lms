"use client";
import * as React from "react";
import { useState, useEffect } from "react";
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
import { CheckCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { useSession as useNextAuthSession } from "next-auth/react";
import { Grade } from "@prisma/client";
import { z } from "zod";
import FileUpload from "./file-upload";
import { PlusCircleIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Card, CardContent } from "../ui/card";
import { XIcon } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

interface Module {
  id: string;
  moduleTitle: string;
  grade: string;
}

const questionSchema = z.object({
  image: z.string(),
  question: z.string(),
  Option1: z.string(),
  Option2: z.string(),
  Option3: z.string(),
  moduleId: z.string(),
  CorrectAnswers: z.string(),
  grade: z.string(),
});

export function AddNewQuestions() {
  const { data: session } = useNextAuthSession();
  const userId = (session?.user as User)?.id;
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<any[]>([
    {
      image: "",
      question: "",
      Option1: "",
      Option2: "",
      Option3: "",
      CorrectAnswers: "",
      moduleId: "",
      grade: "",
    },
  ]);

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof questions, boolean>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch modules when grade changes
    const fetchModules = async () => {
      try {
        const response = await fetch(
          `/api/dropbox-modules?grade=${selectedGrade}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setModules(data.modules);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
      }
    };

    if (selectedGrade) {
      fetchModules();
    }
  }, [selectedGrade]);

  useEffect(() => {
    // Filter modules based on selected grade
    setFilteredModules(
      modules.filter((module) => module.grade === selectedGrade)
    );
  }, [modules, selectedGrade]);

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => ({ ...q, moduleId: "", grade: value }))
    );
  };

  const handleChange = (
    index: number,
    key: keyof (typeof questions)[0],
    value: string
  ) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = { ...updatedQuestions[index], [key]: value };
      return updatedQuestions;
    });
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        image: "",
        question: "",
        Option1: "",
        Option2: "",
        Option3: "",
        CorrectAnswers: "",
        moduleId: selectedModuleId,
        grade: selectedGrade,
      },
    ]);
  };
  const handleSelectChange = (value: string, index: number) => {
    const selectedModule = filteredModules.find(
      (module) => module.moduleTitle === value
    );
    if (selectedModule) {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[index].moduleId = selectedModule.id; // Update for the specific question
        return updatedQuestions;
      });

      setSelectedModuleId(selectedModule.id);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!userId) {
        throw new Error("User ID is not available. Please log in again.");
      }

      const dataToSend = questions.map((q) => ({ ...q, userId }));
      const invalidQuestions = dataToSend.filter((q) => !q.moduleId);
      if (invalidQuestions.length > 0) {
        throw new Error("Some module IDs are invalid.");
      }

      console.log("Data to send:", dataToSend); // Debug log

      // Validate each question
      dataToSend.forEach((q) => {
        questionSchema.parse(q); // This will throw if validation fails
      });

      const response = await fetch("/api/create-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            (session as { accessToken: string })?.accessToken
          }`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || "Failed to create question");
      }

      // Reset form
      setQuestions([
        {
          image: "",
          question: "",
          Option1: "",
          Option2: "",
          Option3: "",
          CorrectAnswers: "",
          moduleId: "",
          grade: "",
        },
      ]);

      setSelectedGrade("");
      setSelectedModuleId("");
      setFormErrors({});
      toast.success("Questions added successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      const err = error as Error;
      console.error(err);
      toast.error(
        err.message || "Questions could not be added. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleRemoveQuestion = (index: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          <PlusCircleIcon className="pr-2" /> Create New Questions
        </Button>
      </DialogTrigger>
      <form onSubmit={handleSubmit}>
        <DialogContent className="sm:max-w-[650px] max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Question</DialogTitle>
            <DialogDescription>
              Fill all the required fields to create new questions.
            </DialogDescription>
          </DialogHeader>
          {questions.map((question, index) => (
            <div key={index} className="flex flex-col relative">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)} // Call remove function
                  className="absolute top-2 right-2"
                >
                  <XIcon className="h-5 w-5 text-blue-500" />
                </button>
              )}
              <Card>
                <div className="w-full pl-4 pr-4">
                  <Label htmlFor={`question-${index}`} className="text-right">
                    Question
                  </Label>
                  <Input
                    id={`question-${index}`}
                    value={question.question}
                    onChange={(e) =>
                      handleChange(index, "question", e.target.value)
                    }
                    required
                  />
                </div>
                <CardContent>
                  <div className="flex mt-6">
                    <div className="w-auto pl-4">
                      <Label
                        htmlFor={`Option1-${index}`}
                        className="text-right"
                      >
                        Option 1
                      </Label>
                      <Input
                        id={`Option1-${index}`}
                        value={question.Option1}
                        onChange={(e) =>
                          handleChange(index, "Option1", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="w-auto pl-4">
                      <Label
                        htmlFor={`Option2-${index}`}
                        className="text-right"
                      >
                        Option 2
                      </Label>
                      <Input
                        id={`Option2-${index}`}
                        value={question.Option2}
                        onChange={(e) =>
                          handleChange(index, "Option2", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="w-auto pl-4 pr-4">
                      <Label
                        htmlFor={`Option3-${index}`}
                        className="text-right"
                      >
                        Option 3
                      </Label>
                      <Input
                        id={`Option3-${index}`}
                        value={question.Option3}
                        onChange={(e) =>
                          handleChange(index, "Option3", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="w-1/2 mt-2 pl-4 pr-4">
                    <Label>Select Correct Answer</Label>
                    <Select
                      onValueChange={(value: string) =>
                        handleChange(index, "CorrectAnswers", value)
                      }
                      value={question.CorrectAnswers}
                    >
                      <SelectTrigger
                        id={`correctAnswer-${index}`}
                        aria-label="Select correct answer"
                      >
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          question.Option1,
                          question.Option2,
                          question.Option3,
                        ].map(
                          (answer, idx) =>
                            answer && (
                              <SelectItem key={idx} value={answer}>
                                {answer}
                              </SelectItem>
                            )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 mt-2 pl-4">
                      <Label>Select Grade</Label>
                      <Select
                        onValueChange={(value: string) =>
                          handleGradeChange(value)
                        }
                        value={selectedGrade}
                      >
                        <SelectTrigger id="grade" aria-label="Select grade">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Grade.GradeOne}>
                            Grade 1
                          </SelectItem>
                          <SelectItem value={Grade.GradeTwo}>
                            Grade 2
                          </SelectItem>
                          <SelectItem value={Grade.GradeThree}>
                            Grade 3
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-1/2 mt-2 pl-4 pr-4">
                      <Label>Select Module</Label>
                      <Select
                        onValueChange={(value: string) =>
                          handleSelectChange(value, index)
                        } // Pass index here
                        value={
                          question.moduleId
                            ? filteredModules.find(
                                (module) => module.id === question.moduleId
                              )?.moduleTitle
                            : ""
                        } // Set selected value
                      >
                        <SelectTrigger
                          id={`module-${index}`}
                          aria-label="Select module"
                        >
                          <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredModules.map((module) => (
                            <SelectItem
                              key={module.id}
                              value={module.moduleTitle}
                            >
                              {module.moduleTitle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="item-center justify-center flex flex-col">
                <CardContent>
                  <Label className="flex flex-col item-center pt-2">
                    Upload Image{" "}
                    <p className="text-sm text-gray-400 my-3">
                      {" "}
                      (Optional: You can choose to display an image.)
                    </p>
                  </Label>
                  <FileUpload
                    apiEndpoint="moduleImage"
                    value={question.image}
                    onChange={(url) => handleChange(index, "image", url || "")}
                    className={question.image ? "invalid" : "items-right"}
                  />
                </CardContent>
              </Card>
            </div>
          ))}
          <DialogFooter>
            <div className="flex justify-center w-full">
              <Button className="w-1/4 mr-6" onClick={handleSubmit}>
                {isLoading ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircledIcon className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Adding space..." : "Submit"}
              </Button>
              <Button type="button" onClick={addNewQuestion} className="">
                Add Another Question
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
