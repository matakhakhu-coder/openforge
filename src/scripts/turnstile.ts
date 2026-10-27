// Loads Cloudflare Turnstile only when a visitor first interacts with the form,
// so ordinary page views never contact Cloudflare.

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  getResponse: (widgetId?: string) => string | undefined;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loading: Promise<void> | undefined;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = undefined;
      reject(new Error('Turnstile failed to load'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

export interface TurnstileHandle {
  token: () => string | undefined;
  reset: () => void;
}

export async function mountTurnstile(
  container: HTMLElement,
  siteKey: string,
): Promise<TurnstileHandle | null> {
  try {
    await loadScript();
    if (!window.turnstile) return null;
    const widgetId = window.turnstile.render(container, { sitekey: siteKey, theme: 'auto' });
    return {
      token: () => window.turnstile?.getResponse(widgetId) || undefined,
      reset: () => window.turnstile?.reset(widgetId),
    };
  } catch {
    return null;
  }
}
