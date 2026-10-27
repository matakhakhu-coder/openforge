import type { APIRoute } from 'astro';
import { GITHUB_TOKEN, CONTACT_INBOX_REPO, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { cleanMultiline, cleanText, honeypotTripped, isEmail, json, turnstilePassed } from '../../utils/forms';

export const prerender = false;

// Keep submitted text from breaking out of the code block in the issue.
const fence = (value: string) => value.replace(/`/g, "'");

export const POST: APIRoute = async ({ request }) => {
  // Without the security check configured, the form stays closed.
  if (!GITHUB_TOKEN || !CONTACT_INBOX_REPO || !TURNSTILE_SECRET_KEY) {
    return json({ ok: false, message: 'The contact form is not available right now.' }, 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, message: 'Could not read the form.' }, 400);
  }

  // Pretend it worked so bots learn nothing.
  if (honeypotTripped(form)) return json({ ok: true, message: 'Thank you. Your message was received.' });

  const name = cleanText(form.get('name'), 80);
  const email = cleanText(form.get('email'), 254);
  const organization = cleanText(form.get('organization'), 120);
  const message = cleanMultiline(form.get('message'), 4000);
  const consent = form.get('consent') === 'on';

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = 'Enter your name.';
  if (!isEmail(email)) errors.email = 'Enter a valid email address.';
  if (message.length < 10) errors.message = 'Write a message of at least 10 characters.';
  if (!consent) errors.consent = 'Please tick the box to agree.';
  if (Object.keys(errors).length > 0) return json({ ok: false, errors }, 400);

  // Checked after the fields, so a typo does not use up the single-use token.
  if (!(await turnstilePassed(form, TURNSTILE_SECRET_KEY))) {
    return json({ ok: false, message: 'The security check failed. Please try again.' }, 400);
  }

  const sentAt = new Date().toISOString();
  const body = [
    'A message was sent through the OpenForge contact form.',
    '',
    '```text',
    `name:         ${fence(name)}`,
    `email:        ${fence(email)}`,
    `organisation: ${organization ? fence(organization) : '(not given)'}`,
    `consent:      ticked at ${sentAt}`,
    '```',
    '',
    'Message:',
    '',
    '```text',
    fence(message),
    '```',
    '',
    'To finish: reply by email, then close this issue. Delete it within the retention period on the privacy page.',
  ].join('\n');

  try {
    const response = await fetch(`https://api.github.com/repos/${CONTACT_INBOX_REPO}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
        'User-Agent': 'openforge-contact',
      },
      body: JSON.stringify({
        title: `Contact: ${name}`.slice(0, 200),
        body,
        labels: ['contact-message', 'needs-reply'],
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (response.status !== 201) {
      console.error(`Inbox returned status ${response.status}`);
      return json({ ok: false, message: 'We could not send your message. Please try again later.' }, 502);
    }
  } catch {
    console.error('Inbox request failed');
    return json({ ok: false, message: 'We could not send your message. Please try again later.' }, 502);
  }

  return json({ ok: true, message: 'Thank you. Your message was received.' });
};
