// Utility to expose the app version for use across the app.
// Prefer Vite-injected env `import.meta.env.VITE_APP_VERSION`, then
// fall back to the build-time `__APP_VERSION__` define (if configured),
// otherwise return a sensible default.

export function getAppVersion() {
  // Prefer Vite env value (recommended for CI-injected versions).
  try {
    const v = import.meta?.env?.VITE_APP_VERSION;
    if (v) return String(v);
  } catch (e) {
    // ignore — not available in some runtimes
  }

  // Build-time global (set via vite.config.js define)
  if (typeof __APP_VERSION__ !== "undefined") {
    return String(__APP_VERSION__);
  }

  // Fallback
  return "dev";
}

export default getAppVersion;
