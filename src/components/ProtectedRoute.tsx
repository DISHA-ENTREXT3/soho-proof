import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  requiredRole?: "talent" | "founder";
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, role, onboardingComplete, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated → send to auth
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Authenticated but onboarding not done → enforce the role-specific onboarding page
  if (!onboardingComplete) {
    const onboardingPath = role === "founder" ? "/onboarding/founder" : "/onboarding/talent";
    if (location.pathname !== onboardingPath) {
      return <Navigate to={onboardingPath} replace />;
    }
  }

  // Already completed onboarding → redirect away from onboarding pages to main dashboard
  if (onboardingComplete && location.pathname.startsWith("/onboarding")) {
    const targetDashboard = role === "founder" ? "/dashboard/founder" : "/dashboard";
    return <Navigate to={targetDashboard} replace />;
  }

  // Wrong role → redirect to their correct dashboard
  if (requiredRole && role !== requiredRole) {
    const targetDashboard = role === "founder" ? "/dashboard/founder" : "/dashboard";
    return <Navigate to={targetDashboard} replace />;
  }

  return <Outlet />;
};
