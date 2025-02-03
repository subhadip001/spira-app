"use client"
import ShineBorder from "@/components/magicui/shine-border"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generateTypeSuggestion } from "@/lib/queries"
import { TQueryData } from "@/lib/types"
import { quickStartQueries } from "@/lib/utils"
import useEditFormPageStore from "@/store/editFormPageStore"
import useFormVersionStore from "@/store/formVersions"
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Fragment, useEffect, useRef, useState, useTransition } from "react"
import { v4 as uuidv4 } from "uuid"
import { addFormQueryToDb } from "../_actions/formAction"
import AnimatedPlaceholderInput from "./animated-placeholder-input"
import TemplateAndScratch from "./template-and-scratch"
import { toast } from "react-hot-toast"

const PromptBox = () => {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [isPending, startTransition] = useTransition()
  const resetFormVersionStore = useFormVersionStore((state) => state.resetStore)
  const resetEditFormPageStore = useEditFormPageStore(
    (state) => state.resetStore
  )
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isGeneratingSuggestion = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [isScratchPending, startScratchTransition] = useTransition()
  const [isTemplatePending, startTemplateTransition] = useTransition()

  useEffect(() => {
    const generateSuggestion = async () => {
      if (
        query.length > 3 &&
        !isGeneratingSuggestion.current &&
        query.endsWith(" ")
      ) {
        isGeneratingSuggestion.current = true
        try {
          const response = await generateTypeSuggestion({ prompt: query })
          console.log("response", response.message)

          const cleanedMessage = response.message.replace(/^"|"$/g, "")
          setSuggestion(cleanedMessage)
        } catch (error) {
          console.error("Error generating suggestion:", error)
        } finally {
          isGeneratingSuggestion.current = false
        }
      } else if (query.length <= 3) {
        setSuggestion("")
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(generateSuggestion, 300)

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [query])

  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries()) as TQueryData
    const prompt = data.prompt
    if (prompt) {
      const uuid = uuidv4()
      startTransition(async () => {
        resetFormVersionStore()
        resetEditFormPageStore()
        await addFormQueryToDb(uuid, prompt)
        router.push(`/form/${uuid}/editor`)
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault()
      setQuery((prevQuery) => {
        const newQuery = prevQuery.endsWith(" ")
          ? prevQuery + suggestion
          : prevQuery + " " + suggestion
        return newQuery.endsWith(" ") ? newQuery : newQuery + " "
      })
      setSuggestion("")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value)
    setSuggestion("")
  }

  const placeholders = [
    "Form to collect my user feedback...",
    "Create a survey about...",
    "A form to hire a product designer...",
    "Ask Spira to build form for anything...",
  ]

  const handleTemplateClick = () => {
    toast.error("Templates are coming soon!")
  }

  const handleCreateClick = () => {
    const uuid = uuidv4()

    startScratchTransition(async () => {
      resetFormVersionStore()
      resetEditFormPageStore()
      await addFormQueryToDb(uuid, "CREATED_FROM_SCRATCH")
      router.push(`/form/${uuid}/editor`)
    })
  }

  return (
    <div className="flex flex-col gap-3 font-sans">
      <ShineBorder
        className="rounded-lg relative bg-white shadow-lg"
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      >
        <form
          className=" flex flex-col gap-3 rounded-lg p-3 z-50  "
          action={handleSubmit}
        >
          <div className="relative">
            <AnimatedPlaceholderInput
              placeholders={placeholders}
              name="prompt"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            {suggestion && (
              <span className="absolute top-0 left-0 w-full pointer-events-none px-3 py-1 text-lg">
                <span className="invisible">{query}</span>
                <span className="text-gray-400">{suggestion}</span>
              </span>
            )}
          </div>

          <div className="w-full flex">
            <Button
              type="submit"
              className="rounded-full w-[50px] h-[50px] ml-auto"
              variant="outline"
              disabled={isPending}
            >
              {isPending ? (
                <div className="animate-spin">
                  <Loader2 size={20} />
                </div>
              ) : (
                <div>
                  <ArrowRight size={20} />
                </div>
              )}
            </Button>
          </div>
        </form>
      </ShineBorder>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {quickStartQueries.map((data, index) => (
          <Fragment key={index}>
            <Badge
              className="cursor-pointer py-1 flex items-center gap-2 text-gray-500 hover:border-gray-400 hover:bg-gray-100"
              variant="outline"
              onClick={() => setQuery(data.query)}
            >
              <span>{data.query}</span>
              <div>
                <ArrowUpRight size={16} />
              </div>
            </Badge>
          </Fragment>
        ))}
      </div>
      {/* <TemplateAndScratch
        onTemplateClick={handleTemplateClick}
        onCreateClick={handleCreateClick}
        isScratchPending={isScratchPending}
        isTemplatePending={isTemplatePending}
      /> */}
    </div>
  )
}

export default PromptBox
