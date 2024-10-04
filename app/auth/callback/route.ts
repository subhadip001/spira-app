import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const formId = requestUrl.searchParams.get("formId");
  const supabase = createClient();
  console.log(formId, "formId");
  console.log(request, "request");
  if (!code) {
    return NextResponse.redirect("/login");
  }

  await supabase.auth.exchangeCodeForSession(code);

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (!userData.user?.email) {
    return NextResponse.redirect("/login");
  }

  if (!formId) {
    return NextResponse.redirect(requestUrl.origin);
  }
  
  const formdata = await supabase
    .from("forms")
    .update({ user_id: userData.user.id })
    .eq("id", formId);

  const newRedirectUrl = new URL(`/form/${formId}`, requestUrl.origin);
  return NextResponse.redirect(newRedirectUrl);
}
