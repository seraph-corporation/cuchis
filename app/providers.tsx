"use client";

// Authentication removed as per user request
// import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  // return <SessionProvider basePath="/api/auth">{children}</SessionProvider>;
  return <>{children}</>;
}
