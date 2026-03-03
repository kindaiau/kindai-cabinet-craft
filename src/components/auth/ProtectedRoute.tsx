import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import AccessGate from "@/pages/AccessGate";
import { trackEvent } from "@/lib/analytics";

type AccountStatus = "waitlisted" | "demo_active" | "trial_active" | "expired";

export default function ProtectedRoute() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [status, setStatus] = useState<AccountStatus | null>(null);

  const loadStatus = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("account_status")
      .eq("user_id", userId)
      .maybeSingle();

    const currentStatus = (data?.account_status as AccountStatus | null) ?? "waitlisted";
    setStatus(currentStatus);

    if (currentStatus === "trial_active") {
      trackEvent("trial_started", { source: "protected_route" });
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession?.user?.id) {
          void loadStatus(nextSession.user.id);
        } else {
          setStatus(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        void loadStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadStatus]);

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" replace />;

  if (status && status !== "trial_active") {
    return <AccessGate status={status} onRefresh={() => void loadStatus(session.user.id)} />;
  }

  return <Outlet />;
}
