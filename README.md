# i-studio.sk

Website of **i-studio** — an interior design studio in Stupava, Slovakia. Complete interiors from a single supplier: floors, doors, wardrobes, kitchens, custom furniture and tiling.

Built with [Astro 5](https://astro.build) as a fully static site. Slovak language only.

## Development

```bash
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # static build into dist/
```

## Adding photos

Two ways:

- **Admin (non-technical):** open `/admin` on the live site, log in, pick a category and drag photos in — add, delete, reorder. Saving commits to this repo and the site redeploys automatically. Runs on Decap CMS + Netlify Identity (enable *Identity* and *Git Gateway* in Netlify, registration invite-only, invite users by email).
- **Directly in the repo:** drop `.jpg`/`.png`/`.webp` files into `src/photos/<kategória>/` and add them to `src/data/galerie/<kategória>.json` (order in the JSON = order on the site). Responsive WebP thumbnails, lazy loading and the lightbox are automatic.

## Deployment

- **Netlify (testing):** auto-deploys from `main`. The contact form uses Netlify Forms (enable *Form detection* in site settings).
- **Websupport (production):** automated via GitHub Actions (`.github/workflows/deploy-websupport.yml`) — set the repo variable `WEBSUPPORT_DEPLOY=true` plus the FTP secrets listed in the workflow file, and every push to `main` builds and uploads `dist/` over FTP. Manual FTP upload of `dist/` works too. The contact form is handled by `api/contact.php` (PHP `mail()`); clean URLs and redirects from the old site are covered by the included `.htaccess`.

Before go-live, switch the form recipient in `public/api/contact.php` from the test address to `office@i-studio.sk`.
