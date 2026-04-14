import {
  LayoutDashboard,
  Trophy,
  Swords,
  Star,
  Settings,
  LogOut,
  Building2,
  Users,
  PlusCircle,
  Briefcase,
  UserCircle,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const talentItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Challenges", url: "/dashboard/challenges", icon: Swords },
  { title: "Founders", url: "/dashboard/founders", icon: Building2 },
  { title: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy },
  { title: "Reputation", url: "/dashboard/reputation", icon: Star },
];

const founderItems = [
  { title: "Founder Overview", url: "/dashboard/founder", icon: LayoutDashboard },
  { title: "My Challenges", url: "/dashboard/founder/challenges", icon: Briefcase },
  { title: "Talent Discovery", url: "/dashboard/founder/founders", icon: Users },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { user, signOut, role } = useAuth();

  // Role-based mode — driven by the Firestore role, not the URL
  const isFounderMode = role === "founder";
  const mainItems = isFounderMode ? founderItems : talentItems;

  // User initials for avatar
  const displayName = user?.displayName ?? user?.email ?? "User";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card/50">
      <SidebarContent>
        <div className="p-4">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
              <img src="/logo.png" alt="Soho Space Logo" className="w-full h-full object-cover" />
            </div>
            {!collapsed && (
              <span className="font-heading font-bold text-foreground tracking-tight">Soho Space</span>
            )}
          </a>
        </div>

        {/* User identity pill */}
        {!collapsed && (
          <div className="mx-3 mb-2 px-3 py-2 rounded-xl bg-secondary/40 border border-border flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-primary">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isFounderMode ? "text-accent" : "text-primary"}`}>
                {isFounderMode ? "Founder" : "Builder"}
              </p>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-4 text-[10px] uppercase tracking-widest font-bold mb-2">
            {isFounderMode ? "Founder Portal" : "Talent Portal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                      activeClassName="bg-primary/10 text-primary font-bold shadow-sm"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Post Challenge — founder only CTA */}
              {isFounderMode && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/dashboard/founder/challenges/create"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary bg-primary/5 hover:bg-primary/10 transition-all border border-dashed border-primary/20 mt-2"
                    >
                      <PlusCircle className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="text-sm font-semibold">Post Challenge</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="gap-1">

          {/* Settings — shared route */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/dashboard/settings"
                end
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                activeClassName="bg-primary/10 text-primary font-medium"
              >
                <Settings className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="text-sm">Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <div className="my-2 px-3">
            <div className="h-px bg-border w-full" />
          </div>

          {/* View Public Profile */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to={user ? `/profile/${user.uid}` : "/auth"}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors w-full"
              >
                <UserCircle className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm">View Public Profile</span>
                )}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Log Out */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="text-sm">Log Out</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
