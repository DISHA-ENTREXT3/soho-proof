import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import DashboardOverview from "./pages/DashboardOverview.tsx";
import DashboardChallenges from "./pages/DashboardChallenges.tsx";
import CreateChallenge from "./pages/CreateChallenge.tsx";
import ChallengeDetail from "./pages/ChallengeDetail.tsx";
import FoundersDirectory from "./pages/FoundersDirectory.tsx";
import DashboardLeaderboard from "./pages/DashboardLeaderboard.tsx";
import DashboardReputation from "./pages/DashboardReputation.tsx";
import DashboardSettings from "./pages/DashboardSettings.tsx";
import Auth from "./pages/Auth.tsx";
import FounderOverview from "./pages/FounderOverview.tsx";
import FounderProfileCreation from "./pages/FounderProfileCreation.tsx";
import PublicProfile from "./pages/PublicProfile.tsx";
import Pricing from "./pages/Pricing.tsx";

const queryClient = new QueryClient();

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import UpvoteWidget from "./components/UpvoteWidget";

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  {/* Talent Routes */}
                  <Route index element={<DashboardOverview />} />
                  <Route path="challenges" element={<DashboardChallenges />} />
                  <Route path="challenges/:id" element={<ChallengeDetail />} />
                  <Route path="founders" element={<FoundersDirectory />} />
                  <Route path="leaderboard" element={<DashboardLeaderboard />} />
                  <Route path="reputation" element={<DashboardReputation />} />
                  <Route path="settings" element={<DashboardSettings />} />

                  {/* Founder Routes (Strictly prefixed) */}
                  <Route path="founder">
                    <Route index element={<FounderOverview />} />
                    <Route path="profile" element={<FounderProfileCreation />} />
                    <Route path="challenges" element={<DashboardChallenges />} />
                    <Route path="challenges/create" element={<CreateChallenge />} />
                    <Route path="founders" element={<FoundersDirectory />} />
                    <Route path="settings" element={<DashboardSettings />} />
                  </Route>
                </Route>
              </Route>
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/profile/:id" element={<PublicProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <UpvoteWidget />
          </AuthProvider>

        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
