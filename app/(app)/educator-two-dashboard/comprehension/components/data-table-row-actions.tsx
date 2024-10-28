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
  question: string;
  Option1: string;
  Option2: string;
  Option3: string;
  CorrectAnswers: string;
  moduleId: string;
  grade: Grade;
  image: string;
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

const ComprehensionTestSchema = z.object({
  question: z.string().min(1, "Question is required"),
  Option1: z.string().min(1, "Option 1 is required"),
  Option2: z.string().min(1, "Option 2 is required"),
  Option3: z.string().min(1, "Option 3 is required"),
  CorrectAnswers: z.string().min(1, "Correct answer is required"),
  moduleId: z.string().min(1, "Module ID is required"),
  grade: z.nativeEnum(Grade),
  image: z.string().optional(),
});

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [formData, setFormData] = useState<FormData>({
    question: row.original.question || "",
    Option1: row.original.Option1 || "",
    Option2: row.original.Option2 || "",
    Option3: row.original.Option3 || "",
    CorrectAnswers: row.original.CorrectAnswers || "",
    moduleId: row.original.moduleId || "",
    grade: row.original.grade || Grade.GradeOne,
    image: row.original.image || "",
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch("/api/dropbox-modules");
        if (response.ok) {
          const data = await response.json();
          setFilteredModules(data.modules);

          // Set a default moduleId if none exists for new comprehension creation
          if (!formData.moduleId && data.modules.length > 0) {
            const defaultModuleId = data.modules[0].id;
            setFormData((prevState) => ({
              ...prevState,
              moduleId: defaultModuleId,
            }));
            setSelectedModuleId(defaultModuleId);
          }
        } else {
          console.error("Failed to fetch modules");
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
    fetchModules();
  }, []);

  useEffect(() => {
    if (formData.moduleId) {
      setSelectedModuleId(formData.moduleId);
    }
  }, [formData.moduleId]);

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
      ComprehensionTestSchema.parse(formData);

      const response = await fetch("/api/edit-comprehension", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.original.id, ...formData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update comprehension test");
      }
      toast.success("Comprehension Test updated successfully.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update comprehension test");
      console.error("Error updating comprehension test:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/edit-comprehension", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.original.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete comprehension test");
      }
      toast.success("Comprehension Test deleted successfully.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete comprehension test");
      console.error("Error deleting comprehension test:", error);
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
          <Button className="sr-only">Edit Comprehension Test</Button>
        </DialogTrigger>
        <form onSubmit={handleSubmit}>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Edit Comprehension Test</DialogTitle>
              <DialogDescription>
                Modify the details of the comprehension test as needed.
              </DialogDescription>
            </DialogHeader>
            <Card>
              <div className="w-full pl-4 pr-4">
                <Label htmlFor="question">Comprehension Test</Label>
                <Input
                  id="question"
                  required
                  value={formData.question}
                  onChange={(e) => handleChange("question", e.target.value)}
                  className={formErrors.question ? "invalid" : ""}
                />
              </div>
              <CardContent>
                <div className="flex mt-6">
                  <div className="w-auto pl-4">
                    <Label htmlFor="Option1">Option 1</Label>
                    <Input
                      id="Option1"
                      required
                      value={formData.Option1}
                      onChange={(e) => handleChange("Option1", e.target.value)}
                      className={formErrors.Option1 ? "invalid" : ""}
                    />
                  </div>
                  <div className="w-auto pl-4">
                    <Label htmlFor="Option2">Option 2</Label>
                    <Input
                      id="Option2"
                      required
                      value={formData.Option2}
                      onChange={(e) => handleChange("Option2", e.target.value)}
                      className={formErrors.Option2 ? "invalid" : ""}
                    />
                  </div>
                  <div className="w-auto pl-4 pr-4">
                    <Label htmlFor="Option3">Option 3</Label>
                    <Input
                      id="Option3"
                      required
                      value={formData.Option3}
                      onChange={(e) => handleChange("Option3", e.target.value)}
                      className={formErrors.Option3 ? "invalid" : ""}
                    />
                  </div>
                </div>
                <div className="w-1/2 mt-2 pl-4 pr-4">
                  <Label>Select Correct Answer</Label>
                  <Select
                    onValueChange={(value: string) =>
                      handleChange("CorrectAnswers", value)
                    }
                    value={formData.CorrectAnswers}
                  >
                    <SelectTrigger
                      id="correctAnswer"
                      aria-label="Select correct answer"
                    >
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        formData.Option1,
                        formData.Option2,
                        formData.Option3,
                      ].map(
                        (answer, index) =>
                          answer && (
                            <SelectItem key={index} value={answer}>
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
                          (module) => module.id === selectedModuleId
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
                  value={formData.image}
                  onChange={(url) => url && handleChange("image", url)}
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
          <Button className="sr-only">Delete Comprehension Test</Button>
        </DialogTrigger>
        <DialogContent className="md:max-w-md sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comprehension test?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button className="ml-2" onClick={handleDelete}>
              {isLoading ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <TrashIcon className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
