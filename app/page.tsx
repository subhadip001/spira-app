import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern"
import { GlowEffect } from "@/components/ui/glow-effect"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/server"
import Header from "./_components/header"
import IntroSection from "./_components/intro-section"
import PromptBox from "./_components/prompt-box"

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
            <div className="flex justify-center relative w-fit">
              <GlowEffect
                colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
                mode="colorShift"
                blur="soft"
                duration={3}
                scale={1.1}
                className="rounded-full"
              />
              <button className="relative inline-flex items-center gap-1 rounded-full bg-zinc-950 px-2.5 py-1 text-xs text-zinc-50 outline outline-1 outline-[#fff2f21f]">
                Free for Beta 🎉
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-5 font-bricolage_grotesque z-10">
            <IntroSection />
            <PromptBox />
          </div>
          {/* <div className="mt-auto z-10">
            {user.user && (
              <RecentForms user={user?.user} userError={userError as Error} />
            )}
          </div> */}
        </div>
      </main>
    </div>
  )
}
