// Own profiles. An entry shows only when its url is a valid https address, so an empty url hides it.
// To add a link: paste its address into the matching url in the social list below.
// To add a new platform: add its name here, add a line to the list, and drop its SVG in src/assets/icons/.
export type SocialPlatform = 'linkedin' | 'youtube' | 'github' | 'bluesky' | 'facebook';
export interface SocialLink { platform: SocialPlatform; label: string; url: string }
export const config = {
  contactEmail: 'rileynotbishop@gmail.com' as string | null,
  contactPhone: '+27 713 572 252' as string | null,
  repoUrl: 'https://github.com/matakhakhu-coder/openforge' as string | null,
  social: [
    { platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/matamela-ramovha-48412b29a' },
    { platform: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@JustTheMachine-i1s' },
    { platform: 'github', label: 'GitHub', url: 'https://github.com/matakhakhu-coder' },
    { platform: 'bluesky', label: 'Bluesky', url: '' },
    { platform: 'facebook', label: 'Facebook', url: '' },
  ] as SocialLink[],
  // Share links on posts are plain URLs, with no scripts or tracking.
  shareNetworks: ['linkedin', 'bluesky'] as ('linkedin' | 'bluesky')[],
  // External embeds are off by default. When off, a post shows a plain link instead.
  embeds: { youtube: false },
};
