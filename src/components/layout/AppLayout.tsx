import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import kindaiLogo from "@/assets/kindai-logo.png";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTrialContext } from "@/contexts/TrialContext";
import { TrialBanner } from "@/components/trial/TrialBanner";
import { WaitlistScreen } from "@/components/trial/WaitlistScreen";

export function AppLayout() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { accountStatus, isLoading } = useTrialContext();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (accountStatus === "waitlisted") {
    return <WaitlistScreen />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Trial banner */}
      {accountStatus === "trial" && <TrialBanner />}

      {/* Mobile top bar */}
      {isMobile && (
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img src={kindaiLogo} alt="Kindai" className="h-7 w-7 rounded-lg" />
            <span className="font-display text-lg font-bold tracking-tight text-gradient-kindai">Kindai</span>
          </div>
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        {!isMobile && <AppSidebar />}

        {/* Mobile sheet sidebar */}
        {isMobile && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="w-64 p-0">
              <VisuallyHidden><SheetTitle>Navigation</SheetTitle></VisuallyHidden>
              <AppSidebar onNavClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        )}

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
