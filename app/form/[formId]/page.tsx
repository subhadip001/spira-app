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
    <GenerateForm
      formData={{
        prompt: searchParams.q,
      }}
    />
  );
}
