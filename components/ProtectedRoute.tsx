"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createBrowserClient(
    'https://yfiukvjyvhjrohiklcbf.supabase.co',
    'sb_publishable_o-9LqegWA6o-IPl3PPRtHQ_lHrhdya7'
  )

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router, supabase]);

  if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-indigo-500 font-black">VALIDANDO ACESSO...</div>;

  return <>{children}</>;
}