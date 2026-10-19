# Projekty (prípadové štúdie realizácií)

Jeden súbor `<slug>.json` = jeden projekt. Slug je zároveň adresa: `nazov-projektu.json` → `https://www.i-studio.sk/realizacia/nazov-projektu`.
Projekty sa najjednoduchšie pridávajú cez administráciu `/admin` → **Projekty**.

Projekt sa na webe zobrazí, len keď má zapnuté `publikovat`, vyplnený `nazov` a aspoň **3 fotky**.
Kým projekt nie je hotový, nechajte `publikovat: false` — web ho ignoruje.

**Nevymýšľať.** Vyplňte len to, čo naozaj viete. Nepovinné polia nechajte prázdne — na webe sa vtedy nezobrazia.
Fotky do jedného projektu dávajte len vtedy, keď **určite** pochádzajú z tej istej zákazky.

| Pole | Povinné | Popis |
|---|---|---|
| `nazov` | áno | napr. „Rodinný dom — kuchyňa, skrine a dvere" |
| `publikovat` | áno | `true` = zobraziť na webe |
| `fotky` | áno | zoznam `{ "image": "/src/photos/projekty/…jpg" }`, aspoň 3 |
| `titulna` | nie | hlavná fotka; ak chýba, použije sa prvá |
| `vybrany` | nie | `true` = zobrazí sa na domovskej stránke medzi vybranými realizáciami |
| `poradie` | nie | nižšie číslo = vyššie v zozname (predvolené 100) |
| `typ` | nie | Byt / Rodinný dom / Kancelária… |
| `lokalita` | nie | len so súhlasom zákazníka, stačí obec (napr. „Stupava") |
| `rok` | nie | rok realizácie |
| `rozsah` | nie | kategórie: `podlahy`, `dvere`, `skrine`, `kuchyne`, `nabytok`, `obklady` |
| `materialy` | nie | napr. „dekor Egger dub, kovanie Blum, dvere Pol-Skone" |
| `popis` | nie | 2–5 viet: čo zákazník potreboval a čo sme dodali |

Príklad:

```json
{
  "nazov": "Rodinný dom — kuchyňa, skrine a dvere",
  "publikovat": true,
  "vybrany": true,
  "typ": "Rodinný dom",
  "lokalita": "Stupava",
  "rok": "2025",
  "rozsah": ["kuchyne", "skrine", "dvere"],
  "materialy": "dekor Egger, kovanie Blum, dvere Pol-Skone",
  "popis": "…",
  "fotky": [
    { "image": "/src/photos/projekty/dom-stupava-1.jpg" },
    { "image": "/src/photos/projekty/dom-stupava-2.jpg" },
    { "image": "/src/photos/projekty/dom-stupava-3.jpg" }
  ]
}
```
