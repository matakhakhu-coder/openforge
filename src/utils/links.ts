// Cleans a link taken from config. Returns an https address, or null when the value is empty,
// malformed or unsafe, so a mistyped value hides the element instead of rendering a dead link.
export function httpsUrl(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}
