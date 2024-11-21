import { useState } from "react"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "@/utils/firebase/firebase-config"

interface UseFileUploadReturn {
  uploadFile: (file: File, maxSize?: number) => Promise<string>
  uploadProgress: number
  uploadError: string | null
  isUploading: boolean
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const uploadFile = (
    file: File,
    maxSize: number = 5 * 1024 * 1024
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file selected"))
        return
      }

      if (file.size > maxSize) {
        const errorMessage = `File size should not exceed ${(maxSize / (1024 * 1024)).toFixed(2)}MB`
        setUploadError(errorMessage)
        reject(new Error(errorMessage))
        return
      }

      if (!storage) {
        const error =
          "Firebase storage is not initialized. Check your configuration."
        setUploadError(error)
        reject(new Error(error))
        return
      }

      setIsUploading(true)
      setUploadError(null)

      const storageRef = ref(storage, `files/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        },
        (error) => {
          console.error("Error uploading file:", error)
          const errorMessage = "Failed to upload file. Please try again."
          setUploadError(errorMessage)
          setIsUploading(false)
          reject(error)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            setIsUploading(false)
            setUploadProgress(0)
            resolve(downloadURL)
          } catch (error) {
            setUploadError("Failed to get download URL")
            setIsUploading(false)
            reject(error)
          }
        }
      )
    })
  }

  return {
    uploadFile,
    uploadProgress,
    uploadError,
    isUploading,
  }
}
