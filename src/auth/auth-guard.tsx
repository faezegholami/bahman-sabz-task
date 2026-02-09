"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


type AuthGuardProps = {
  children: React.ReactNode;
};
import { useContext } from 'react';
import { AuthContext } from "./auth-provider";
import Loading from "../app/loading";


// ----------------------------------------------------------------------

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuthContext context must be use inside AuthProvider');

  return context;
};
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { authenticated, loading } = useAuthContext();

  // const pathname = usePathname();

  useEffect(() => {
    if (!loading && !authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.href,
      }).toString();

      if (!searchParams.includes("/login")) {
        const href = `/login?${searchParams}`;
        router.replace(href);
      } else {
        window.location.href = "/";
      }
    }
  }, [authenticated, loading, router]);


  if (loading) return <Loading />;
  // if (!authenticated) return <Loading />;

  return <>{children}</>;
}
