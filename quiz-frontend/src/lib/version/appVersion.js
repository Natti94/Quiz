export function getAppVersion() {
  try {
    const v = import.meta?.env?.VITE_APP_VERSION;
    if (v) return String(v);
  } catch (e) {}

  if (typeof __APP_VERSION__ !== "undefined") {
    return String(__APP_VERSION__);
  }

  return "dev";
}

export default getAppVersion;
