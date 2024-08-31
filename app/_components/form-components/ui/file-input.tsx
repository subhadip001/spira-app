import { fileSizeConverter } from "@/lib/form-lib/utils";
import { cn } from "@/lib/utils";
import { File, Upload, X } from "lucide-react";
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

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

type FileInputProps = {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: any) => void;
  className?: string;
  accept?: string;
  handleFile: (file: File) => void;
};

const FileInput: React.FC<FileInputProps> = ({ handleFile, ...props }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleClick = () => {
    if (file) {
      return;
    }
    hiddenFileInput.current?.click();
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("files", files);
    if (files && files.length > 0) {
      const fileUploaded = files[0];
      setFile(fileUploaded);
      handleFile(fileUploaded);
      uploadFile(fileUploaded)
        .then(() => {
          console.log("file uploaded:)");
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = "";
    }
  };

  const uploadFile = async (file: File) => {
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.error("Error uploading file:", error);
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
            <div className="flex items-center gap-8 justify-between">
              <div className="flex items-center gap-2">
                <div className="text-gray-500">
                  <File size={18} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 ">{file.name}</span>
                  <span className="text-blue-400 text-[0.7rem]">
                    {fileSizeConverter(file.size)}
                  </span>
                </div>
              </div>
              <div
                className="text-gray-400 cursor-pointer p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(e);
                }}
              >
                <X size={15} />
              </div>
            </div>
          ) : (
            <div className="text-gray-500 flex items-center">
              <div className="flex items-center gap-2">
                <Upload size={18} />
                <span>Click to choose a file &nbsp;</span>
              </div>
              <span className="text-gray-500 text-xs font-thin">
                ({props.accept} )
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
