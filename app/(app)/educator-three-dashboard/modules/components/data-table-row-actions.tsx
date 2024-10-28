import React, { useState } from "react";
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
import { moduleSchema } from "../data/schema";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

enum Subject {
  Math = "Math",
  Reading = "Reading",
}

enum Grade {
  GradeOne = "GradeOne",
  GradeTwo = "GradeTwo",
  GradeThree = "GradeThree",
}

interface FormData {
  moduleTitle: string;
  moduleDescription: string;
  learnOutcome1: string;
  videoModule: string;
  imageModule: string;
  grade: Grade;
  subjects: Subject;
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

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    moduleTitle: row.original.moduleTitle || "",
    moduleDescription: row.original.moduleDescription || "",
    learnOutcome1: row.original.learnOutcome1 || "",
    videoModule: row.original.videoModule || "",
    imageModule: row.original.imageModule || "",
    grade: row.original.grade || Grade.GradeOne,
    subjects: row.original.subjects || Subject.Math,
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/edit-module`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: row.original.id,
          moduleTitle: formData.moduleTitle,
          moduleDescription: formData.moduleDescription,
          learnOutcome1: formData.learnOutcome1,
          videoModule: formData.videoModule,
          imageModule: formData.imageModule,
          grade: formData.grade,
          subjects: formData.subjects,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(errorText || "Failed to update module");
      }

      const result = await response.json();
      toast.success("Module updated successfully.");
      window.location.reload();
      console.log("Module updated successfully:", result);
    } catch (error) {
      toast.error("Failed to update module");
      console.error("Error updating module:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/edit-module`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: row.original.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(errorText || "Failed to delete module");
      }

      toast.success("Module deleted successfully.");
      window.location.reload();
      console.log("Module deleted successfully");
    } catch (error) {
      toast.error("Failed to delete module");
      console.error("Error deleting module:", error);
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
          <Button className="sr-only">Edit Module</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-auto flex flex-col">
          <DialogHeader className="sm:max-w-auto flex flex-col items-center justify-center text-center">
            <DialogTitle>Edit Module Details</DialogTitle>
            <DialogDescription>
              Modify the details of the module as needed.
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
              <Label htmlFor="moduleTitle" className="text-right">
                Module Title
              </Label>
              <Input
                required
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
                value={formData.moduleDescription}
                onChange={(e) =>
                  handleChange("moduleDescription", e.target.value)
                }
                className={formErrors.moduleDescription ? "invalid" : ""}
              />
            </div>
            <div className="w-full mt-2 pr-4">
              <Label htmlFor="learningOutcome1" className="text-right">
                Learning Outcome
              </Label>
              <Input
                required
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
                  className={formData.videoModule ? "invalid" : ""}
                />
              </CardContent>
            </Card>
            <Card className="mt-2">
              <CardContent>
                <Label>Module Image</Label>
                <FileUpload
                  apiEndpoint="studentImage"
                  value={formData.imageModule}
                  onChange={(url) => handleChange("imageModule", url)}
                  className={formData.imageModule ? "invalid" : ""}
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
                  {isLoading ? "Updating module.." : "Submit"}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogTrigger asChild>
          <Button className="sr-only">Delete Module</Button>
        </DialogTrigger>
        <DialogContent className="md:max-w-md sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this module?
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
