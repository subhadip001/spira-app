import EditForm from "@/app/_components/edit-form";
import Header from "@/app/_components/header";
import HistorySidebar from "@/app/_components/history-sidebar";
import PublishedForm from "@/app/_components/published-form";

type TSearchParams = {
  q: string;
};

export default function PublishedFormHome({
  searchParams,
  params,
}: {
  searchParams: TSearchParams;
  params: { formId: string };
}) {
  return (
    <div className="bg-white w-[100vw] min-h-[100svh]">
      <Header />
      <main className="flex px-2">
        <PublishedForm />
      </main>
    </div>
  );
}
