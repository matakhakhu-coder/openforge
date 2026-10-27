// @ts-check
import { existsSync } from 'node:fs';
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

// The function entry imports rolldown, and Vercel's file tracing does not copy rolldown's native
// Linux binding. Include it explicitly. It exists only on Linux installs such as Vercel's build.
const rolldownLinuxBinding = ['package.json', 'rolldown-binding.linux-x64-gnu.node']
  .map((file) => `./node_modules/@rolldown/binding-linux-x64-gnu/${file}`)
  .filter((file) => existsSync(file));

// https://astro.build/config
export default defineConfig({
  // Single source of truth for the domain. Change it here if a custom domain is added.
  site: 'https://openforge-two.vercel.app',
  adapter: vercel({ includeFiles: rolldownLinuxBinding }),
  env: {
    schema: {
      GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_INBOX_REPO: envField.string({ context: 'server', access: 'secret', optional: true }),
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
