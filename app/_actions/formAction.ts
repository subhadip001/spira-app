"use server";
import { createClient } from "@/utils/supabase/server";

export async function addFormQueryToDb(id: string, formQuery: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("forms").insert({
    id: id,
    query: formQuery,
  });
  if (error) {
    console.log("Error adding form query to db", error);
    return;
  }
  console.log("Form query added to db", data);
}
