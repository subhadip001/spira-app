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
    <main className="bg-white">
      <div>
        <span>Edit Form</span>
        <GenerateForm
          formData={{
            prompt: searchParams.q,
          }}
        />
      </div>
    </main>
  );
}
