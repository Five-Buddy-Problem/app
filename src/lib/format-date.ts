export function formatDate(date: Date) {
  const now = new Date();

  const diff = now.getTime() - date.getTime();

  if (diff < 1000) {
    return "just now";
  } else if (diff < 60 * 1000) {
    return `${Math.floor(diff / 1000)} seconds ago`;
  } else if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))} minute(s) ago`;
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))} hour(s) ago`;
  } else if (diff < 30 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))} day(s) ago`;
  } else if (diff < 12 * 30 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (30 * 24 * 60 * 60 * 1000))} month(s) ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}
