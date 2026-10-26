export const config = {
  contactEmail: 'rileynotbishop@gmail.com' as string | null,
  repoUrl: 'https://github.com/matakhakhu-coder/openforge' as string | null,
  // Own profiles. Shown in the footer only when set.
  social: { linkedin: null, bluesky: null, github: null } as Record<'linkedin' | 'bluesky' | 'github', string | null>,
  // Share links on posts are plain URLs, with no scripts or tracking.
  shareNetworks: ['linkedin', 'bluesky'] as ('linkedin' | 'bluesky')[],
  // External embeds are off by default. When off, a post shows a plain link instead.
  embeds: { youtube: false },
};
