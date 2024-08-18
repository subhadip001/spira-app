import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <div className="m-auto w-[60%] px-3 py-2 flex gap-5 flex-col h-[50vh]">
        <div className="flex justify-center">
          <Badge>Prototype</Badge>
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl text-center">
            Create forms for Market Research with Spira
          </h1>
          <div className="flex flex-col gap-3 border rounded-lg p-3">
            <input
              className="w-full border-none outline-none px-3 py-1"
              placeholder="Ask Spira what to build..."
            />
            <div className="w-full flex">
              <Button
                className="rounded-full w-[50px] h-[50px] ml-auto"
                variant="outline"
              >
                <div>
                  <ArrowRight size={20} />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
