import { Icons } from "@/app/_components/icons"
import PublishedForm from "@/app/_components/published-form"
import { EFormVersionStatus } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { Metadata } from "next"

export const generateMetadata = async (props: {
  params: Promise<{ shortId: string }>
}): Promise<Metadata> => {
  const params = await props.params
  const supabase = await createClient()
  const { data: publishedForm, error: formError } = await supabase
    .from("published_forms")
    .select(
      `
    id,
    form_title,
    form_versions (
      id,
      created_at,
      query
    )
  `
    )
    .eq("short_id", params.shortId)
    .single()

  if (formError || !publishedForm) {
    return {
      title: "Form not found",
    }
  }

  return {
    title: `Form - ${publishedForm?.form_title !== "N/A" ? publishedForm.form_title : publishedForm?.form_versions?.query}`,
  }
}

export default async function PublishedFormHome(props: {
  params: Promise<{ shortId: string }>
}) {
  const params = await props.params
  const supabase = await createClient()
  const { data: publishedForm, error: formError } = await supabase
    .from("published_forms")
    .select(
      `
    id,
    form_versions (
      id,
      created_at,
      form_id,
      form_schema_string,
      query,
      status,
      version_number
    )
  `
    )
    .eq("short_id", params.shortId)
    .single()

  if (formError) {
    return (
      <div className="bg-white w-[100vw] min-h-[100svh]">
        <main className="flex px-2">
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-2xl font-bold">Form not found</h1>
          </div>
        </main>
      </div>
    )
  }

  if (publishedForm?.form_versions?.status !== EFormVersionStatus.PUBLISHED) {
    return (
      <div className="bg-white w-[100vw] min-h-[100svh]">
        <main className="flex px-2">
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-2xl font-bold">Form not published yet</h1>
          </div>
        </main>
      </div>
    )
  }

  return (
    <>
      <main className="flex flex-col bg-white w-[100vw] overflow-y-auto h-[100svh]">
        <header className="relative">
          <div className="h-[35vh]">
            <div className="h-[20vh] bg-spirablue"></div>
            <div className="absolute flex items-center justify-center left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gray-100 overflow-hidden">
              <Icons.logo className="w-24 h-24" />
            </div>
          </div>
        </header>
        <div className="relative w-[85%] mx-auto md:w-[60%]">
          <PublishedForm publishedForm={publishedForm} />
        </div>
        <footer className="inline-flex items-center justify-center w-full py-2 mt-auto">
          <div className="text-sm inline-flex items-center gap-1 text-gray-500">
            Made with{" "}
            <a
              href={process.env.NEXT_PUBLIC_SITE_URL}
              className="flex items-center cursor-pointer gap-[0.1rem]"
            >
              <Icons.logo className="w-4 h-4" />
              <span className="text-spirablue">Spira AI</span>
            </a>
          </div>
        </footer>
      </main>
    </>
  )
}
