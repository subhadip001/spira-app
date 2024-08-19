"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GenerateBox from "./generate-box";

const queryClient = new QueryClient();

export default function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <GenerateBox />
    </QueryClientProvider>
  );
}
