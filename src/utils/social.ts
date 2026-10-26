import { config } from '../config';
import type { SocialLink } from '../config';
import { httpsUrl } from './links';

// Icons are found by file name, so adding one needs no code change.
const iconFiles = import.meta.glob<string>('/src/assets/icons/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

export interface ActiveSocialLink extends SocialLink {
  svg: string;
}

// Only entries with a valid https address and an icon file are returned, in list order.
// The SVG comes from our own repository files at build time, so set:html is safe.
export function activeSocialLinks(): ActiveSocialLink[] {
  return config.social.flatMap((item) => {
    const url = httpsUrl(item.url);
    const raw = iconFiles[`/src/assets/icons/${item.platform}.svg`];
    if (!url || !raw) return [];
    const svg = raw
      .replace(/\s(?:width|height)="[^"]*"/g, '')
      .replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
    return [{ ...item, url, svg }];
  });
}
