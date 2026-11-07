# OpenForge

The source code for the [OpenForge website](https://openforge-two.vercel.app/), built with Astro. It has a landing page, an About page, a Jobs page, a projects catalogue, a blog, a contact page with a working contact form, and a privacy page.

Most of the content is placeholder, written to show how the site is put together. It is not a finished product, and none of the listings should be relied on.

## What is in here

- Astro 7 with the Vercel adapter: static pages plus one serverless route for the contact form.
- Content kept as Markdown files under `src/content` (posts, projects, tools).
- Site-wide details such as contact links and form settings in `src/config.ts`.
- IBM Plex Sans and JetBrains Mono, served locally through Fontsource.

## Run it locally

```sh
npm install
npm run dev
```

The contact form needs four environment variables, listed in `.env.example`: a GitHub token and an inbox repository (messages arrive as private issues) and two Cloudflare Turnstile keys. Without them, set `forms.contact` to `false` in `src/config.ts` and the contact page shows only the email and phone number.

## Author

Built by [Matamela Ramovha](https://matamelaramovha.co.za/about/).

## Licence

MIT. See the LICENSE file.