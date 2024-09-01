import { Badge } from "@/components/ui/badge";
import IntroSection from "./_components/intro-section";
import PromptBox from "./_components/prompt-box";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <section className="flex w-full m-3 md:m-8 bg-whte rounded-lg">
        <div className="m-auto w-[60%] px-3 py-2 flex gap-5 flex-col md:h-[50vh]">
          <div className="flex justify-center">
            <Badge>Prototype</Badge>
          </div>
          <div className="flex flex-col gap-5 font-bricolage_grotesque">
            <IntroSection />
            <PromptBox />
          </div>
        </div>
      </section>
    </main>
  );
}
