export function getStoragePathFromUrl(url) {
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/o\/(.+)/);
    if (!match) return null;
    return decodeURIComponent(match[1]);
  } catch (err) {
    return null;
  }
}
