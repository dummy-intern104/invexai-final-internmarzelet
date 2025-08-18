
import React from "react";
import { FileUploadSectionProps } from "./types";

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  handleFileUpload,
  loading
}) => {
  return (
    <div className="relative border border-dashed border-muted-foreground/20 rounded-lg p-4 text-center">
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={loading}
      />
      <div className="flex flex-col items-center justify-center py-4">
        <p className="text-sm font-medium mb-1">Choose File</p>
        <p className="text-xs text-muted-foreground">
          Upload any file with historical stock data
        </p>
      </div>
    </div>
  );
};
