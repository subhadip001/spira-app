"use client"

import { getPublishedFormByFormVersionId, QueryKeys } from "@/lib/queries"
import { EFormVersionStatus } from "@/lib/types"
import useFormVersionStore from "@/store/formVersions"
import { useQuery } from "@tanstack/react-query"
import { Check, Copy, ExternalLink, Link } from "lucide-react"
import { useState } from "react"

export default function SharePublished({ formId }: { formId: string }) {
  const selectedFormVersion = useFormVersionStore(
    (state) => state.selectedFormVersion
  )
  const { data: publishedForm, isLoading } = useQuery({
    queryKey: [
      QueryKeys.GetPublishedFormByFormVersionId,
      selectedFormVersion?.id,
    ],
    queryFn: () => {
      if (selectedFormVersion?.status !== EFormVersionStatus.PUBLISHED) {
        return null
      }
      return getPublishedFormByFormVersionId(selectedFormVersion?.id || "")
    },
    enabled: !!selectedFormVersion?.id,
    refetchOnWindowFocus: false,
  })

  const [isCopied, setIsCopied] = useState(false)
  const publishedFormLink = `${process.env.NEXT_PUBLIC_SITE_URL}/f/${publishedForm?.data?.short_id}`

  return (
    <section className="flex flex-col gap-4 w-full">
      {!selectedFormVersion?.version_number ? null : publishedForm ? (
        <>
          <div className="bg-green-500/10 rounded-md p-4 flex items-center w-full gap-2 border border-green-500/20">
            <Check className="h-4 w-4 text-green-800" />
            <span className="text-sm text-green-800">
              Your form version is published and can be accessed by anyone with
              the link below.
            </span>
          </div>
          <div>
            <span>Form link:</span>
            <div className="bg-primary/10 justify-between rounded-md p-4 flex items-center gap-2 border border-primary/20">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary">
                  {publishedFormLink}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {isCopied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy
                    onClick={() => {
                      navigator.clipboard.writeText(publishedFormLink)
                      setIsCopied(true)
                      setTimeout(() => {
                        setIsCopied(false)
                      }, 2000)
                    }}
                    className="h-4 w-4 text-primary cursor-pointer"
                  />
                )}
                <ExternalLink
                  onClick={() => window.open(publishedFormLink, "_blank")}
                  className="h-4 w-4 text-primary cursor-pointer"
                />
              </div>
            </div>
          </div>
        </>
      ) : !isLoading && !publishedForm ? (
        <div className="bg-red-500/10 rounded-md p-4 flex items-center gap-2 border border-red-500/20">
          <span className="text-sm text-red-800">
            Your form version is not published yet.
          </span>
        </div>
      ) : null}
    </section>
  )
}
