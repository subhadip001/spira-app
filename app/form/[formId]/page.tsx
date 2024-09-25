import EditForm from "@/app/_components/edit-form";
import Header from "@/app/_components/header";
import HistorySidebar from "@/app/_components/history-sidebar";
import { createClient } from "@/utils/supabase/server";

type TSearchParams = {
  q: string;
};

export default async function EditFormHome({
  searchParams,
  params,
}: {
  searchParams: TSearchParams;
  params: { formId: string };
}) {
  const supabase = createClient();

  const { data: forms } = await supabase
    .from("forms")
    .select("*")
    .eq("id", params.formId);

  console.log("forms", forms);

  return (
    <div className="bg-white w-[100vw] min-h-[100svh]">
      <Header />
      <main className="flex px-2">
        <HistorySidebar />
        <EditForm query={searchParams.q} />
      </main>
    </div>
  );
}
