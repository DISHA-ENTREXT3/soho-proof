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
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
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

const bottomItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const currentPath = location.pathname;

  // Strict check: if path starts with /dashboard/founder, we are in founder mode
  const isFounderMode = currentPath === "/dashboard/founder" || currentPath.startsWith("/dashboard/founder/");
  const mainItems = isFounderMode ? founderItems : talentItems;

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
              
              {isFounderMode && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/dashboard/challenges/create"
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
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  activeClassName="bg-primary/10 text-primary font-medium"
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="text-sm">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          
          <div className="my-2 px-3">
             <div className="h-px bg-border w-full" />
          </div>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button 
                onClick={() => navigate(isFounderMode ? "/dashboard" : "/dashboard/founder")}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 w-full mb-2 ${
                  isFounderMode 
                  ? "bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20" 
                  : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                }`}
              >
                {isFounderMode ? <Briefcase className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                {!collapsed && (
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {isFounderMode ? "Switch to Talent" : "Founders Portal"}
                  </span>
                )}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                 to={isFounderMode ? "/profile/jane-cooper" : "/profile/alex-rivera"}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors w-full"
              >
                <UserCircle className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm">
                    {isFounderMode ? "View Public Profile (Founder)" : "View Public Profile (Builder)"}
                  </span>
                )}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

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
