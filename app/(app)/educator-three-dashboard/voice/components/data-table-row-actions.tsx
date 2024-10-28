"use client";
import React, { useState, useEffect } from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/forms/file-upload";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircledIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { z } from "zod";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

enum Grade {
  GradeOne = "GradeOne",
  GradeTwo = "GradeTwo",
  GradeThree = "GradeThree",
}

interface Module {
  id: string;
  moduleTitle: string;
  grade: string;
}

interface FormData {
  voice: string;
  voiceImage: string;
  moduleId: string;
  grade: Grade;
}

interface DataTableRowActionsProps<TData> {
  row: Row<
    TData & {
      id: string;
      createdAt: Date;
      updatedAt: Date | null;
      [key: string]: any;
    }
  >;
}

const voiceExercisesSchema = z.object({
  voiceImage: z.string(),
  voice: z.string(),
  moduleId: z.string(),
  grade: z.string(),
});

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [formData, setFormData] = useState<FormData>({
    voice: row.original.voice || "",
    voiceImage: row.original.voiceImage || "",
    moduleId: row.original.moduleId || "",
    grade: row.original.grade || Grade.GradeOne,
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch("/api/dropbox-reading");
        if (response.ok) {
          const data = await response.json();
          setFilteredModules(data.modules);
        } else {
          console.error("Failed to fetch modules");
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, []);
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (value: string) => {
    const selectedModule = filteredModules.find(
      (module) => module.moduleTitle === value
    );
    if (selectedModule) {
      setSelectedModuleId(selectedModule.id);
      setFormData((prevState) => ({
        ...prevState,
        moduleId: selectedModule.id,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log("Form data before validation:", formData); // Log form data
      voiceExercisesSchema.parse(formData); // Validate form data

      const response = await fetch("/api/edit-voice", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: row.original.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(errorText || "Failed to update voice exercises");
      }
      const result = await response.json();
      toast.success("Voice Exercises updated successfully.");
      window.location.reload();
      console.log("Voice Exercises updated successfully:", result);
    } catch (error) {
      toast.error("Failed to update voice exercises");
      console.error("Error updating voice exercises:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/edit-voice", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: row.original.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(errorText || "Failed to delete voice exercises");
      }
      toast.success("Voice Exercises deleted successfully.");
      window.location.reload();
      console.log("Voice Exercises deleted successfully");
    } catch (error) {
      toast.error("Failed to delete voice exercises");
      console.error("Error deleting voice exercises:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteConfirmOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="sr-only">Edit Voice Exercises</Button>
        </DialogTrigger>
        <form onSubmit={handleSubmit}>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Edit Voice Exercises</DialogTitle>
              <DialogDescription>
                Modify the details of the voice exercises as needed.
              </DialogDescription>
            </DialogHeader>
            <Card>
              <div className="w-full pl-4 pr-4">
                <Label htmlFor="question" className="text-right">
                  Voice Exercises
                </Label>
                <Input
                  id="voice"
                  required
                  value={formData.voice}
                  onChange={(e) => handleChange("voice", e.target.value)}
                  className={formErrors.question ? "invalid" : ""}
                />
              </div>
              <CardContent>
                <div className="flex">
                  <div className="w-1/2 mt-2 pl-4">
                    <Label>Select Grade</Label>
                    <Select
                      onValueChange={(value: string) =>
                        handleChange("grade", value as Grade)
                      }
                      value={formData.grade}
                    >
                      <SelectTrigger id="grade" aria-label="Select grade">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Grade.GradeOne}>Grade 1</SelectItem>
                        <SelectItem value={Grade.GradeTwo}>Grade 2</SelectItem>
                        <SelectItem value={Grade.GradeThree}>
                          Grade 3
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/2 mt-2 pl-4 pr-4">
                    <Label>Select Module</Label>
                    <Select
                      onValueChange={handleSelectChange}
                      value={
                        filteredModules.find(
                          (module) => module.id === formData.moduleId
                        )?.moduleTitle || ""
                      }
                    >
                      <SelectTrigger id="module" aria-label="Select module">
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
                  Upload Image
                </Label>
                <FileUpload
                  apiEndpoint="moduleImage"
                  value={formData.voiceImage}
                  onChange={(url) => url && handleChange("voiceImage", url)}
                  className={`${
                    formErrors.image ? "invalid" : ""
                  } items-right pt-2`}
                />
              </CardContent>
            </Card>
            <DialogFooter>
              <div className="flex justify-center w-full">
                <Button className="w-1/4 mr-6" onClick={handleSubmit}>
                  {isLoading ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircledIcon className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Updating..." : "Submit"}
                </Button>
                <Button className="w-1/4" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogTrigger asChild>
          <Button className="sr-only">Delete Voice Exercises</Button>
        </DialogTrigger>
        <DialogContent className="md:max-w-md sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Voice Exercises?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className=""
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button className="ml-2" onClick={handleDelete}>
              {isLoading ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <TrashIcon className="mr-2 h-8 w-4" />
              )}
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
