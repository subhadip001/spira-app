"use client";
import ShineBorder from "@/components/magicui/shine-border";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TQueryData } from "@/lib/types";
import { quickStartQueries } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useState, useTransition } from "react";
import { ReactTyped } from "react-typed";
import { v4 as uuidv4 } from "uuid";
import { addFormQueryToDb } from "../_actions/formAction";
import useFormVersionStore from "@/store/formVersions";
import useEditFormPageStore from "@/store/editFormPageStore";

const PromptBox = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const resetFormVersionStore = useFormVersionStore(
    (state) => state.resetStore
  );
  const resetEditFormPageStore = useEditFormPageStore(
    (state) => state.resetStore
  );

  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries()) as TQueryData;
    const prompt = data.prompt;
    const uuid = uuidv4();
    startTransition(async () => {
      resetFormVersionStore();
      resetEditFormPageStore();
      await addFormQueryToDb(uuid, prompt);
      router.push(`/form/${uuid}`);
    });
  };
  return (
    <div className="flex flex-col gap-3">
      <ShineBorder
        className="rounded-lg relative bg-white shadow-lg"
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      >
        <form
          className=" flex flex-col gap-3 rounded-lg p-3 z-50  "
          action={handleSubmit}
        >
          <ReactTyped
            strings={[
              "Form to collect my user feedback...",
              "Create a survey about...",
              "A form to hire a product designer...",
              "Ask Spira to build form for anything...",
            ]}
            typeSpeed={40}
            backSpeed={50}
            attr="placeholder"
            // loop
          >
            <input
              className="w-full border-none outline-none px-3 py-1 rounded"
              name="prompt"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </ReactTyped>

          <div className="w-full flex">
            <Button
              type="submit"
              className="rounded-full w-[50px] h-[50px] ml-auto"
              variant="outline"
              disabled={isPending}
            >
              {isPending ? (
                <div className="animate-spin">
                  <Loader2 size={20} />
                </div>
              ) : (
                <div>
                  <ArrowRight size={20} />
                </div>
              )}
            </Button>
          </div>
        </form>
      </ShineBorder>
      <div className="flex items-center gap-2 flex-wrap">
        {quickStartQueries.map((data, index) => (
          <Fragment key={index}>
            <Badge
              className="cursor-pointer py-1 flex items-center gap-2 text-gray-500 hover:border-gray-400 hover:bg-gray-100"
              variant="outline"
              onClick={() => setQuery(data.query)}
            >
              <span>{data.query}</span>
              <div>
                <ArrowUpRight size={16} />
              </div>
            </Badge>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default PromptBox;
