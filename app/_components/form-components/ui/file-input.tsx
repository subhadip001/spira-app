import { fileSizeConverter } from "@/lib/form-lib/utils";
import { cn } from "@/lib/utils";
import { Check, File, TriangleAlert, Upload, X } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";

import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = Object.values(firebaseConfig).every(Boolean)
  ? initializeApp(firebaseConfig)
  : null;
const storage = app ? getStorage(app) : null;

type FileInputProps = {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: any) => void;
  className?: string;
  accept?: string;
  maxSize: string;
};

const FileInput: React.FC<FileInputProps> = ({ maxSize, ...props }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleClick = () => {
    if (file) {
      return;
    }
    hiddenFileInput.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileUploaded = files[0];
      setFile(fileUploaded);
      uploadFile(fileUploaded);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setUploadProgress(0);
    setUploadError(null);
    props.onChange(null);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = "";
    }
  };

  const uploadFile = async (file: File) => {
    if (!file) {
      return;
    }

    if (file.size > parseInt(maxSize)) {
      const errorMessage = `File size should not exceed ${fileSizeConverter(
        parseInt(maxSize)
      )}`;
      setUploadError(errorMessage);
      return;
    }

    if (!storage) {
      setUploadError(
        "Firebase storage is not initialized. Check your configuration."
      );
      return;
    }

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error);
        setUploadError("Failed to upload file. Please try again.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          props.onChange(downloadURL);
        });
      }
    );
  };

  return (
    <div
      className={`flex flex-col border rounded-md hover:bg-[#F1F5F9] transition-all ${
        !file ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center px-3 py-4">
        <div className="w-full">
          {file ? (
            <div className="flex flex-col gap-2 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-gray-500">
                    <File size={18} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">{file.name}</span>
                    <span className="text-blue-400 text-[0.7rem]">
                      {fileSizeConverter(file.size)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {uploadProgress >= 100 && (
                      <div className="text-gray-500 text-xs">
                        <Check color="green" size={12} />
                      </div>
                    )}
                    {uploadError && (
                      <div className="text-gray-500 text-xs">
                        <TriangleAlert color="red" size={12} />
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="text-gray-400 cursor-pointer p-1"
                  onClick={removeFile}
                >
                  <X size={15} />
                </div>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-1 absolute -bottom-2">
                  <div
                    className="bg-blue-400 h-1 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              {uploadError && (
                <span className="text-red-500 text-[0.6rem] absolute -bottom-3">
                  {uploadError}
                </span>
              )}
            </div>
          ) : (
            <div className="text-gray-500 flex items-center">
              <div className="flex items-center gap-2">
                <Upload size={18} />
                <span>Click to choose a file &nbsp;</span>
              </div>
              <span className="text-gray-500 text-xs font-thin">
                ({props.accept})
              </span>
            </div>
          )}
        </div>
      </div>
      <input
        {...props}
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        className={cn(props.className, "hidden")}
      />
    </div>
  );
};

export default FileInput;
