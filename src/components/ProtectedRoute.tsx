import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  requiredRole?: "talent" | "founder";
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to the correct dashboard if they are in the wrong place
    const targetDashboard = role === "founder" ? "/dashboard/founder" : "/dashboard";
    return <Navigate to={targetDashboard} replace />;
  }

  return <Outlet />;
};
