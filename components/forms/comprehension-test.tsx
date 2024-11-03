"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { useSession as useNextAuthSession } from "next-auth/react";
import { Grade } from "@prisma/client";
import { Button } from "@/components/ui/button";
import FileUpload from "./file-upload";
import { z } from "zod";
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

const VoiceExerciseSchema = z.object({
  image: z.string(),
  question: z.string(),
  Option1: z.string(),
  Option2: z.string(),
  Option3: z.string(),
  voiceId: z.string(),
  CorrectAnswers: z.string(),
  grade: z.string(),
});

interface VoiceExcercises {
  id: string;
  voice: string;
  grade: string;
}

export default function ComprehensionTest() {
  const { data: session } = useNextAuthSession();
  const userId = (session?.user as User)?.id;
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [voice, setVoice] = useState<VoiceExcercises[]>([]);
  const [filteredVoice, setFilteredVoice] = useState<VoiceExcercises[]>([]);
  const [comprehension, setComprehension] = useState<any[]>([
    {
      image: "",
      question: "",
      Option1: "",
      Option2: "",
      Option3: "",
      CorrectAnswers: "",
      voiceId: "",
      grade: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof voice, boolean>>
  >({});
  useEffect(() => {
    // Fetch modules when grade changes
    const fetchVoice = async () => {
      try {
        const response = await fetch(
          `/api/dropbox-voice?grade=${selectedGrade}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVoice(data.voice);
      } catch (error) {
        console.error("Failed to fetch voice exercises:", error);
      }
    };

    if (selectedGrade) {
      fetchVoice();
    }
  }, [selectedGrade]);

  useEffect(() => {
    // Filter modules based on selected grade
    setFilteredVoice(voice.filter((v) => v.grade === selectedGrade));
  }, [voice, selectedGrade]);

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setComprehension((prevQuestions) =>
      prevQuestions.map((q) => ({ ...q, voiceId: "", grade: value }))
    );
  };

  const handleChange = (
    index: number,
    key: keyof (typeof comprehension)[0],
    value: string
  ) => {
    setComprehension((prevQuestions) => {
      const updatedComprehension = [...prevQuestions];
      updatedComprehension[index] = {
        ...updatedComprehension[index],
        [key]: value,
      };
      return updatedComprehension;
    });
  };

  const addNewQuestion = () => {
    setComprehension([
      ...comprehension,
      {
        image: "",
        question: "",
        Option1: "",
        Option2: "",
        Option3: "",
        CorrectAnswers: "",
        voiceId: selectedVoiceId,
        grade: selectedGrade,
      },
    ]);
  };
  const handleSelectChange = (value: string, index: number) => {
    const selectedVoice = filteredVoice.find(
      (VoiceExercises) => VoiceExercises.voice === value
    );
    if (selectedVoice) {
      setComprehension((prevQuestions) => {
        const updatedComprehension = [...prevQuestions];
        updatedComprehension[index].voiceId = selectedVoice.id; // Update for the specific question
        return updatedComprehension;
      });

      setSelectedVoiceId(selectedVoice.id);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!userId) {
        throw new Error("User ID is not available. Please log in again.");
      }

      const dataToSend = comprehension.map((q) => ({ ...q, userId }));
      const invalidQuestions = dataToSend.filter((q) => !q.voiceId);
      if (invalidQuestions.length > 0) {
        throw new Error("Some voice IDs are invalid.");
      }

      console.log("Data to send:", dataToSend); // Debug log

      // Validate each question
      dataToSend.forEach((q) => {
        VoiceExerciseSchema.parse(q); // This will throw if validation fails
      });

      const response = await fetch("/api/create-comprehension", {
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
        throw new Error(
          errorData.message || "Failed to create comprehension test"
        );
      }

      // Reset form
      setComprehension([
        {
          image: "",
          question: "",
          Option1: "",
          Option2: "",
          Option3: "",
          CorrectAnswers: "",
          voiceId: "",
          grade: "",
        },
      ]);

      setSelectedGrade("");
      setSelectedVoiceId("");
      setFormErrors({});
      toast.success("Comprehension Test added successfully.");
      window.location.reload();
    } catch (error) {
      const err = error as Error;
      console.error(err);
      toast.error(
        err.message ||
          "Comprehension Test could not be added. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleRemoveQuestion = (index: number) => {
    setComprehension((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          <PlusCircleIcon className="pr-2" /> Create Comprehension Test
        </Button>
      </DialogTrigger>
      <form onSubmit={handleSubmit}>
        <DialogContent className="sm:max-w-[650px] max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Comprehension Test</DialogTitle>
            <DialogDescription>
              Fill all the required fields to create new comprehension test.
            </DialogDescription>
          </DialogHeader>
          {comprehension.map((comprehensions, index) => (
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
                    Comprehension Question
                  </Label>
                  <Input
                    id={`question-${index}`}
                    value={comprehensions.question}
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
                        value={comprehensions.Option1}
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
                        value={comprehensions.Option2}
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
                        value={comprehensions.Option3}
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
                      value={comprehensions.CorrectAnswers}
                    >
                      <SelectTrigger
                        id={`correctAnswer-${index}`}
                        aria-label="Select correct answer"
                      >
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          comprehensions.Option1,
                          comprehensions.Option2,
                          comprehensions.Option3,
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
                      <Label>Select Voice Exercises</Label>
                      <Select
                        onValueChange={(value: string) =>
                          handleSelectChange(value, index)
                        } // Pass index here
                        value={
                          comprehensions.voiceId
                            ? filteredVoice.find(
                                (voice) => voice.id === comprehensions.voiceId
                              )?.voice
                            : ""
                        } // Set selected value
                      >
                        <SelectTrigger
                          id={`voice-${index}`}
                          aria-label="Select voice exercises"
                        >
                          <SelectValue placeholder="Select voice exercises" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredVoice.map((voice) => (
                            <SelectItem key={voice.id} value={voice.voice}>
                              {voice.voice}
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
                    value={comprehensions.image}
                    onChange={(url) => handleChange(index, "image", url || "")}
                    className={comprehensions.image ? "invalid" : "items-right"}
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
