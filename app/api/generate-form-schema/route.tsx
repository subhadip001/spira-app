export async function POST(req: Request) {
  const data = await req.json();

  const formSchema = {
    title: "Create forms for Market Research with Spira",
    fields: [
      {
        type: "text",
        label: "Name",
        name: "name",
        required: true,
      },
      {
        type: "email",
        label: "Email",
        name: "email",
        required: true,
      },
      {
        type: "number",
        label: "Age",
        name: "age",
        required: true,
      },
    ],
  };
  return new Response(JSON.stringify(formSchema), {
    status: 200,
  });
}
