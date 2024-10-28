import { FileIcon, X } from "lucide-react";
import React, { useRef } from "react";
import { Button } from "../ui/button";

interface FileUploadDropzoneProps {
  onDrop: (file: File) => void;
  value?: string; // Store the filename or URL
  onRemove: () => void; // Callback to remove the file
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onDrop,
  value,
  onRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onDrop(file); // Call onDrop with the selected file
    }
  };

  const handleRemove = () => {
    onRemove(); // Call the onRemove callback
    // Reset the file input so that the user can upload again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input value
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex flex-col items-center justify-center w-full border border-dashed p-4 rounded-md ${
          value ? "bg-gray-200" : "bg-transparent"
        }`}
      >
        {value ? (
          <div className="relative flex items-center p-2 mt-2 rounded-md">
            <FileIcon className="h-4 w-4" />
            <span className="ml-2 text-sm">{value}</span>
            <Button
              onClick={handleRemove} // Call onRemove function when the button is clicked
              variant="secondary"
              type="button"
              className="ml-2"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="text-gray-500">
            Drag & drop a file here, or click to select one
          </div>
        )}
      </div>
      <input
        type="file"
        accept=".pptx"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden" // Hide the default file input
      />
      <Button
        onClick={() => fileInputRef.current?.click()} // Trigger file input click
        variant="outline" // Use an existing variant
        className="mt-2"
      >
        Choose File
      </Button>
    </div>
  );
};

export default FileUploadDropzone;
