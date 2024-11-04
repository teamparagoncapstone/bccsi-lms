"use client";
import React from "react";
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

const voiceExercisesSchema = z.object({
  voiceImage: z.string(),
  voice: z.string(),
  moduleId: z.string(),
  grade: z.string(),
});
export function VoiceExercises() {
  const { data: session } = useNextAuthSession();
  const userId = (session?.user as User)?.id;
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [voice, setVoice] = useState<any[]>([
    { voice: "", voiceImage: "", moduleId: "", grade: "" },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(
          `/api/dropbox-reading?grade=${selectedGrade}`
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
    setFilteredModules(
      modules.filter((module) => module.grade === selectedGrade)
    );
  }, [modules, selectedGrade]);

  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setVoice((prevVoice) =>
      prevVoice.map((q) => ({ ...q, moduleId: "", grade: value }))
    );
  };

  const handleChange = (
    index: number,
    key: keyof (typeof voice)[0],
    value: string
  ) => {
    setVoice((prevVoice) => {
      const updatedVoice = [...prevVoice];
      updatedVoice[index] = { ...updatedVoice[index], [key]: value };
      return updatedVoice;
    });
  };

  const addNewVoice = () => {
    setVoice([
      ...voice,
      {
        voiceImage: "",
        voice: "",
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
      setVoice((prevVoice) => {
        const updatedVoice = [...prevVoice];
        updatedVoice[index].moduleId = selectedModule.id;
        return updatedVoice;
      });
      setSelectedModuleId(selectedModule.id);
    }
  };
  const handleRemoveVoice = (index: number) => {
    setVoice((prevVoice) => prevVoice.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!userId) {
        throw new Error("User ID is not availavle. Please log in again.");
      }

      const dataToSend = voice.map((q) => ({ ...q, userId }));
      const invalidVoice = dataToSend.filter((q) => !q.moduleId);
      if (invalidVoice.length > 0) {
        throw new Error("Some module IDs ara invalid");
      }

      dataToSend.forEach((q) => {
        voiceExercisesSchema.parse(q);
      });

      const response = await fetch("/api/create-voice", {
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
        throw new Error(errorData.message || "Failed to create voice");
      }

      setVoice([
        {
          voiceImage: "",
          voice: "",
          moduleId: "",
          grade: "",
        },
      ]);
      toast.success("Voice exercises added successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setSelectedGrade("");
    } catch (error) {
      const err = error as Error;
      console.error(err);
      toast.error(
        err.message || "Voice exercises could not be added. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="bg-transparent">
          <PlusCircleIcon className="pr-2" /> Create Voice Exercises
        </Button>
      </DialogTrigger>
      <form>
        <DialogContent className="sm:max-w-[650px] max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Voice Excercises</DialogTitle>
            <DialogDescription>
              Fill all the required fields to create voice exercises.
            </DialogDescription>
          </DialogHeader>
          {voice.map((voices, index) => (
            <div key={index} className="flex flex-col relative">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVoice(index)} // Call remove function
                  className="absolute top-2 right-2"
                >
                  <XIcon className="h-5 w-5 text-blue-500" />
                </button>
              )}
              <Card>
                <div className="w-full pl-4 pr-4">
                  <Label htmlFor={`voices-${index}`} className="text-right">
                    Voices Exercises
                  </Label>
                  <Input
                    id={`voice-${index}`}
                    value={voices.voice}
                    onChange={(e) =>
                      handleChange(index, "voice", e.target.value)
                    }
                    required
                  />
                </div>
                <CardContent>
                  <div className="w-auto pl4">
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
                            voices.moduleId
                              ? filteredModules.find(
                                  (module) => module.id === voices.moduleId
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
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-2">
                <CardContent>
                  <Label>
                    {" "}
                    Upload Image{" "}
                    <p className="text-sm text-gray-400 my-3">
                      {" "}
                      (Optional: You can choose to display an image.)
                    </p>
                  </Label>
                  <FileUpload
                    apiEndpoint="moduleImage"
                    value={voices.voiceImage}
                    onChange={(url) =>
                      handleChange(index, "voiceImage", url || "")
                    } // Update image URL
                    className={voices.image ? "invalid" : "items-right"}
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
              {/* <Button type="button" onClick={addNewVoice} className="">Add Another Voice</Button> */}
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
