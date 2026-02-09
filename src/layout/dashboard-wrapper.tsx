"use client";

import React, { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthGuard from "../auth/auth-guard";
import { ChakraProvider  } from "@chakra-ui/react";
import { system } from "../utils/rtl-cache";
export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <ChakraProvider value={system}>{children}</ChakraProvider>
      </AuthGuard>
    </QueryClientProvider>
  );
}
