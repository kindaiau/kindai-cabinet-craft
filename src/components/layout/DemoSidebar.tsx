import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, Calculator, FilePen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import kindaiLogo from "@/assets/kindai-logo.webp";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/demo", tourKey: "dashboard" },
  { label: "Upload Plans", icon: Upload, path: "/demo/upload", tourKey: "upload" },
  { label: "Material Take-Off", icon: Calculator, path: "/demo/takeoff", tourKey: "takeoff" },
  { label: "Quote Builder", icon: FilePen, path: "/demo/quotes", tourKey: "quotes" },
];

export function DemoSidebar({ onNavClick }: { onNavClick?: () => void } = {}) {
  const location = useLocation();

  return (
    <aside className="relative flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[hsl(var(--primary)/0.06)] to-transparent" />

      <div className="relative flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="rounded-lg p-0.5 shadow-[0_0_12px_hsl(var(--primary)/0.3)]">
          <img src={kindaiLogo} alt="Kindai" className="h-8 w-8 rounded-lg" width={32} height={32} />
        </div>
        <span className="font-display text-xl font-bold tracking-tight text-gradient-kindai">Kindai</span>
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">Demo</span>
      </div>

      <nav className="relative flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavClick}
              data-tour={item.tourKey}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[hsl(var(--primary)/0.1)] text-primary"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
              )}
              <item.icon className={cn("h-4 w-4 transition-colors", active && "drop-shadow-[0_0_4px_hsl(var(--primary)/0.5)]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative border-t border-sidebar-border px-3 py-4">
        <Link to="/auth?signup=true">
          <Button className="w-full gradient-energy border-0 font-semibold text-sm shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
            Start Free Trial <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(var(--kindai-violet)/0.04)] to-transparent" />
    </aside>
  );
}
