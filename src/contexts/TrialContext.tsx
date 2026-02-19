import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

const TRIAL_DURATION_SECONDS = 300; // 5 minutes

type AccountStatus = "trial" | "waitlisted" | "active";

interface TrialContextValue {
  timeRemaining: number;
  isTrialExpired: boolean;
  accountStatus: AccountStatus;
  userEmail: string | null;
  isLoading: boolean;
}

const TrialContext = createContext<TrialContextValue | undefined>(undefined);

export function useTrialContext() {
  const ctx = useContext(TrialContext);
  if (!ctx) throw new Error("useTrialContext must be used within TrialProvider");
  return ctx;
}

export function TrialProvider({ children }: { children: ReactNode }) {
  const [accountStatus, setAccountStatus] = useState<AccountStatus>("trial");
  const [trialStartedAt, setTrialStartedAt] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(TRIAL_DURATION_SECONDS);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasSetWaitlisted = useRef(false);

  // Fetch profile on mount
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserEmail(user.email ?? null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("trial_started_at, account_status")
        .eq("user_id", user.id)
        .single();

      if (!profile) {
        setIsLoading(false);
        return;
      }

      const status = (profile.account_status as AccountStatus) || "trial";
      setAccountStatus(status);

      if (status === "active" || status === "waitlisted") {
        setIsLoading(false);
        return;
      }

      // Status is "trial" — ensure trial_started_at is set
      if (!profile.trial_started_at) {
        const now = new Date().toISOString();
        await supabase
          .from("profiles")
          .update({ trial_started_at: now } as any)
          .eq("user_id", user.id);
        setTrialStartedAt(now);
      } else {
        setTrialStartedAt(profile.trial_started_at as string);
      }

      setIsLoading(false);
    }

    init();
  }, []);

  // Countdown interval
  useEffect(() => {
    if (accountStatus !== "trial" || !trialStartedAt) return;

    function tick() {
      const elapsed = (Date.now() - new Date(trialStartedAt!).getTime()) / 1000;
      const remaining = Math.max(0, TRIAL_DURATION_SECONDS - elapsed);
      setTimeRemaining(Math.ceil(remaining));

      if (remaining <= 0 && !hasSetWaitlisted.current) {
        hasSetWaitlisted.current = true;
        setAccountStatus("waitlisted");
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            supabase
              .from("profiles")
              .update({ account_status: "waitlisted" } as any)
              .eq("user_id", user.id)
              .then(() => {});
          }
        });
      }
    }

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [accountStatus, trialStartedAt]);

  return (
    <TrialContext.Provider
      value={{
        timeRemaining,
        isTrialExpired: accountStatus === "waitlisted",
        accountStatus,
        userEmail,
        isLoading,
      }}
    >
      {children}
    </TrialContext.Provider>
  );
}
