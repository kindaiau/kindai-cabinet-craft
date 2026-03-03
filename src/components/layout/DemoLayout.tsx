import { Outlet } from "react-router-dom";
import { DemoProvider } from "@/contexts/DemoContext";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { DemoSidebar } from "@/components/layout/DemoSidebar";
import { DemoTour } from "@/components/demo/DemoTour";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import kindaiLogo from "@/assets/kindai-logo.webp";

export function DemoLayout() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <DemoProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <DemoBanner />

        {isMobile && (
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <img src={kindaiLogo} alt="Kindai" className="h-7 w-7 rounded-lg" width={28} height={28} />
              <span className="font-display text-lg font-bold tracking-tight text-gradient-kindai">Kindai</span>
            </div>
          </header>
        )}

        <div className="flex flex-1 overflow-hidden">
          {!isMobile && <DemoSidebar />}

          {isMobile && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent side="left" className="w-64 p-0">
                <VisuallyHidden><SheetTitle>Navigation</SheetTitle></VisuallyHidden>
                <DemoSidebar onNavClick={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
          )}

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>

        <DemoTour />
      </div>
    </DemoProvider>
  );
}
