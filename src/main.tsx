import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initPostHog } from "./lib/posthog";

// Initialise PostHog as early as possible so autocapture doesn't miss events
initPostHog();

createRoot(document.getElementById("root")!).render(<App />);
