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
import TalentOnboarding from "./pages/TalentOnboarding.tsx";
import FounderOnboarding from "./pages/FounderOnboarding.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsConditions from "./pages/TermsConditions.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";
import DisclaimerRefund from "./pages/DisclaimerRefund.tsx";
import BlogList from "./pages/BlogList.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";

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
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/disclaimer" element={<DisclaimerRefund />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blogs/:slug" element={<BlogDetail />} />

              {/* Onboarding — requires auth, no role guard, skips onboarding check */}
              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding/talent" element={<TalentOnboarding />} />
                <Route path="/onboarding/founder" element={<FounderOnboarding />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>

                  {/* Shared routes — accessible by any authenticated user */}
                  <Route path="settings" element={<DashboardSettings />} />

                  {/* Talent-only routes */}
                  <Route element={<ProtectedRoute requiredRole="talent" />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="challenges" element={<DashboardChallenges />} />
                    <Route path="challenges/:id" element={<ChallengeDetail />} />
                    <Route path="founders" element={<FoundersDirectory />} />
                    <Route path="leaderboard" element={<DashboardLeaderboard />} />
                    <Route path="reputation" element={<DashboardReputation />} />
                  </Route>

                  {/* Founder-only routes */}
                  <Route path="founder" element={<ProtectedRoute requiredRole="founder" />}>
                    <Route index element={<FounderOverview />} />
                    <Route path="profile" element={<FounderProfileCreation />} />
                    <Route path="challenges" element={<DashboardChallenges />} />
                    <Route path="challenges/create" element={<CreateChallenge />} />
                    <Route path="founders" element={<FoundersDirectory />} />
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
