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

  console.log("forms", forms?.length);

  return (
    <div className="bg-white w-[100vw] min-h-[100svh]">
      <Header />
      <main className="flex px-2">
        <HistorySidebar />
        {forms?.length ? (
          <EditForm form={forms[0]} />
        ) : (
          <>
            <div className="flex flex-col w-full items-center justify-center gap-2 h-[calc(100svh-64px)] py-2 px-3 bg-[#f6f6f6df] rounded-md min-w-0">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Form not found</h1>
                <p className="text-gray-500">
                  The form you are looking for does not exist.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
