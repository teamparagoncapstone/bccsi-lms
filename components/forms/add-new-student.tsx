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
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import FileUpload from "./file-upload";
import "@uploadthing/react/styles.css";
import { PlusCircleIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Gender, Grade } from "@prisma/client";
import { z } from "zod";
import { useSession as useNextAuthSession } from "next-auth/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

const studentSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  middlename: z.string(),
  lrnNo: z
    .string()
    .length(12, "LRN must be exactly 12 digits.")
    .regex(/^\d{12}$/, "LRN must be numeric."),
  grade: z.string(),
  sex: z.string(),
  bdate: z.string(),
  age: z.string(),
  gname: z.string(),
  image: z.string(),
  studentUsername: z
    .string()
    .min(3, "Username must be at least 3 characters long."),
  studentPassword: z
    .string()
    .min(3, "Password must be at least 3 characters long."),
});

export function AddNewStudent() {
  const { data: session } = useNextAuthSession();
  const userId = (session?.user as User)?.id;
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    lrnNo: "",
    grade: "",
    sex: "",
    bdate: "",
    age: "",
    gname: "",
    image: "",
    studentUsername: "",
    studentPassword: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof formData, boolean>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() - 3);
  const formattedDate = currentDate.toISOString().split("T")[0];
  const minDate = "2000-01-01";
  const maxDate = formattedDate;
  const calculateAge = (birthdate: string): number => {
    const today = new Date();

    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleChange = (
    key: keyof typeof formData,
    value: string | number | Date | undefined
  ) => {
    if (value !== undefined) {
      const formattedValue =
        value instanceof Date ? value.toISOString() : value.toString();

      if (key === "lrnNo" && formattedValue.length > 12) {
        return;
      }

      setFormData((prevState) => {
        const updatedData = {
          ...prevState,
          [key]: formattedValue,
        };

        if (key === "bdate") {
          const age = calculateAge(formattedValue);
          return { ...updatedData, age: age.toString() };
        }
        return updatedData;
      });
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
    setFormErrors({});

    try {
      if (!userId) {
        throw new Error("User ID is not available. Please log in again.");
      }

      studentSchema.parse(formData);

      const payload = {
        lrnNo: formData.lrnNo,
        firstname: formData.firstname,
        lastname: formData.lastname,
        middlename: formData.middlename,
        grade: formData.grade,
        sex: formData.sex,
        bdate: formData.bdate,
        age: formData.age,
        gname: formData.gname,
        image: formData.image,
        studentUsername: formData.studentUsername,
        studentPassword: formData.studentPassword,
        userId: userId,
      };

      const response = await fetch("/api/create-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            (session as { accessToken: string })?.accessToken
          }`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Username already exists.") {
          setFormErrors({ studentUsername: true });
          toast.error("Username already exists.");
        } else {
          throw new Error(errorData.message || response.statusText);
        }
      }
      setFormData({
        firstname: "",
        lastname: "",
        middlename: "",
        lrnNo: "",
        grade: "",
        sex: "",
        bdate: "",
        age: "",
        gname: "",
        image: "",
        studentUsername: "",
        studentPassword: "",
      });

      toast.success("Student added successfully.");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      const err = error as Error;
      console.error(err);
      if (err instanceof z.ZodError) {
        const fieldErrors = err.errors.reduce((acc, error) => {
          acc[error.path[0] as keyof typeof formData] = true; // Mark fields as having errors
          return acc;
        }, {} as Partial<Record<keyof typeof formData, boolean>>);

        setFormErrors(fieldErrors);
      } else {
        console.error(err);
        toast.error(
          err.message || "Student could not be added. Please try again."
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
        <Button variant="outline">
          {" "}
          <PlusCircleIcon className="pr-2" /> Add New Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] flex flex-col">
        <DialogHeader className="sm:max-w-[600px] flex flex-col items-center justify-center text-center">
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>
            Fill all the required fields to add a new student.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Card>
            <CardContent>
              <div className="flex">
                <div className="w-1/2 pr-4 mt-2">
                  <Label htmlFor="lrn" className="text-right">
                    LRN
                  </Label>
                  <Input
                    required
                    type="text"
                    value={formData.lrnNo}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleChange("lrnNo", value);
                      }
                    }}
                    className={formErrors.lrnNo ? "invalid" : ""}
                  />
                  {formErrors.lrnNo && (
                    <p className="text-xs text-red-500">
                      {formErrors.lrnNo ? "LRN must be exactly 12 digits." : ""}
                    </p>
                  )}
                </div>
                <div className="w-1/2 mt-2 pr-4">
                  <Label htmlFor="fname" className="text-right">
                    First Name
                  </Label>
                  <Input
                    required
                    value={formData.firstname}
                    onChange={(e) => handleChange("firstname", e.target.value)}
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
                    onChange={(e) => handleChange("middlename", e.target.value)}
                    className={formErrors.middlename ? "invalid" : ""}
                  />
                </div>
              </div>
              <div className="flex">
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
                      <SelectItem value={Gender.Male}>Male</SelectItem>
                      <SelectItem value={Gender.Female}>Female</SelectItem>
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
                    min={minDate}
                    max={maxDate}
                    onKeyDown={(e) => e.preventDefault()} // Prevent typing
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
              <div className="flex">
                <div className="w-1/2 mt-2 pr-4">
                  <Label>Select Grade Level</Label>
                  <Select
                    onValueChange={(value) => handleChange("grade", value)}
                    value={formData.grade}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="" />
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
              <div className="flex">
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
                  {formErrors.studentUsername && (
                    <p className="text-xs text-red-500">
                      Username at least 3 characters long.
                    </p>
                  )}
                </div>
                <div className="w-1/2  relative">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <div className="flex items-center relative mt-2">
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      required
                      value={formData.studentPassword}
                      onChange={(e) =>
                        handleChange("studentPassword", e.target.value)
                      }
                      className={`flex-1 ${
                        formErrors.studentPassword ? "invalid" : ""
                      }`}
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
                    <p className="text-xs text-red-500 mt-1">
                      Password must be strong.
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
                {isLoading ? "Adding student.." : "Submit"}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
