"use client"
import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { EProfession, EUseCase, EReferrer, TUserOnboarding } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ArrowRight, Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { addNewUserToOnboarding } from "@/lib/queries"
import useAppStore from "@/store/appStore"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

type OnboardingFormProps = {
  userId: string
  formId: string | string[] | undefined
}

type OnboardingFormFields = Pick<
  TUserOnboarding,
  "profession" | "usecase" | "referrer"
>

const OnboardingForm = ({ userId, formId }: OnboardingFormProps) => {
  const router = useRouter()

  console.log("formId", formId)

  const [formData, setFormData] = useState<OnboardingFormFields>({
    profession: undefined,
    usecase: undefined,
    referrer: undefined,
  })
  const [errors, setErrors] = useState<
    Record<keyof OnboardingFormFields, boolean>
  >({
    profession: false,
    usecase: false,
    referrer: false,
  })

  const validateForm = () => {
    const newErrors = {
      profession: !formData.profession,
      usecase: !formData.usecase,
      referrer: !formData.referrer,
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const createOnboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormFields) => {
      if (!userId) throw new Error("User ID is required")
      return await addNewUserToOnboarding(
        userId,
        data.profession as EProfession,
        data.usecase as EUseCase,
        data.referrer as EReferrer
      )
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      createOnboardingMutation.mutate(formData, {
        onSuccess: (data) => {
          console.log("Success", data)
          if (data?.error) {
            toast.error(data?.error.message)
            return
          }
          toast.success("Onboarding created successfully")
          if (formId) {
            router.push(`/form/${formId}`)
          } else {
            router.push("/")
          }
        },
        onError: (error) => {
          console.error("Error", error)
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Tell us about yourself</h1>
        <p className="text-gray-600">
          Workspaces are shared environments where teams can collaborate on
          tasks, cycles and projects.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                What is your profession?
                {errors.profession && (
                  <span className="text-red-500 ml-2 bg-red-100 px-2 py-1 text-xs font-normal rounded-xl">
                    Required
                  </span>
                )}
              </h2>
              <RadioGroup
                value={formData.profession}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    profession: value as EProfession,
                  }))
                  setErrors((prev) => ({ ...prev, profession: false }))
                }}
                className="grid grid-cols-2 gap-3"
              >
                {Object.values(EProfession).map((profession) => (
                  <Label
                    key={profession}
                    className={cn(
                      "flex items-center justify-start px-4 py-3 rounded-lg cursor-pointer transition-colors",
                      "bg-gray-50 hover:bg-gray-100",
                      formData.profession === profession &&
                        "bg-gray-100 ring-2 ring-primary"
                    )}
                  >
                    <RadioGroupItem
                      value={profession}
                      id={profession}
                      className="hidden"
                    />
                    <span className="text-sm font-medium">{profession}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                What's your primary use case?
                {errors.usecase && (
                  <span className="text-red-500 ml-2 bg-red-100 px-2 py-1 text-xs font-normal rounded-xl">
                    Required
                  </span>
                )}
              </h2>
              <Select
                value={formData.usecase}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    usecase: value as EUseCase,
                  }))
                  setErrors((prev) => ({ ...prev, usecase: false }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your use case" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EUseCase).map((useCase) => (
                    <SelectItem key={useCase} value={useCase}>
                      {useCase
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                How did you hear about us?{" "}
                {errors.referrer && (
                  <span className="text-red-500 ml-2 bg-red-100 px-2 py-1 text-xs font-normal rounded-xl">
                    Required
                  </span>
                )}
              </h2>
              <Select
                value={formData.referrer}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    referrer: value as EReferrer,
                  }))
                  setErrors((prev) => ({ ...prev, referrer: false }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select referral source" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EReferrer).map((referrer) => (
                    <SelectItem key={referrer} value={referrer}>
                      {referrer.charAt(0) + referrer.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full flex gap-2 items-center justify-center bg-spirablue text-white hover:bg-[#3b82f6]"
      >
        <span>
          {createOnboardingMutation.isPending ? "Please wait" : "Continue"}
        </span>
        <div>
          {createOnboardingMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </div>
      </Button>
    </form>
  )
}

export default OnboardingForm
