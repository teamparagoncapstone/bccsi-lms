import { FileIcon, X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { UploadButton } from "@/lib/uploadthing";

type Props = {
  apiEndpoint: "image" | "studentImage" | "moduleImage" | "userImage" | "video";
  onChange: (url?: string) => void;
  value?: string;
  className?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value, className }: Props) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className={`flex ${className}`}>
        {type === "mp4" || type === "avi" || type === "mov" ? (
          <div className="relative w-auto h-auto">
            <video
              src={value}
              controls
              className="object-contain"
              width={200}
              height={200}
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md">
            <FileIcon className="h-4 w-4" />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm"
            >
              View File
            </a>
          </div>
        )}
        <Button
          onClick={() => onChange("")} // Change to empty string to signify removal
          variant="secondary"
          type="button"
        >
          <X className="h-4 w-4" />
          Remove file
        </Button>
      </div>
    );
  }

  return (
    <div className={`w-full items-center ${className}`}>
      <UploadButton
        appearance={{
          button:
            "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-r-none bg-blue-500 bg-none after:bg-blue-400 mb-2",
          container: "w-full h-15",
          allowedContent: "flex h-1.5 flex-col justify-center px-2 text-white",
        }}
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          if (res?.[0]?.url) {
            onChange(res[0].url);
          }
        }}
        onUploadError={(error: Error) => {
          console.log("Upload error:", error);
        }}
      />
    </div>
  );
};

export default FileUpload;
