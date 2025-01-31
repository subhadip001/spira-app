"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { FormSchema } from "@/types/FormSchema"
import { TFormErrors } from "@/types/form"
import { ArrowRight, Loader2 } from "lucide-react"
import React, { useState } from "react"
import { FormFieldComponent } from "./FormFields"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Icons } from "../icons"

interface TypeformLayoutProps {
  initialSchema: FormSchema
  form: any
  formErrors: TFormErrors
  handleFieldChange: (field: any, value: string) => void
  backgroundColor: string
  className?: string
}

const TypeformLayout: React.FC<TypeformLayoutProps> = ({
  initialSchema,
  form,
  formErrors,
  handleFieldChange,
  backgroundColor,
  className,
}) => {
  const [currentStep, setCurrentStep] = useState(-1) // -1 represents the intro screen
  const [validationError, setValidationError] = useState<string | null>(null)
  const totalQuestions = initialSchema?.fields?.length || 0
  const currentField = initialSchema?.fields?.[currentStep]

  const progress =
    currentStep === -1 ? 0 : ((currentStep + 1) / totalQuestions) * 100

  const validateCurrentField = () => {
    if (!currentField) return true
    const value = form.getValues()[currentField.name]
    if (
      currentField.required &&
      (!value || (typeof value === "string" && value.trim() === ""))
    ) {
      setValidationError("This field is required")
      return false
    }
    return true
  }

  const handleNext = () => {
    if (currentStep === -1) {
      setCurrentStep(0)
      return
    }

    if (currentStep < totalQuestions - 1) {
      if (!validateCurrentField()) return
      setValidationError(null)
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > -1) {
      setValidationError(null)
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStart = () => {
    setCurrentStep(0)
  }

  if (currentStep === -1) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen w-full p-6"
        style={{ backgroundColor }}
      >
        <div className="mb-8">
          {initialSchema?.headerBackground && (
            <Icons.logo className="w-24 h-24" />
          )}
        </div>
        <h1 className="text-4xl font-bold mb-4">{initialSchema?.title}</h1>
        <p className="text-xl text-gray-600 mb-8">
          {initialSchema?.description}
        </p>
        <Button
          onClick={handleStart}
          size="lg"
          className="text-lg px-8 py-6 rounded-full animate-bounce"
        >
          Start
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col min-h-screen w-full", className)}>
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 fixed top-0">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-grow flex items-center justify-center p-6 mt-4">
        {currentField && (
          <div className="w-full max-w-3xl mx-auto">
            <div
              className={cn(
                "relative border rounded-lg p-8 transition-all duration-300 bg-white",
                !!formErrors.find(
                  (e) => e.formFieldId === currentField.serialId
                )?.error || validationError
                  ? "border-red-500 bg-[#ffe7e75c]"
                  : "border-gray-200"
              )}
            >
              <FormField
                control={form.control}
                name={currentField.name}
                render={({ field: controllerField }) => (
                  <FormItem>
                    <FormControl>
                      <FormFieldComponent
                        field={currentField}
                        value={controllerField.value}
                        onChange={(value: string) => {
                          controllerField.onChange(value)
                          handleFieldChange(currentField, value)
                          if (validationError) setValidationError(null)
                        }}
                        accept={
                          currentField.type === "file"
                            ? currentField.accept
                            : undefined
                        }
                        maxSize={
                          currentField.type === "file"
                            ? currentField.maxSize
                            : undefined
                        }
                      />
                    </FormControl>
                    {validationError && (
                      <div className="text-red-500 text-sm mt-2">
                        {validationError}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-3xl mx-auto p-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            className="px-6"
          >
            Previous
          </Button>

          <div className="text-sm text-gray-500">
            Question {currentStep + 1} of {totalQuestions}
          </div>

          {currentStep === totalQuestions - 1 ? (
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !!validationError}
              className="px-6"
              onClick={() => {
                if (!validateCurrentField()) return
              }}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Submit
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!!validationError}
              className="px-6"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TypeformLayout
