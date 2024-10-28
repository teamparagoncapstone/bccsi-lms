"use client";
import React from "react";

interface ProgressBarProps {
  progress: number; // Define the type for progress prop
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#e0e0df",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          backgroundColor: "#76c7c0",
          height: "100%",
          borderRadius: "5px",
          transition: "width 0.3s ease-in-out",
        }}
      />
    </div>
  );
};

export default ProgressBar;
