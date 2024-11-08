"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  CheckCircledIcon,
  ReloadIcon,
  TrashIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";

enum Grade {
  GradeOne = "GradeOne",
  GradeTwo = "GradeTwo",
  GradeThree = "GradeThree",
}

enum Gender {
  Male = "Male",
  Female = "Female",
}

interface FormData {
  lrnNo: string;
  firstname: string;
  lastname: string;
  middlename: string;
  studentUsername: string;
  studentPassword: string;
  sex: Gender;
  bdate: string;
  age: string;
  grade: string;
  gname: string;
  image: string;
}

const gradeMap: { [key: string]: Grade } = {
  "Grade 1": Grade.GradeOne,
  "Grade 2": Grade.GradeTwo,
  "Grade 3": Grade.GradeThree,
};

interface DataTableRowActionsProps<TData> {
  row: Row<TData & { id: string; [key: string]: any }>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    lrnNo: row.original.lrnNo || "",
    firstname: row.original.firstname || "",
    lastname: row.original.lastname || "",
    middlename: row.original.middlename || "",
    studentUsername: row.original.studentUsername || "",
    studentPassword: "",
    sex: row.original.sex || Gender.Male,
    bdate: row.original.bdate || "",
    age: row.original.age || "",
    grade:
      Object.keys(gradeMap).find(
        (key) => gradeMap[key] === row.original.grade
      ) || row.original.grade, // Update here
    gname: row.original.gname || "",
    image: row.original.image || "",
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const gradeEnumValue = gradeMap[formData.grade]; // Convert to enum

      const response = await fetch(`/api/edit-students`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: row.original.id,
          ...formData,
          grade: gradeEnumValue, // Use the converted enum value
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(errorText || "Failed to update student");
      }

      toast.success("Student updated successfully.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update student");
      console.error("Error updating student:", error);
    } finally {
      setIsLoading(false);
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/edit-students`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: row.original.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(errorText || "Failed to delete student");
      }

      toast.success("Student deleted successfully.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete student");
      console.error("Error deleting student:", error);
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
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsViewDialogOpen(true)}>
            View
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => setIsDeleteConfirmOpen(true)}>
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      {/*Edit*/}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] flex flex-col">
          <DialogHeader className="sm:max-w-[600px] flex flex-col items-center justify-center text-center">
            <DialogTitle>Update Student Details</DialogTitle>
            <DialogDescription>
              Fill all the required fields to edit the student details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Card>
              <CardContent>
                <div className="flex flex-wrap">
                  <div className="w-1/2 pr-4 mt-2">
                    <Label htmlFor="lrn" className="text-right">
                      LRN
                    </Label>
                    <Input
                      required
                      value={formData.lrnNo}
                      onChange={(e) => handleChange("lrnNo", e.target.value)}
                      className={formErrors.lrnNo ? "invalid" : ""}
                    />
                  </div>
                  <div className="w-1/2 mt-2 pr-4">
                    <Label htmlFor="fname" className="text-right">
                      First Name
                    </Label>
                    <Input
                      required
                      value={formData.firstname}
                      onChange={(e) =>
                        handleChange("firstname", e.target.value)
                      }
                      className={formErrors.firstname ? "invalid" : ""}
                    />
                  </div>
                  <div className="w-1/2 mt-2 pr-4">
                    <Label htmlFor="lname" className="text-right">
                      Last Name
                    </Label>
                    <Input
                      required
                      value={formData.lastname}
                      onChange={(e) => handleChange("lastname", e.target.value)}
                      className={formErrors.lastname ? "invalid" : ""}
                    />
                  </div>
                  <div className="w-1/4 mt-2 pr-4">
                    <Label htmlFor="mname" className="text-right">
                      M.I.
                    </Label>
                    <Input
                      required
                      value={formData.middlename}
                      onChange={(e) =>
                        handleChange("middlename", e.target.value)
                      }
                      className={formErrors.middlename ? "invalid" : ""}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-1/2 mt-2 pr-4">
                    <Label>Sex</Label>
                    <Select
                      onValueChange={(value) => handleChange("sex", value)}
                      value={formData.sex}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/2 mt-2 pr-4">
                    <Label htmlFor="birthdate" className="text-right">
                      Birth Date
                    </Label>
                    <Input
                      required
                      type="date"
                      value={formData.bdate}
                      onChange={(e) => handleChange("bdate", e.target.value)}
                      className={formErrors.bdate ? "invalid" : ""}
                      min="1900-01-01"
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="w-1/2 mt-2 pr-4">
                    <Label htmlFor="age" className="text-right">
                      Age
                    </Label>
                    <Input
                      type="number"
                      value={formData.age}
                      readOnly
                      className={formErrors.age ? "invalid" : ""}
                    />
                  </div>
                </div>
                {/* <div className="flex flex-wrap">
                  <div className="w-1/2 mt-2 pr-4">
                    <Label>Select Grade Level</Label>
                    <Select
                      onValueChange={(value) => handleChange("grade", value)}
                      value={formData.grade}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grade 1">Grade 1</SelectItem>
                        <SelectItem value="Grade 2">Grade 2</SelectItem>
                        <SelectItem value="Grade 3">Grade 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div> */}
                <div className="flex flex-wrap">
                  <div className="w-1/2 mt-2 pr-4">
                    <Label htmlFor="gname" className="text-right">
                      Guardian Name
                    </Label>
                    <Input
                      required
                      value={formData.gname}
                      onChange={(e) => handleChange("gname", e.target.value)}
                      className={formErrors.gname ? "invalid" : ""}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-1/2 mt-2 pr-4">
                    <Label htmlFor="susername" className="text-right">
                      Username
                    </Label>
                    <Input
                      required
                      value={formData.studentUsername}
                      onChange={(e) =>
                        handleChange("studentUsername", e.target.value)
                      }
                      className={formErrors.studentUsername ? "invalid" : ""}
                    />
                  </div>
                  <div className="w-1/2 mt-2 pr-4">
                    <Label htmlFor="spassword" className="text-right">
                      Student Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={passwordVisible ? "text" : "password"}
                        value={formData.studentPassword || ""} // Allow empty value
                        placeholder="Leave blank to keep current"
                        onChange={(e) =>
                          handleChange("studentPassword", e.target.value)
                        }
                        className={formErrors.studentPassword ? "invalid" : ""}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {passwordVisible ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {formErrors.studentPassword && (
                      <p className="text-red-600 text-sm">
                        *Password must be strong.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-2">
              <CardContent>
                <Label>Student Image</Label>
                <FileUpload
                  apiEndpoint="studentImage"
                  value={formData.image}
                  onChange={(url) => handleChange("image", url)} // Update image URL
                  className={formData.image ? "invalid" : "items-right"}
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
                  {isLoading ? "Updating student.." : "Submit"}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/*View*/}

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] flex flex-col">
          <DialogHeader className="sm:max-w-[600px] flex flex-col items-center justify-center text-center">
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Here are the details of the selected student.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex">
              <div className="w-1/3 pr-4">
                <Image
                  src={formData.image}
                  alt="Student Image"
                  className="w-full h-auto border rounded-lg"
                />
              </div>
              <div className="w-2/3">
                <Card>
                  <CardContent>
                    <div className="flex flex-col ">
                      <div className="flex flex-col mb-4">
                        <Label className="text-xl font-black">
                          Student Information
                        </Label>
                        <div className="mt-2 ">
                          <Label className="font-extrabold">LRN</Label>
                          <p>{formData.lrnNo}</p>
                        </div>
                        <div className="mt-2">
                          <Label className="font-extrabold">First Name</Label>
                          <p>{formData.firstname}</p>
                        </div>
                        <div className="mt-2">
                          <Label className="font-extrabold">Last Name</Label>
                          <p>{formData.lastname}</p>
                        </div>
                        <div className="mt-2">
                          <Label className="font-extrabold">M.I.</Label>
                          <p>{formData.middlename}</p>
                        </div>
                        <div className="mt-2">
                          <Label className="font-extrabold">Gender</Label>
                          <p>{formData.sex}</p>
                        </div>
                        <div className="mt-2">
                          <Label className="font-extrabold">Birth Date</Label>
                          <p>{formData.bdate}</p>
                        </div>
                        <div className="mt-2">
                          <Label className="font-extrabold">Age</Label>
                          <p>{formData.age}</p>
                        </div>
                        <div className="mt-2">
                          <Label className="font-extrabold">Grade</Label>
                          <p>
                            {Object.keys(gradeMap).find(
                              (key) => gradeMap[key] === formData.grade
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col mb-4">
                        <Label className="text-xl font-bold">
                          Guardian Information
                        </Label>
                        <div className="mt-2">
                          <Label className="font-extrabold">
                            Guardian Name
                          </Label>
                          <p>{formData.gname}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*Delete*/}

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogTrigger asChild>
          <Button className="sr-only">Delete Module</Button>
        </DialogTrigger>
        <DialogContent className="md:max-w-md sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this student?
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
