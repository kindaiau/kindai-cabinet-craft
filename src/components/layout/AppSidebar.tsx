import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, Calculator, DollarSign, FileText, FilePen, Package, Settings, Rocket, Wrench, KanbanSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import kindaiLogo from "@/assets/kindai-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Upload Plans", icon: Upload, path: "/upload" },
  { label: "Material Take-Off", icon: Calculator, path: "/takeoff" },
  { label: "Pricing", icon: DollarSign, path: "/pricing" },
  { label: "Estimates", icon: FileText, path: "/estimates" },
  { label: "Quote Builder", icon: FilePen, path: "/quotes" },
  { label: "Materials", icon: Package, path: "/materials" },
  { label: "Settings", icon: Settings, path: "/settings" },
  { label: "Estimator Suite", icon: Rocket, path: "/trade-apps" },
  { label: "Trade Workbench", icon: Wrench, path: "/trade-workbench" },
  { label: "Org Dashboard", icon: KanbanSquare, path: "/org-dashboard" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <aside className="relative flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground overflow-hidden">
      {/* Subtle glow accent at top */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[hsl(var(--primary)/0.06)] to-transparent" />

      {/* Logo */}
      <div className="relative flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="rounded-lg p-0.5 shadow-[0_0_12px_hsl(var(--primary)/0.3)]">
          <img src={kindaiLogo} alt="Kindai" className="h-8 w-8 rounded-lg" />
        </div>
        <span className="font-display text-xl font-bold tracking-tight text-gradient-kindai">
          Kindai
        </span>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[hsl(var(--primary)/0.1)] text-primary"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
              )}
              <item.icon className={cn("h-4 w-4 transition-colors", active && "drop-shadow-[0_0_4px_hsl(var(--primary)/0.5)]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="relative border-t border-sidebar-border px-3 py-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      {/* Bottom edge glow */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(var(--kindai-violet)/0.04)] to-transparent" />
    </aside>
  );
}
