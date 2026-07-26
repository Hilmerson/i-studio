# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Git conventions

- **Never add a `Co-Authored-By: Claude ...` line (or any AI co-author/attribution) to commit messages.** Commits are authored solely by the repo owner.
- Commit messages in English, short imperative subject line.
- Push to `main` on GitHub (`Hilmerson/i-studio`); Netlify auto-deploys from it.

## Project overview

Remaster of **i-studio.sk** — an interior design studio in Stupava, Slovakia (owner's family business). Static Astro 5 site, **Slovak language only**.

- **Test hosting:** Netlify (auto-deploy from GitHub, uses Netlify Forms).
- **Production hosting:** Websupport (classic PHP/Apache hosting, deployed via FTP; uses `public/api/contact.php` + `.htaccess`).

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

The form in `src/pages/kontakt.astro` works on both hosts:

- On **Netlify builds** (`process.env.NETLIFY` set), it submits via Netlify Forms with `action="/dakujeme"`.
- Otherwise it posts to `public/api/contact.php` (PHP `mail()`, honeypot field `web`, redirects to `/dakujeme` on success).
- **Recipient:** `contact.php` currently sends to the test address `vktrhilmer21@gmail.com`; switch to `office@i-studio.sk` before production go-live (marked with a comment in the file).

## Conventions

- All visitor-facing text is Slovak. Keep the established tone: short, confident, professional.
- Design tokens live in `src/styles/global.css` (`--ink`, `--paper`, `--yellow`, spacing/type scales). Use tokens, not raw hex.
- Brand identity: black + yellow, the original i-studio logo. Minimal client-side JS (no frameworks — plain `<script>` only).
- Keep pages static — no SSR, no client directives. The site must deploy as plain files to Websupport FTP.
