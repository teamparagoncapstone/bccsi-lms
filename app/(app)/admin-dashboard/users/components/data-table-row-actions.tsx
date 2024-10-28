"use client";
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
import {
  CheckCircledIcon,
  ReloadIcon,
  TrashIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  image: string;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData & { id: string; [key: string]: any }>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: row.original.name || "",
    username: row.original.username || "",
    email: row.original.email || "",
    password: "",
    role: row.original.role || "",
    image: row.original.image || "",
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/edit-user`, {
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
        throw new Error(errorText || "Failed to update user");
      }

      const result = await response.json();
      toast.success("User updated successfully.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/edit-user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: row.original.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(errorText || "Failed to delete user");
      }

      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete user");
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
          <DropdownMenuItem onClick={() => setIsDeleteConfirmOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/*Edit*/}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] flex flex-col">
          <DialogHeader className="flex flex-col items-center justify-center text-center">
            <DialogTitle>Update User Details</DialogTitle>
            <DialogDescription>
              Fill all the required fields to edit the user details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Card>
              <CardContent>
                <div className="flex">
                  <div className="w-1/2 pr-4 mt-2">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={formErrors.name ? "invalid" : ""}
                    />
                  </div>
                  <div className="w-1/2 mt-2 pr-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      required
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      className={formErrors.username ? "invalid" : ""}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/2 mt-2 pr-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={formErrors.email ? "invalid" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-red-600 text-sm">
                        *Invalid email format
                      </p>
                    )}
                  </div>
                  <div className="w-1/2 mt-2 pr-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={passwordVisible ? "text" : "password"}
                        value={formData.password}
                        placeholder="Leave blank to keep current"
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        className={formErrors.password ? "invalid" : ""}
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
                    {formErrors.password && (
                      <p className="text-red-600 text-sm">
                        *Password must be strong.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/2 mt-2 pr-4">
                    <Label>Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrator">
                          Administrator
                        </SelectItem>
                        <SelectItem value="Principal">Principal</SelectItem>
                        <SelectItem value="Registart">Registart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-2">
            <CardContent>
              <Label>User Image</Label>
              <FileUpload
                apiEndpoint="userImage"
                value={formData.image}
                onChange={(url) => url && handleChange("image", url)}
                className={`${formData.image ? "invalid" : ""} items-right`}
              />
            </CardContent>
          </Card>
          <DialogFooter className="mt-4">
            <div className="flex justify-center w-full">
              <Button
                className="w-1/4"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircledIcon className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Updating..." : "Submit"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*Delete*/}

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogTrigger asChild>
          <Button className="sr-only">Delete User</Button>
        </DialogTrigger>
        <DialogContent className="md:max-w-md sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user?
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
