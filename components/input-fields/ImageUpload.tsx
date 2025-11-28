import type { FC, ChangeEvent, ChangeEventHandler, DragEventHandler } from "react";
import { useRef, useState } from "react";
import Label from "./Label";

interface ImageUploadProps {
  handleChange: ChangeEventHandler<HTMLInputElement>;
}

export const ImageUpload: FC<ImageUploadProps> = ({ handleChange }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 1) {
      setError("Only one image can be uploaded.");
      return;
    }

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      // Clear previous error on successful valid drop
      setError(null);
      const syntheticEvent = {
        target: { files: [file] },
      } as unknown as ChangeEvent<HTMLInputElement>;
      handleChange(syntheticEvent);
    }
  };

  return (
    <div>
      <Label htmlFor="profileImage" label="Profile Picture" />
      <div
        className={`mt-2 flex items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragging ? "bg-gray-600 border-cyan-500" : "bg-gray-700 hover:bg-gray-600"
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="drop-zone"
        role="group"
        aria-labelledby="profileImage-label"
      >
        <div
          id="profileImage-label"
          role="button"
          tabIndex={0}
          className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG, or GIF</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          id="profileImage"
          type="file"
          className="hidden"
          accept="image/*"
          data-testid="file-upload"
          aria-describedby="profileImageHelp"
          onChange={(e) => {
            // Clear any previous error when user selects a valid image
            if (e.target.files && e.target.files.length === 1) {
              const selected = e.target.files[0];
              if (selected && selected.type.startsWith("image/")) {
                setError(null);
              }
            }
            handleChange(e);
          }}
        />
      </div>
      <p id="profileImageHelp" className="sr-only">
        Upload a profile image. Accepted formats: SVG, PNG, JPG, or GIF.
      </p>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};
