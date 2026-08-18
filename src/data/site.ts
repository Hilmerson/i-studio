export const site = {
  name: 'i-studio',
  tagline: 'Vaše interiérové štúdio',
  url: 'https://www.i-studio.sk',
  email: 'office@i-studio.sk',
  phone: '+421 903 730 932',
  phoneHref: '+421903730932',
  address: {
    street: 'Hviezdoslavova 90',
    city: '900 31 Stupava',
    country: 'Slovensko',
  },
  hours: [
    { days: 'Pondelok – Piatok', time: '09:30 – 12:00, 13:30 – 17:00' },
    { days: 'Sobota', time: 'po telefonickej dohode' },
    { days: 'Nedeľa', time: 'zatvorené' },
  ],
  social: {
    facebook: 'https://www.facebook.com/istudio.sk',
    instagram: 'https://www.instagram.com/istudio.sk/',
  },
  /* identifikačné údaje spoločnosti — povinné na webe podľa § 3a Obchodného zákonníka */
  legal: {
    name: 'i-studio, s.r.o.',
    seat: 'Záhradná 1, 900 31 Stupava',
    ico: '36 736 856',
    dic: '2022322533',
    icDph: 'SK2022322533',
    register: 'zapísaná v Obchodnom registri Okresného súdu Bratislava I, oddiel Sro, vložka č. 44517/B',
  },
  /* firma funguje od ~2006 → počítané dynamicky nech to opäť nezamrzne */
  foundedYear: 2006,
};

export const yearsOfExperience = new Date().getFullYear() - site.foundedYear;

export interface Category {
  slug: string;
  title: string;
  navLabel: string;
  tagline: string;
  intro: string[];
  brands?: string[];
  metaDescription: string;
}

export const categories: Category[] = [
  {
    slug: 'podlahy',
    title: 'Podlahy',
    navLabel: 'Podlahy',
    tagline: 'Základ, na ktorom stojí celý interiér.',
    intro: [
      'Správne zvolená podlaha je základom interiéru vášho domova. V našej ponuke nájdete kvalitné podlahy belgického výrobcu Quick-Step, ktorý patrí medzi absolútnu špičku v Európe.',
      'Vyberiete si z klasických laminátových podláh, moderných vinylových krytín aj luxusných drevených parkiet. S výberom vám radi poradíme priamo v našom štúdiu — a o odbornú pokládku sa postaráme my.',
    ],
    brands: ['Quick-Step'],
    metaDescription:
      'Laminátové, vinylové a drevené podlahy Quick-Step vrátane odbornej pokládky. Interiérové štúdio i-studio Stupava.',
  },
  {
    slug: 'dvere',
    title: 'Dvere',
    navLabel: 'Dvere',
    tagline: 'Detail, ktorý zmení celý priestor.',
    intro: [
      'Interiérové dvere a zárubne ovplyvnia vzhľad vášho bývania na dlhé roky. Pri výbere preto záleží nielen na estetike, ale aj na funkčných parametroch a kvalite spracovania.',
      'Ponúkame široký výber dverí — striekané, fóliované, laminátové, dýhované aj masívne — od overených výrobcov Pol-Skone, Lip Bled a Atvyn. Celkový dojem dotiahne vhodná kľučka zo širokej ponuky MP-kovania, ktorú dodáme spolu s dverami a zárubňami.',
    ],
    brands: ['Pol-Skone', 'Lip Bled', 'Atvyn', 'MP-kovania'],
    metaDescription:
      'Interiérové dvere a zárubne Pol-Skone, Lip Bled a Atvyn vrátane kľučiek a montáže. Interiérové štúdio i-studio Stupava.',
  },
  {
    slug: 'skrine',
    title: 'Skrine',
    navLabel: 'Skrine',
    tagline: 'Úložný priestor presne na mieru.',
    intro: [
      'Vstavané šatníkové skrine sú ideálnym riešením, ako naplno využiť úložný priestor v domácnosti. Korpusy aj vnútorné vybavenie vyrábame na mieru, takže sa prispôsobia akémukoľvek priestoru.',
      'Používame vysokokvalitné materiály Egger, Kaindl a Bučina s 2 mm ABS hranami na pohľadových stranách. Pri otváravých dvierkach montujeme výhradne kovania Blum, pri posuvných dverách elegantné hliníkové systémy Indeco a Bonari.',
    ],
    brands: ['Egger', 'Kaindl', 'Blum', 'Indeco', 'Bonari'],
    metaDescription:
      'Vstavané šatníkové skrine na mieru — materiály Egger a Kaindl, kovania Blum, posuvné systémy Indeco. i-studio Stupava.',
  },
  {
    slug: 'kuchyne',
    title: 'Kuchyne',
    navLabel: 'Kuchyne',
    tagline: 'Srdce domácnosti, ušité na mieru.',
    intro: [
      'Kuchyňa dnes nie je len miestom na varenie — býva prepojená s obývačkou a stretáva sa v nej celá rodina. Preto k jej návrhu pristupujeme s maximálnou starostlivosťou.',
      'Základom našich kuchýň na mieru je premyslené rozmiestnenie pracovných zón a spotrebičov a šikovné riešenie vnútorného priestoru skriniek. Výsledok charakterizuje kvalita spracovania, praktickosť a individualita každého klienta.',
    ],
    metaDescription:
      'Kuchyne na mieru — návrh, výroba a montáž. Premyslené dispozície a kvalitné spracovanie. Interiérové štúdio i-studio Stupava.',
  },
  {
    slug: 'nabytok',
    title: 'Nábytok',
    navLabel: 'Nábytok',
    tagline: 'Dielensky vyrábaný nábytok na mieru.',
    intro: [
      'Nábytok na mieru je vyšším štandardom zariaďovania interiéru. Na rozdiel od montovaných šatníkov ide o dopredu dielensky spracovaný nábytok, ktorý trvalo zhodnotí vaše bývanie.',
      'Vyrobíme ho do priestoru akéhokoľvek tvaru — do vstupných hál, obývačiek, detských izieb aj spální. Veľkou výhodou je zladenie celého interiéru: vyberiete si zo širokej ponuky materiálov, ich kombinácií a farieb.',
    ],
    metaDescription:
      'Nábytok na mieru pre obývačky, spálne, detské izby aj vstupné haly. Dielenská výroba a montáž. i-studio Stupava.',
  },
  {
    slug: 'obklady',
    title: 'Obklady',
    navLabel: 'Obklady',
    tagline: 'Kúpeľne a keramika s kompletným servisom.',
    intro: [
      'Pri zariaďovaní kúpeľní a keramických povrchov dlhodobo spolupracujeme s partnermi Siko a Keramika Soukup.',
      'Sprostredkujeme vám stretnutie priamo v showroome partnera, pripravíme vizualizácie a cenovú kalkuláciu, zabezpečíme dodanie obkladov, dlažby aj sanity — a nakoniec zrealizujeme samotnú montáž. Celá kúpeľňa od návrhu po realizáciu, bez starostí.',
    ],
    brands: ['Siko', 'Keramika Soukup'],
    metaDescription:
      'Kompletné kúpeľne — obklady, dlažby a sanita v spolupráci so Siko a Keramika Soukup, vrátane montáže. i-studio Stupava.',
  },
];

/* značky pre marquee pás na domovskej stránke; logá sú v public/brands/
   invert: true = biele logo, na svetlom podklade sa musí prevrátiť do tmava */
export const partnerBrands = [
  { name: 'Quick-Step', logo: '/brands/quick-step.svg' },
  { name: 'Pol-Skone', logo: '/brands/pol-skone.svg' },
  /* nízke rozlíšenie (výrez zo sprite) — zobrazuje sa menšie, nech nie je rozmazané */
  { name: 'Lip Bled', logo: '/brands/lip-bled.png', size: 'sm' },
  /* kruhový emblém s drobným textom — potrebuje viac výšky, aby bol čitateľný */
  { name: 'Atvyn', logo: '/brands/atvyn.svg', size: 'lg' },
  { name: 'MP Kovania', logo: '/brands/mp-kovania.svg', invert: true },
  { name: 'Egger', logo: '/brands/egger.svg' },
  { name: 'Kaindl', logo: '/brands/kaindl.svg' },
  { name: 'Blum', logo: '/brands/blum.svg' },
  { name: 'Indeco', logo: '/brands/indeco.png', invert: true },
  { name: 'Bonari', logo: '/brands/bonari.svg' },
  { name: 'Siko', logo: '/brands/siko.svg' },
  { name: 'Keramika Soukup', logo: '/brands/keramika-soukup.svg' },
];

export const processSteps = [
  {
    title: 'Konzultácia a zameranie',
    text: 'Preberieme vaše predstavy, poradíme s výberom a presne zameriame priestor u vás doma.',
  },
  {
    title: 'Návrh a cenová ponuka',
    text: 'Pripravíme riešenie na mieru vrátane materiálov a transparentnej cenovej ponuky.',
  },
  {
    title: 'Výroba na mieru',
    text: 'Vyrábame z kvalitných materiálov overených značiek — presne podľa odsúhlaseného návrhu.',
  },
  {
    title: 'Dodanie a montáž',
    text: 'Kompletnú montáž zabezpečia naši ľudia. Odovzdáme vám hotový interiér pripravený na bývanie.',
  },
];
