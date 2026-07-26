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

Galleries are generated at build time from folders:

```
src/photos/
  podlahy/   dvere/   skrine/   kuchyne/   nabytok/   obklady/
```

Drop `.jpg`/`.png`/`.webp` files into the right folder and rebuild — responsive WebP thumbnails, lazy loading and the lightbox are handled automatically.

## Deployment

- **Netlify (testing):** auto-deploys from `main`. The contact form uses Netlify Forms (enable *Form detection* in site settings).
- **Websupport (production):** upload the contents of `dist/` via FTP. The contact form is handled by `api/contact.php` (PHP `mail()`); clean URLs and redirects from the old site are covered by the included `.htaccess`.

Before go-live, switch the form recipient in `public/api/contact.php` from the test address to `office@i-studio.sk`.
