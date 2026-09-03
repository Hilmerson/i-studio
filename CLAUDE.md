# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Git conventions

- **Never add a `Co-Authored-By: Claude ...` line (or any AI co-author/attribution) to commit messages.** Commits are authored solely by the repo owner.
- Commit messages in English, short imperative subject line.
- Push to `main` on GitHub (`Hilmerson/i-studio`); Netlify auto-deploys from it.
- **Batch pushes.** Netlify's free plan is credit-based (300 credits/month) and every production deploy costs 15 credits — that's ~20 deploys/month. Accumulate related changes into one commit/push instead of pushing per-fix. This constraint disappears after go-live (see `GOLIVE.md`), when Netlify builds are stopped and deploys run via GitHub Actions (free for public repos).

## Project overview

Remaster of **i-studio.sk** — an interior design studio in Stupava, Slovakia (owner's family business). Static Astro 5 site, **Slovak language only**.

- **Test hosting:** Netlify (auto-deploy from GitHub, uses Netlify Forms). Site name: `istudioweb`.
- **Production hosting:** Websupport (classic PHP/Apache hosting, deployed via FTP; uses `public/api/contact.php` + `.htaccess`). The switch-over procedure is documented step by step in `GOLIVE.md`.
- The site sets **no cookies** — analytics is cookieless Umami (script in `Base.astro`, guarded by `data-domains` so dev/test deploys aren't counted). No consent banner needed; the GDPR (`/gdpr`) and cookies (`/cookies`) pages describe this setup. Adding any cookie-setting tool (e.g. GA4) would require a banner and legal-page updates.

## Commands

- `npm run dev` — dev server on http://localhost:4321
- `npm run build` — static build into `dist/`

## Architecture

- `src/data/site.ts` — single source of truth: contact info, opening hours, the 6 product categories (slug, copy, brands), process steps. Years of experience is computed from `foundedYear` — never hardcode it.
- `src/pages/[kategoria].astro` — one dynamic route generates all 6 category pages from `categories` in `site.ts`.
- `src/components/Gallery.astro` — builds galleries at build time. Photo selection and order come from JSON manifests in `src/data/galerie/<slug>.json` (managed via Decap CMS at `/admin`); if a manifest is missing/empty it falls back to globbing `src/photos/<slug>/`. Includes the lightbox.
- `public/admin/` — Decap CMS (git-gateway backend + Netlify Identity). The owner manages gallery photos there; each save commits to `main`, which triggers Netlify build and (when enabled) the Websupport FTP deploy.
- `.github/workflows/deploy-websupport.yml` — FTP deploy to Websupport on push to `main`; inert until the repo variable `WEBSUPPORT_DEPLOY=true` and the FTP secrets are set (see comments in the file).
- `src/photos/hero/` — hero image only; excluded from galleries because no category uses that slug.
- `src/assets/tiles/` — 470×660 category side-images from the original site, used for homepage tiles (not galleries).
- `src/assets/i_studio.png` — original logo (header). `i_studio_footer.png` is a generated monochrome variant for the dark footer (regenerate with sharp if the logo changes).
- Fonts are self-hosted via `@fontsource-variable` (Fraunces + Inter) — do not add Google Fonts `<link>`s (GDPR).

## Contact form (dual-host)

The form in `src/pages/kontakt.astro` is a 4-step guided wizard (what / space & timing / details + attachments / contact) that degrades to one long form without JS (`html.js` gates the step UI). It works on both hosts:

- On **Netlify builds** (`process.env.NETLIFY` set), it submits via Netlify Forms with `action="/dakujeme"`.
- Otherwise it posts (multipart) to `public/api/contact.php` (PHP `mail()`, redirects to `/dakujeme` on success).
- **Option values** (categories, space type, state, timing, budget, contact channel) are whitelisted in `contact.php` — the lists in `kontakt.astro` and the PHP must stay in sync or the server silently drops the value.
- **Attachments:** max 5 files, 10 MB each, 20 MB total; JPEG/PNG/WebP/PDF only, type checked from content (finfo/magic bytes + `getimagesize`), attachment names are generated. Files are emailed as MIME attachments and never stored on the host. The browser downsizes photos to 2000 px JPEG before upload; a request over `post_max_size` gets a visible 413 page.
- **Recipient:** `office@i-studio.sk` (must be an existing Websupport mailbox with matching `-f` envelope sender, or the mail is silently discarded). Anti-spam layers: honeypot `web`, JS token `cas`, per-IP rate limit (10 *sent* messages/hour, temp-dir file; rejected attempts don't count), invalid-UTF-8 guard, link+no-diacritics heuristic, keyword blocklist — every rejection is a visible page with a Back button, never silent for humans.

## Conventions

- All visitor-facing text is Slovak. Keep the established tone: short, confident, professional.
- Design tokens live in `src/styles/global.css` (`--ink`, `--paper`, `--yellow`, spacing/type scales). Use tokens, not raw hex.
- Brand identity: black + yellow, the original i-studio logo. Minimal client-side JS (no frameworks — plain `<script>` only).
- Keep pages static — no SSR, no client directives. The site must deploy as plain files to Websupport FTP.
