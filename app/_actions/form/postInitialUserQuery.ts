"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import genarateForSchema from "@/app/_functions/genarateFormSchema";
import { version } from "os";

const rawIntialQueryFormDataSchema = z.object({
  userPrompt: z.string(),
});

export default async function PostInitialUserQuery(formData: FormData) {
  try {
    const supabase = createClient();
    const rawIntialQueryFormData = {
      userPrompt: formData.get("prompt"),
    };
    const parsedIntialQueryFormData = rawIntialQueryFormDataSchema.safeParse(
      rawIntialQueryFormData
    );
    if (!parsedIntialQueryFormData.success) {
      return { message: `${parsedIntialQueryFormData.error}` };
    }

    const { data: baseForm, error: baseFormError } = await supabase
      .from("forms")
      .insert({})
      .select();
    if (baseFormError) {
      return { message: `${baseFormError.message}` };
    }
    const baseFormId = baseForm[0]?.id;
    if (!baseFormId) {
      return { message: "Failed to create form" };
    }
    const returndevalued = await genarateForSchema(
      parsedIntialQueryFormData.data.userPrompt
    );
    if (!returndevalued.success) {
      throw new Error(returndevalued.message);
    }
    const formSchema = JSON.stringify(returndevalued.data);

    // const { data: formVersion } = await supabase
    //   .from("form_versions")
    //   .insert([
    //     {
    //       version_number: 1,
    //       form_id: baseFormId,
    //       form_schema_string: formSchema,
    //       query: parsedIntialQueryFormData.data.userPrompt,
    //     },
    //   ])
    //   .select()
    //   .then((response) => {
    //     const { data, error } = response;
    //     if (error) {
    //       throw new Error(error.message);
    //     }
    //     return { data };
    //   });

    redirect(`/form/${baseFormId}`);
  } catch (error) {
    console.error(error);
  }
}
