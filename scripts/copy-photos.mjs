// Skopíruje originály fotiek do dist/src/photos, aby administrácia (/admin)
// vedela zobraziť náhľady — Decap CMS ich načítava priamo z týchto ciest.
import { cpSync, existsSync } from 'node:fs';

const from = new URL('../src/photos/', import.meta.url);
const to = new URL('../dist/src/photos/', import.meta.url);

if (existsSync(from)) {
  cpSync(from, to, { recursive: true });
  console.log('photos copied to dist/src/photos');
}
