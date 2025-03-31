import { ShiningBadge } from "@/components/ui/ShiningBadge"
import { createClient } from "@/utils/supabase/server"
import Header from "./_components/header"
import IntroSection from "./_components/intro-section"
import PromptBox from "./_components/prompt-box"
import { RecentForms } from "./_components/recent-forms"
import { fetchIpDetails } from "@/lib/queries"

export default async function Home() {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  const ipData = await fetchIpDetails()
  return (
    <>
      <div className="min-h-screen flex flex-col z-10 relative">
        <video
          src="https://w06x29rjhxvpmsmw.public.blob.vercel-storage.com/videos/bg-IfZJXb3k8lYIUWixRaliM7LTCj12v0.mp4"
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            width: "100%",
            left: "50%",
            top: "50%",
            height: "100%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
            zIndex: "-1",
          }}
        />
        <Header />
        <main className="flex flex-grow w-full">
          <div className="m-auto w-[80%] md:w-[60%] px-3 py-2 flex gap-5 flex-col">
            <div className="flex justify-center">
              <ShiningBadge>{ipData.country}</ShiningBadge>
            </div>
            <div className="flex flex-col gap-5 font-bricolage_grotesque">
              <IntroSection />
              <PromptBox />
            </div>
            <div className="mt-auto">
              {user.user && (
                <RecentForms user={user?.user} userError={userError as Error} />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
