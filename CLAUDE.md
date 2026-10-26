# OpenForge

Public, read-only portal of South African civic data sources and tools. Every entry carries provenance.

| Item | Value |
|---|---|
| Stack | Astro, content collections, Vercel |
| Repo path | C:\Users\matam\Projects\openforge |
| Data | JSON/MDX files in src/content, no backend in v1 |
| Rule | Any external dependency is a mechanism with a config switch, never hardcoded |

## Phases

| Phase | Scope | Status |
|---|---|---|
| 0 | Scaffold and protocol | done |
| 1 | Resource schema with provenance, directory and search | done |
| 2 | Projects catalog and detail pages | done |
| 3 | Landing and About | done |
| 4 | FORGE export adapter, off by default | not started |

## Protocol

1. Audit what exists.
2. Weigh the options.
3. Flag deficits.
4. Proceed one step at a time.


## Flagged deficits

| Deficit | Gate |
|---|---|
| npm audit reports critical Astro advisories on Astro 6 (fix is Astro 7.3.8 or newer) | Upgrade Node 22 to 22.23.4 or newer, then Astro 7, before the first deploy |
