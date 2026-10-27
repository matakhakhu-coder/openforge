import { mountTurnstile, type TurnstileHandle } from './turnstile';

type Tone = 'info' | 'error' | 'success';

interface ApiResult {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
}

function init(form: HTMLFormElement) {
  const endpoint = form.dataset.endpoint ?? '';
  const siteKey = form.dataset.siteKey ?? '';
  const container = form.querySelector<HTMLElement>('[data-turnstile]');
  const status = form.querySelector<HTMLElement>('[data-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!endpoint || !status || !button) return;

  let handle: TurnstileHandle | null = null;
  let mounting: Promise<void> | undefined;

  const setStatus = (message: string, tone: Tone) => {
    status.textContent = message;
    status.dataset.tone = tone;
    status.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  };

  // The security check loads on first interaction with the form.
  const ensureWidget = () => {
    if (!container || !siteKey || mounting) return;
    mounting = mountTurnstile(container, siteKey).then((result) => {
      handle = result;
    });
  };
  form.addEventListener('focusin', ensureWidget, { once: true });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (siteKey) {
      ensureWidget();
      await mounting;
      if (!handle?.token()) {
        setStatus('Please wait for the security check to finish, then try again.', 'error');
        return;
      }
    }

    const data = new FormData(form);
    const token = handle?.token();
    if (token) data.set('cf-turnstile-response', token);

    button.disabled = true;
    setStatus('Sending...', 'info');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      const result = (await response.json()) as ApiResult;

      if (response.ok && result.ok) {
        form.reset();
        setStatus(result.message ?? 'Thank you.', 'success');
      } else {
        const detail = result.errors
          ? Object.values(result.errors).join(' ')
          : (result.message ?? 'Something went wrong. Please try again.');
        setStatus(detail, 'error');
      }
    } catch {
      setStatus('Network problem. Please try again.', 'error');
    } finally {
      handle?.reset();
      button.disabled = false;
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-submit-form]').forEach(init);
