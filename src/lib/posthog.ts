import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST as string;

let initialized = false;

/**
 * Initialize PostHog once. Safe to call multiple times — subsequent calls are no-ops.
 */
export function initPostHog() {
  if (initialized || !POSTHOG_KEY) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST || "https://us.i.posthog.com",
    // Capture pageviews manually via React Router to avoid duplicate events
    capture_pageview: false,
    capture_pageleave: true,
    // Only create person profiles for identified (logged-in) users
    person_profiles: "identified_only",
    // Session recording
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
    },
    // Persistence
    persistence: "localStorage+cookie",
    // Respect user's tracking preferences
    respect_dnt: false,
    // Load feature flags on init
    bootstrap: {},
  });

  initialized = true;
}

/**
 * Identify the authenticated user in PostHog.
 * Call this when auth state changes (login / profile update).
 */
export function identifyUser(
  userId: string,
  properties?: {
    email?: string | null;
    name?: string | null;
    role?: string | null;
    [key: string]: unknown;
  }
) {
  posthog.identify(userId, {
    ...(properties?.email && { email: properties.email }),
    ...(properties?.name && { name: properties.name }),
    ...(properties?.role && { role: properties.role }),
  });
}

/**
 * Reset PostHog identity on sign-out.
 */
export function resetPostHogUser() {
  posthog.reset();
}

/**
 * Capture a manual pageview for the current path.
 */
export function capturePageView(path: string) {
  posthog.capture("$pageview", { $current_url: window.location.origin + path });
}

export default posthog;
