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
| 4 | FORGE export adapter, off by default | importer done, FORGE exporter not started |

## Protocol

1. Audit what exists.
2. Weigh the options.
3. Flag deficits.
4. Proceed one step at a time.


## Flagged deficits

| Deficit | Gate |
|---|---|
| None open | |

## Rules

| Rule | Detail |
|---|---|
| FORGE imports are add-only | The importer never edits an existing record and skips any URL already listed |
| Imports arrive unverified | Imported records are forced to unverified, low confidence, no checked date |
| Importer is off by default | scripts/forge-import.config.json must be switched on and given an inputPath |