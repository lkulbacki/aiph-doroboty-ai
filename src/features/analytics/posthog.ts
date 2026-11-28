import type { PostHog } from "posthog-js";
import { matchPath } from "react-router";
import type { Action } from "../prototype/model";

const routes = [
  "/",
  "/oferty",
  "/oferty/:slug",
  "/firmy/:slug",
  "/metodologia",
  "/polityka-prywatnosci",
  "/design-system/editaurus",
  "/auth/:mode",
  "/aplikuj/:slug",
  "/app",
  "/app/onboarding",
  "/app/profil",
  "/app/profil/podglad",
  "/app/zapisane",
  "/app/aplikacje",
  "/app/aplikacje/:id",
  "/app/aplikacje/:id/wyslano",
  "/app/oferty",
  "/app/oferty/:id",
  "/app/organizacja",
  "/app/kandydaci",
  "/app/kandydaci/:id",
  "/app/case",
  "/app/settings",
];

export function analyticsRoute(hash: string) {
  const pathname = hash.replace(/^#/, "").split(/[?#]/)[0] || "/";
  return routes.find((route) => matchPath({ path: route, end: true }, pathname)) ?? "/unknown";
}

// Keep SDK-added URLs, attribution, titles and any future unexpected data out.
const allowedProperties = new Set([
  "token",
  "distinct_id",
  "$device_id",
  "$process_person_profile",
  "$session_id",
  "$window_id",
  "$lib",
  "$lib_version",
  "$browser",
  "$browser_version",
  "$os",
  "$os_version",
  "$device_type",
  "$screen_height",
  "$screen_width",
  "$viewport_height",
  "$viewport_width",
  "route",
  "action",
]);

let client: PostHog | undefined;
let started = false;

export async function startAnalytics(config: { key?: string; host?: string; enabled: boolean }) {
  if (!config.enabled || !config.key?.trim() || !config.host?.trim() || started) return;
  started = true;
  try {
    const { default: posthog } = await import("posthog-js");
    posthog.init(config.key.trim(), {
      api_host: config.host.trim(),
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_dead_clicks: false,
      capture_performance: false,
      capture_exceptions: false,
      disable_session_recording: true,
      disable_surveys: true,
      disable_external_dependency_loading: true,
      advanced_disable_flags: true,
      advanced_disable_feature_flags: true,
      advanced_disable_feature_flags_on_first_load: true,
      person_profiles: "never",
      persistence: "memory",
      respect_dnt: true,
      before_send: (event) => {
        if (!event || !["$pageview", "prototype_action_completed"].includes(event.event))
          return null;
        event.properties = Object.fromEntries(
          Object.entries(event.properties ?? {}).filter(([key]) => allowedProperties.has(key)),
        );
        return event;
      },
    });
    client = posthog;
    const pageview = () => {
      try {
        posthog.capture("$pageview", { route: analyticsRoute(window.location.hash) });
      } catch {
        /* Analytics must never interrupt navigation. */
      }
    };
    pageview();
    window.addEventListener("hashchange", pageview);
  } catch {
    // Missing SDK/network access must not prevent the prototype from starting.
  }
}

export function trackAction(action: Action["type"]) {
  try {
    client?.capture("prototype_action_completed", {
      action,
      route: analyticsRoute(window.location.hash),
    });
  } catch {
    /* Analytics must never turn a successful operation into an error. */
  }
}
