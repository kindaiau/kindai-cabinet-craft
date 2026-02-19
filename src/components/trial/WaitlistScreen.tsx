import { useTrialContext } from "@/contexts/TrialContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Clock, LogOut, Mail } from "lucide-react";
import kindaiLogo from "@/assets/kindai-logo.png";

export function WaitlistScreen() {
  const { userEmail } = useTrialContext();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="mx-auto max-w-md text-center">
        <img src={kindaiLogo} alt="Kindai" className="mx-auto mb-8 h-16 w-16 rounded-2xl" />

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Clock className="h-4 w-4" />
          Trial Complete
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          You're on the{" "}
          <span className="text-gradient-kindai">waiting list!</span>
        </h1>

        <p className="mt-4 text-muted-foreground leading-relaxed">
          Thanks for trying Kindai. We're onboarding users in batches to ensure the best experience.
        </p>

        {userEmail && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>
              We'll notify you at{" "}
              <strong className="text-foreground">{userEmail}</strong>
            </span>
          </div>
        )}

        <p className="mt-6 text-sm text-muted-foreground">
          Want priority access? Email us at{" "}
          <a
            href="mailto:hello@kindai.com.au"
            className="font-medium text-primary hover:underline"
          >
            hello@kindai.com.au
          </a>
        </p>

        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="mt-8 text-muted-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
