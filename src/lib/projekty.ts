import type { ImageMetadata } from 'astro';
import { photo } from './photos';
import { categories } from '../data/site';

/* Projekty (prípadové štúdie) — jeden JSON súbor = jeden projekt v src/data/projekty/.
   Spravujú sa cez administráciu (/admin → Projekty). Na web sa dostane len projekt,
   ktorý má zapnuté „publikovat", názov a aspoň MIN_FOTIEK fotiek. Popis polí: src/data/projekty/README.md */

export const MIN_FOTIEK = 3;

interface ProjektZdroj {
  nazov?: string;
  publikovat?: boolean;
  vybrany?: boolean;
  poradie?: number;
  typ?: string;
  lokalita?: string;
  rok?: string;
  rozsah?: string[];
  materialy?: string;
  popis?: string;
  titulna?: string;
  fotky?: { image: string }[];
}

export interface Projekt {
  slug: string;
  url: string;
  nazov: string;
  vybrany: boolean;
  poradie: number;
  typ?: string;
  lokalita?: string;
  rok?: string;
  rozsah: { slug: string; title: string }[];
  materialy?: string;
  popis?: string;
  titulna: ImageMetadata;
  fotky: ImageMetadata[];
}

const zdroje = import.meta.glob<{ default: ProjektZdroj }>('/src/data/projekty/*.json', { eager: true });

function nacitaj(): Projekt[] {
  const projekty: Projekt[] = [];
  for (const [cesta, mod] of Object.entries(zdroje)) {
    const p = mod.default;
    const slug = cesta.split('/').pop()!.replace(/\.json$/, '');
    if (!p.publikovat) continue;
    const fotky = (p.fotky ?? []).map((f) => photo(f.image)).filter((f): f is ImageMetadata => Boolean(f));
    if (!p.nazov?.trim() || fotky.length < MIN_FOTIEK) {
      console.warn(`[projekty] ${slug}: nepublikované — chýba názov alebo má menej než ${MIN_FOTIEK} fotky`);
      continue;
    }
    projekty.push({
      slug,
      url: `/realizacia/${slug}`,
      nazov: p.nazov.trim(),
      vybrany: Boolean(p.vybrany),
      poradie: p.poradie ?? 100,
      typ: p.typ?.trim() || undefined,
      lokalita: p.lokalita?.trim() || undefined,
      rok: p.rok?.trim() || undefined,
      rozsah: (p.rozsah ?? [])
        .map((s) => categories.find((c) => c.slug === s))
        .filter((c): c is (typeof categories)[number] => Boolean(c))
        .map((c) => ({ slug: c.slug, title: c.title })),
      materialy: p.materialy?.trim() || undefined,
      popis: p.popis?.trim() || undefined,
      titulna: photo(p.titulna) ?? fotky[0],
      fotky,
    });
  }
  return projekty.sort((a, b) => a.poradie - b.poradie || a.nazov.localeCompare(b.nazov, 'sk'));
}

export const projekty = nacitaj();
export const vybraneProjekty = projekty.filter((p) => p.vybrany);

/* súvisiace = zdieľajú aspoň jednu kategóriu; najviac 3 */
export function suvisiace(projekt: Projekt): Projekt[] {
  const kategorie = new Set(projekt.rozsah.map((r) => r.slug));
  return projekty
    .filter((p) => p.slug !== projekt.slug)
    .map((p) => ({ p, zhoda: p.rozsah.filter((r) => kategorie.has(r.slug)).length }))
    .filter((x) => x.zhoda > 0)
    .sort((a, b) => b.zhoda - a.zhoda)
    .slice(0, 3)
    .map((x) => x.p);
}
