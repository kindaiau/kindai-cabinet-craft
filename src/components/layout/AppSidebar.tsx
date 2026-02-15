import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, Calculator, DollarSign, FileText, FilePen, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import kindaiLogo from "@/assets/kindai-logo.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Upload Plans", icon: Upload, path: "/upload" },
  { label: "Material Take-Off", icon: Calculator, path: "/takeoff" },
  { label: "Pricing", icon: DollarSign, path: "/pricing" },
  { label: "Estimates", icon: FileText, path: "/estimates" },
  { label: "Quote Builder", icon: FilePen, path: "/quotes" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <img src={kindaiLogo} alt="Kindai" className="h-8 w-8 rounded-lg" />
        <span className="font-display text-xl font-bold tracking-tight text-gradient-kindai">
          Kindai
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-kindai-pink"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
