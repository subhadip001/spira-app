import { Badge } from "@/components/ui/badge";
import IntroSection from "./_components/intro-section";
import PromptBox from "./_components/prompt-box";
import Header from "./_components/header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-grow w-full">
        <div className="m-auto w-[80%] md:w-[60%] px-3 py-2 flex gap-5 flex-col md:h-[60vh]">
          <div className="flex justify-center">
            <Badge>Prototype</Badge>
          </div>
          <div className="flex flex-col gap-5 font-bricolage_grotesque">
            <IntroSection />
            <PromptBox />
          </div>
        </div>
      </main>
    </div>
  );
}
