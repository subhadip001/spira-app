import { Badge } from "@/components/ui/badge";
import GenerateBox from "./components/generate-box";

export default function Home() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <main className="flex min-h-screen">
      <section className="flex w-full my-3 mr-3 bg-[#ffff] rounded-lg">
        <div className="m-auto w-[60%] px-3 py-2 flex gap-5 flex-col h-[50vh]">
          <div className="flex justify-center">
            <Badge>Prototype</Badge>
          </div>
          <div className="flex flex-col gap-5 font-bricolage_grotesque">
            <h1 className="text-4xl text-center ">
              Create forms for Market Research with Spira
            </h1>
            <GenerateBox />
          </div>
        </div>
      </section>
    </main>
  );
}
