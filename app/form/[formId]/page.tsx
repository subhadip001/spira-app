import Header from "@/app/_components/header";
import GenerateForm from "../../_components/generate-form";
import HistorySidebar from "@/app/_components/history-sidebar";
import { Button } from "@/components/ui/button";
import { SquareArrowUpRight } from "lucide-react";

type TSearchParams = {
  q: string;
};

export default function EditForm({
  searchParams,
  params,
}: {
  searchParams: TSearchParams;
  params: { formId: string };
}) {
  return (
    <div className="bg-white min-h-[100svh]">
      <Header />
      <main className="flex px-2 gap-2 overflow-y-auto ">
        <HistorySidebar />
        <section className="flex-grow flex flex-col gap-2 h-[calc(100vh-64px)] py-2 px-3 overflow-y-auto bg-[#f6f6f6df] rounded-md">
          <div className="flex py-2 px-3 justify-between items-center w-full bg-[#e5e5e5] rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-400 flex text-white justify-center items-center rounded-full">
                O
              </div>
              <span className="text-lg">Edit Form</span>
            </div>
            <div>
              <Button
                type="button"
                variant="default"
                className="flex items-center gap-1"
              >
                Publish
                <div>
                  <SquareArrowUpRight className="h-4 w-4" />
                </div>
              </Button>
            </div>
          </div>
          <GenerateForm
            formData={{
              prompt: searchParams.q,
            }}
          />
        </section>
      </main>
    </div>
  );
}
