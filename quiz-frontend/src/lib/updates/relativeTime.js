export function formatRelativeTime(dateString) {
  if (!dateString || /ago$/.test(dateString)) return dateString;
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (isNaN(diff)) return dateString;
  if (diff < 60) return `${diff} second${diff !== 1 ? "s" : ""} ago`;
  const min = Math.floor(diff / 60);
  if (min < 60) return `${min} minute${min !== 1 ? "s" : ""} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr !== 1 ? "s" : ""} ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day !== 1 ? "s" : ""} ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo} month${mo !== 1 ? "s" : ""} ago`;
  const yr = Math.floor(mo / 12);
  return `${yr} year${yr !== 1 ? "s" : ""} ago`;
}

export default formatRelativeTime;
