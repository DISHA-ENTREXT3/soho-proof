import { useEffect, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LazyMotion } from "framer-motion";
import MonkFeedWidget from "./components/MonkFeedWidget";
import { capturePageView } from "@/lib/posthog";

const loadFeatures = () => import("@/lib/framer-features").then((res) => res.default);

// Static import for Landing page for instant LCP
import Index from "./pages/Index.tsx";

// Lazy load all secondary and dashboard routes
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout.tsx"));
const DashboardOverview = lazy(() => import("./pages/DashboardOverview.tsx"));
const DashboardChallenges = lazy(() => import("./pages/DashboardChallenges.tsx"));
const CreateChallenge = lazy(() => import("./pages/CreateChallenge.tsx"));
const ManageChallenge = lazy(() => import("./pages/ManageChallenge.tsx"));
const ChallengeDetail = lazy(() => import("./pages/ChallengeDetail.tsx"));
const FoundersDirectory = lazy(() => import("./pages/FoundersDirectory.tsx"));
const DashboardLeaderboard = lazy(() => import("./pages/DashboardLeaderboard.tsx"));
const DashboardReputation = lazy(() => import("./pages/DashboardReputation.tsx"));
const DashboardSettings = lazy(() => import("./pages/DashboardSettings.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const FounderOverview = lazy(() => import("./pages/FounderOverview.tsx"));
const FounderProfileCreation = lazy(() => import("./pages/FounderProfileCreation.tsx"));
const FounderMessages = lazy(() => import("./pages/FounderMessages.tsx"));
const PublicProfile = lazy(() => import("./pages/PublicProfile.tsx"));
const Pricing = lazy(() => import("./pages/Pricing.tsx"));
const TalentOnboarding = lazy(() => import("./pages/TalentOnboarding.tsx"));
const FounderOnboarding = lazy(() => import("./pages/FounderOnboarding.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsConditions = lazy(() => import("./pages/TermsConditions.tsx"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy.tsx"));
const DisclaimerRefund = lazy(() => import("./pages/DisclaimerRefund.tsx"));
const BlogList = lazy(() => import("./pages/BlogList.tsx"));
const BlogDetail = lazy(() => import("./pages/BlogDetail.tsx"));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

/** Fires a PostHog $pageview on every React Router navigation */
function PostHogPageTracker() {
  const location = useLocation();
  useEffect(() => {
    capturePageView(location.pathname + location.search);
  }, [location]);
  return null;
}

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <LazyMotion features={loadFeatures} strict={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PostHogPageTracker />
            <AuthProvider>
              <Suspense fallback={<PageFallback />}>
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
                        <Route path="messages" element={<FounderMessages />} />
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
                        <Route path="challenges/:id/manage" element={<ManageChallenge />} />
                        <Route path="messages" element={<FounderMessages />} />
                        <Route path="founders" element={<FoundersDirectory />} />
                      </Route>

                    </Route>
                  </Route>
                  <Route path="/profile/:id" element={<PublicProfile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <MonkFeedWidget />
            </AuthProvider>

          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </LazyMotion>
  </ThemeProvider>
);

export default App;
