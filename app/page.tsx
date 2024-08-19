import { Badge } from "@/components/ui/badge";
import GenerateBox from "./components/generate-box";
import IntroSection from "./components/intro-section";
import AppWrapper from "./components/app-wrapper";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <section className="flex w-full m-5 bg-[#ffff] rounded-lg">
        <div className="m-auto w-[60%] px-3 py-2 flex gap-5 flex-col h-[50vh]">
          <div className="flex justify-center">
            <Badge>Prototype</Badge>
          </div>
          <div className="flex flex-col gap-5 font-bricolage_grotesque">
            <IntroSection />
            <AppWrapper />
          </div>
        </div>
      </section>
    </main>
  );
}
