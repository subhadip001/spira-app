"use server"
import { createClient } from "@/utils/supabase/server"
type FormData = {
  id: string
  query: string
  user_id?: string
}
export async function addFormQueryToDb(id: string, formQuery: string) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  // console.log("user", user);
  const FormData: FormData = {
    id: id,
    query: formQuery,
  }
  if (user?.user?.id) {
    FormData.user_id = user?.user?.id
  }
  const { data, error } = await supabase.from("forms").insert(FormData)
  if (error) {
    console.log("Error adding form query to db", error)
    return
  }
  console.log("Form query added to db", data)
}
