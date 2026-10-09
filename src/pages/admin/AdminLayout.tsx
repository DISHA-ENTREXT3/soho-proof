import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard, Trophy, Users, Zap, Flag,
  Building2, Star, LogOut, ShieldCheck, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin",             label: "Overview",           icon: LayoutDashboard,  end: true },
  { to: "/admin/challenges",  label: "Challenge Manager",  icon: Zap },
  { to: "/admin/builders",    label: "Builder Rankings",   icon: Trophy },
  { to: "/admin/founders",    label: "Founder Rankings",   icon: Building2 },
  { to: "/admin/community",   label: "Community Showcase", icon: Users },
  { to: "/admin/featured",    label: "Feature & Badge",    icon: Star },
  { to: "/admin/waitlist",    label: "Waitlist Signups",   icon: Mail },
  { to: "/admin/reports",     label: "Reports",            icon: Flag },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Restrict to @entrext.com accounts only
  if (!user || !user.email?.endsWith("@entrext.com")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-card/60 backdrop-blur flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-lg tracking-tight">Soho Admin</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{user.email}</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, end }) => {
            const active = end
              ? location.pathname === to
              : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-primary/20 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
