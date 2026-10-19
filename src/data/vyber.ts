/* Ručne vybrané fotky skutočných realizácií (z galérií), kým nie sú pripravené celé projekty.
   Popisy opisujú len to, čo je na fotke vidieť — žiadne lokality ani príbehy.
   `galeria` = kategória, v ktorej je fotka zaradená; odkaz vedie do tej galérie. */
export interface VybranaFotka {
  image: string;
  popis: string;
  galeria: string;
}

/* domovská stránka — sekcia „Vybrané realizácie" (ak nie sú publikované vybrané projekty) */
export const vybraneRealizacie: VybranaFotka[] = [
  { image: '/src/photos/kuchyne/img44.jpg', popis: 'Kuchyňa s jedálenským kútom', galeria: 'kuchyne' },
  { image: '/src/photos/nabytok/img1.jpg', popis: 'Šatníková stena na mieru', galeria: 'nabytok' },
  { image: '/src/photos/nabytok/img3.jpg', popis: 'Obývacia stena na mieru', galeria: 'nabytok' },
  { image: '/src/photos/nabytok/img84.jpg', popis: 'Knižnica s podsvietením', galeria: 'nabytok' },
];

/* sekcia „Zariadime celý priestor" — otvorený priestor, kde je vidieť viac prvkov interiéru naraz */
export const celyPriestor: VybranaFotka[] = [
  { image: '/src/photos/kuchyne/img60.jpg', popis: 'Kuchyňa v otvorenom dennom priestore', galeria: 'kuchyne' },
  { image: '/src/photos/nabytok/img45.jpg', popis: 'Jedáleň s vysokými skrinkami na mieru', galeria: 'nabytok' },
  { image: '/src/photos/nabytok/img87.jpg', popis: 'Obývačka s konferenčným stolíkom na mieru', galeria: 'nabytok' },
];

/* stránka Kompletné interiéry — ukážky z rôznych miestností */
export const ukazkyInterierov: VybranaFotka[] = [
  { image: '/src/photos/kuchyne/img60.jpg', popis: 'Kuchyňa v otvorenom dennom priestore', galeria: 'kuchyne' },
  { image: '/src/photos/kuchyne/img44.jpg', popis: 'Kuchyňa s jedálenským kútom', galeria: 'kuchyne' },
  { image: '/src/photos/nabytok/img3.jpg', popis: 'Obývacia stena na mieru', galeria: 'nabytok' },
  { image: '/src/photos/skrine/img66.jpg', popis: 'Vstavané skrine cez celú stenu', galeria: 'skrine' },
  { image: '/src/photos/nabytok/img84.jpg', popis: 'Knižnica s podsvietením', galeria: 'nabytok' },
  { image: '/src/photos/kuchyne/img64.jpg', popis: 'Biela kuchyňa s drevenou zástenou', galeria: 'kuchyne' },
];
