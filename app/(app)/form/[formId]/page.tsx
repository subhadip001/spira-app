import GenerateForm from "../../../_components/generate-form";
export default function EditForm({

  params,
}: {
  
  params: { formId: string };
}) {
  
  

  return (
    <main className="bg-white min-h-screen">
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
