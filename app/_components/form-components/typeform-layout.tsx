"use client"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { FormSchema } from "@/types/FormSchema"
import { TFormErrors } from "@/types/form"
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react"
import React, { useState } from "react"
import { Icons } from "../icons"
import { FormFieldComponent } from "./FormFields"

interface TypeformLayoutProps {
  initialSchema: FormSchema
  form: any
  formErrors: TFormErrors
  handleFieldChange: (field: any, value: string) => void
  backgroundColor: string
  className?: string
  formValues: Record<string, string>
}

const TypeformLayout: React.FC<TypeformLayoutProps> = ({
  initialSchema,
  form,
  formErrors,
  handleFieldChange,
  backgroundColor,
  className,
  formValues,
}) => {
  const [currentStep, setCurrentStep] = useState(-1) // -1 represents the intro screen
  const [validationError, setValidationError] = useState<string | null>(null)
  const totalQuestions = initialSchema?.fields?.length || 0
  const currentField = initialSchema?.fields?.[currentStep]

  const progress =
    currentStep === -1 ? 0 : ((currentStep + 1) / totalQuestions) * 100

  const validateCurrentField = () => {
    if (!currentField) return true
    const value = formValues[currentField.name]
    if (
      currentField.required &&
      (!value || (typeof value === "string" && value.trim() === ""))
    ) {
      setValidationError("This field is required")
      return false
    }
    setValidationError(null)
    return true
  }

  const handleNext = () => {
    if (currentStep === -1) {
      setCurrentStep(0)
      return
    }

    if (currentStep < totalQuestions - 1) {
      if (!validateCurrentField()) return
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
        <h1 className="text-4xl font-bold mb-4 text-center">
          {initialSchema?.title}
        </h1>
        <p className="text-xl max-w-3xl mx-auto text-gray-600 mb-8 text-center">
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
      <div className="w-full h-2 bg-gray-200 fixed top-0">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-grow flex items-center justify-center p-6 mt-4">
        {currentField && (
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
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
                        value={formValues[currentField.name] || ""}
                        onChange={(value: string) => {
                          handleFieldChange(currentField, value)
                          setValidationError(null)
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
            <section>
              {currentStep === totalQuestions - 1 ? (
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || !!validationError}
                  className=""
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
                  className=""
                >
                  OK
                </Button>
              )}
            </section>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 w-full bg-white">
        <div className="mx-auto p-4 relative flex items-center justify-end gap-4">
          {/* <FloatingBrand className="" /> */}

          <div className="flex gap-2 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className=""
              disabled={currentStep === 0}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={!!validationError || currentStep === totalQuestions - 1}
              className=""
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
          <div
            onClick={() => {
              window.open(process.env.NEXT_PUBLIC_SITE_URL, "_blank")
            }}
            className="cursor-pointer"
          >
            <div className="text-sm inline-flex items-center gap-1 text-gray-500 bg-blue-100 px-3 py-2 rounded-md border border-spirablue">
              <span>Powered by</span>
              <div className="flex items-center cursor-pointer gap-[0.1rem]">
                <Icons.logo className="w-4 h-4" />
                <span className="text-spirablue">Spira</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypeformLayout
