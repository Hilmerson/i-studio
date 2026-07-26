# Go-live guide — moving to production (Websupport)

Step-by-step checklist for switching i-studio.sk from the Netlify test deployment to
production hosting on Websupport. Work through it top to bottom; nothing here is destructive
until step 5, and each step can be verified before moving on.

## 0. Pre-flight — content

- [ ] Dad's final, filtered photos are loaded (via `/admin` or directly in `src/photos/` + `src/data/galerie/*.json`).
- [ ] Facts in `src/data/site.ts` verified: `foundedYear` (drives the "rokov skúseností" number), opening hours, phone, addresses.
- [ ] Category side-images in `src/assets/tiles/` swapped if dad wants newer ones (one file per category slug).
- [ ] Click through the Netlify site one last time — it is exactly what production will be.

## 1. Switch the contact form recipient

In `public/api/contact.php`, flip the recipient from the test address to production
(the two lines are marked with a comment):

```php
$to      = 'office@i-studio.sk';
// $to   = 'vktrhilmer21@gmail.com';
```

Commit — but you can fold this into the same push as step 3 to save a deploy.

## 2. Get FTP credentials from Websupport

In the Websupport admin panel find the FTP access for the `i-studio.sk` webspace:

- **Host** — usually the domain itself or something like `ftp.websupport.sk`
- **Username / password** — create a dedicated FTP account if possible
- **Web root directory** — the folder the domain serves from, typically `/web/`

Also check in the Websupport admin that **SSL (HTTPS) is enabled** for the domain — usually
a free Let's Encrypt toggle. The old site already ran on HTTPS, so this is likely done.

## 3. Enable the GitHub Actions FTP deploy

In the GitHub repo (`Hilmerson/i-studio`) → **Settings → Secrets and variables → Actions**:

Variables tab:

| Variable | Value |
|---|---|
| `WEBSUPPORT_DEPLOY` | `true` |

Secrets tab:

| Secret | Value |
|---|---|
| `WEBSUPPORT_FTP_HOST` | FTP host from step 2 |
| `WEBSUPPORT_FTP_USER` | FTP username |
| `WEBSUPPORT_FTP_PASSWORD` | FTP password |
| `WEBSUPPORT_FTP_DIR` | web root, e.g. `/web/` |

Then push to `main` (or run the workflow manually: **Actions → Deploy to Websupport →
Run workflow**). The first run uploads everything (~60+ photos, takes a few minutes);
later runs upload only changed files.

GitHub Actions is free for public repos — deploys cost nothing, so there is no reason
to batch pushes anymore after this point.

## 4. Verify production

On https://www.i-studio.sk check:

- [ ] Homepage, all 6 categories, `/realizacie`, `/kontakt` load with images.
- [ ] Clean URLs work (`/kuchyne` — handled by `.htaccess` rewrite).
- [ ] Old URLs redirect: `/contact.html` → `/kontakt`, `/realizacie_galeria_kuchyne.html` → `/kuchyne`.
- [ ] **Contact form**: submit a test message, confirm it arrives at `office@i-studio.sk`
      and that the browser lands on `/dakujeme`. Check the spam folder — PHP `mail()` from
      shared hosting sometimes lands there. If deliverability is bad, switch the script to
      authenticated SMTP via a real Websupport mailbox (ask Claude).
- [ ] HTTPS works and HTTP redirects to HTTPS (Websupport setting).

## 5. Wind down Netlify builds (keep the admin login!)

Netlify's free plan allows only ~20 deploys/month (300 credits, 15 per deploy), so once
Websupport serves production we stop consuming them:

1. **Point the admin at Netlify's auth explicitly.** In `public/admin/config.yml`, uncomment
   the `identity_url` + `gateway_url` lines (already prepared, pointing at the Netlify site).
   This lets the `/admin` served from **Websupport** keep using Netlify's login and Git Gateway.
2. Push (this triggers the Websupport deploy with the updated admin).
3. In Netlify: **Site configuration → Build & deploy → Build settings → Stop builds.**
   - Do **NOT** disable Identity or Git Gateway — dad's login runs through them and they
     work fine with builds stopped.
4. Optional: in Netlify **Forms**, disable notifications (production submissions now go
   through PHP, not Netlify Forms).

After this: dad publishes in `/admin` → commit to GitHub → GitHub Action builds and
FTP-deploys to Websupport. Netlify does nothing but authentication. Zero credits burned.

## 6. Post-launch

- Tell dad: in `/admin`, upload/reorder everything first, then click **Publikovať** once —
  each publish is a full deploy (~2–3 min until changes are live).
- Watch `office@i-studio.sk` for form submissions the first week (spam folder too).
- Google Search Console: the sitemap/structured data are in place; submitting the domain
  is optional but helps Google pick up the redesign faster.
- If analytics is ever wanted: adding GA4 requires updating `/gdpr` + `/cookies` and adding
  a consent banner — the current pages promise "no tracking".
