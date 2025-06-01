import { ShiningBadge } from "@/components/ui/ShiningBadge"
import { createClient } from "@/utils/supabase/server"
import Header from "./_components/header"
import IntroSection from "./_components/intro-section"
import PromptBox from "./_components/prompt-box"
import { RecentForms } from "./_components/recent-forms"
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern"
import { cn } from "@/lib/utils"
import { FlickeringGrid } from "@/components/magicui/flickering-grid"

// https://w06x29rjhxvpmsmw.public.blob.vercel-storage.com/videos/bg-IfZJXb3k8lYIUWixRaliM7LTCj12v0.mp4
// <FlickeringGrid className="absolute inset-0" squareSize={50} />

export default async function Home() {
  const supabase = await createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  return (
    <div className="min-h-screen flex flex-col z-10 relative">
      <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        )}
        width={40}
        height={40}
        squares={[100, 100]}
        squaresClassName="hover:fill-blue-500"
      />

      <Header />
      <main className="flex flex-grow w-full">
        <div className="m-auto w-[80%] md:w-[60%] px-3 py-2 flex gap-5 flex-col">
          <div className="flex justify-center">
            {/* <ShiningBadge> Celebrating 500+ Users 🎉 </ShiningBadge> */}
          </div>
          <div className="flex flex-col gap-5 font-bricolage_grotesque z-10">
            <IntroSection />
            <PromptBox />
          </div>
          <div className="mt-auto z-10">
            {user.user && (
              <RecentForms user={user?.user} userError={userError as Error} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
