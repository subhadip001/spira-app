import Header from "@/app/_components/header";
import GenerateForm from "../../_components/generate-form";

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
    <div className="bg-white min-h-screen">
      <Header />
      <main className="flex">
        <aside>
          <div className="bg-gray-100 p-4">
            <h1 className="text-2xl font-bold">Form Builder</h1>
            <p className="text-gray-500 text-sm">
              Create forms, surveys and quizzes in seconds.
            </p>
          </div>
        </aside>
        <section>
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
