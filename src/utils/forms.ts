// Small helpers shared by the form endpoints. Server-side only.

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

// Replace control characters with spaces, collapse whitespace, trim, cap the length.
export function cleanText(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== 'string') return '';
  const text = Array.from(value, (char) => {
    const code = char.charCodeAt(0);
    return code < 32 || code === 127 ? ' ' : char;
  }).join('');
  return text.replace(/\s+/g, ' ').trim().slice(0, max);
}

// Like cleanText, but keeps line breaks, for message bodies.
export function cleanMultiline(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== 'string') return '';
  const text = Array.from(value.replace(/\r\n?/g, '\n'), (char) => {
    const code = char.charCodeAt(0);
    return (code < 32 && code !== 10) || code === 127 ? ' ' : char;
  }).join('');
  return text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);
}

export function isEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Real visitors never see this hidden field. Bots tend to fill it in.
export function honeypotTripped(form: FormData): boolean {
  return cleanText(form.get('company'), 200) !== '';
}

// Each token can only be checked once.
export async function turnstilePassed(form: FormData, secret: string): Promise<boolean> {
  const token = cleanText(form.get('cf-turnstile-response'), 2048);
  if (!token) return false;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
