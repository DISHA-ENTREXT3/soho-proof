import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const DashboardLayout = () => {
  const { user, role } = useAuth();

  const displayName = user?.displayName ?? user?.email ?? "User";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isFounderMode = role === "founder";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card/30 backdrop-blur-sm sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="ml-auto flex items-center gap-3">
              {/* Role badge */}
              <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                isFounderMode
                  ? "bg-accent/10 text-accent border-accent/20"
                  : "bg-primary/10 text-primary border-primary/20"
              }`}>
                {isFounderMode ? "Founder" : "Builder"}
              </span>
              {/* User avatar */}
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/10">
                <span className="text-xs font-bold text-primary">{initials}</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
