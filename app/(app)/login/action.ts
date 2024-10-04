"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";
  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export async function login(formData: FormData) {
  const supabase = createClient();
  const origin = getURL() ?? headers().get("origin");
  const formId = formData.get("formId");

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback${formId ? `?formId=${formId}` : ""}`,
    },
  });

  if (error) {
    redirect("/error");
  }

  return redirect(data.url);
}
