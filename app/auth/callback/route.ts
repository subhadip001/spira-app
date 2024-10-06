import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";
  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const formId = requestUrl.searchParams.get("formId");
  const supabase = createClient();

  if (!code) {
    return NextResponse.redirect("/login");
  }

  await supabase.auth.exchangeCodeForSession(code);

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (!userData.user?.email) {
    return NextResponse.redirect("/login");
  }

  const origin = getURL();

  if (!formId) {
    return NextResponse.redirect(origin ?? requestUrl.origin);
  }

  await supabase
    .from("forms")
    .update({ user_id: userData.user.id })
    .eq("id", formId);

  const newRedirectUrl = new URL(
    `/form/${formId}`,
    origin ?? requestUrl.origin
  );
  return NextResponse.redirect(newRedirectUrl);
}
