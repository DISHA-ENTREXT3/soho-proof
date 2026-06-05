import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initPostHog } from "./lib/posthog";

import { HelmetProvider } from "react-helmet-async";

// Initialise PostHog as early as possible so autocapture doesn't miss events
initPostHog();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
