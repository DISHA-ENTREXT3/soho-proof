import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initPostHog } from "./lib/posthog";

import { HelmetProvider } from "react-helmet-async";

// Initialise PostHog asynchronously after initial render to avoid blocking paint
if (typeof window !== "undefined") {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => initPostHog());
  } else {
    setTimeout(initPostHog, 1500);
  }
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
