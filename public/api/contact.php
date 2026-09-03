<?php
// Handler dopytového formulára (sprievodca v 4 krokoch) pre Websupport hosting — PHP mail().
// Prílohy (fotky / pôdorys) sa posielajú ako súčasť e-mailu, na hostingu sa nič neukladá.
declare(strict_types=1);

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

const MAX_SUBOROV       = 5;
const MAX_SUBOR_BAJTOV  = 10 * 1024 * 1024; // 10 MB na jeden súbor
const MAX_SPOLU_BAJTOV  = 20 * 1024 * 1024; // 20 MB spolu (prehliadač fotky pred odoslaním zmenší)
const MAX_SPRAV_ZA_HOD  = 6;                // limit z jednej IP adresy
const PRIJEMCA          = 'office@i-studio.sk';   // testovacia adresa: vktrhilmer21@gmail.com
const ODOSIELATEL       = 'office@i-studio.sk';   // musí byť existujúca schránka na Websupporte (+ -f envelope)

// viditeľné odmietnutie — nikdy nie potichu, aby skutočný návštevník vedel, čo sa stalo,
// a mohol sa tlačidlom Späť vrátiť k formuláru (údaje v ňom ostanú vyplnené)
function odmietni(string $dovod, string $rada, int $kod = 422): void
{
    http_response_code($kod);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="sk"><head><meta charset="utf-8">'
       . '<meta name="viewport" content="width=device-width, initial-scale=1">'
       . '<title>Dopyt sa nepodarilo odoslať — i-studio</title></head>'
       . '<body style="font-family:system-ui,sans-serif;max-width:34rem;margin:15vh auto;padding:0 1.5rem;line-height:1.6;color:#14130f">'
       . '<h1 style="font-size:1.4rem">Dopyt sa nepodarilo odoslať</h1>'
       . '<p>' . $dovod . '</p>'
       . '<p>' . $rada . ' Prípadne nám napíšte priamo na '
       . '<a href="mailto:' . PRIJEMCA . '" style="color:#14130f">' . PRIJEMCA . '</a>.</p>'
       . '<button onclick="history.back()" style="margin-top:1rem;padding:.8rem 1.6rem;font:inherit;font-weight:600;'
       . 'background:#f6be00;border:none;border-radius:2px;cursor:pointer">&larr; Späť na formulár</button>'
       . '</body></html>';
    exit;
}

function ip(): string
{
    return (string)($_SERVER['REMOTE_ADDR'] ?? '?');
}

// „10M" / „128M" z php.ini -> bajty
function iniBajty(string $hodnota): int
{
    $hodnota = trim($hodnota);
    if ($hodnota === '' || $hodnota === '-1') return PHP_INT_MAX;
    $jednotka = strtolower(substr($hodnota, -1));
    $cislo    = (int)$hodnota;
    switch ($jednotka) {
        case 'g': return $cislo * 1024 ** 3;
        case 'm': return $cislo * 1024 ** 2;
        case 'k': return $cislo * 1024;
        default:  return $cislo;
    }
}

// typ súboru podľa obsahu — finfo ak je k dispozícii, inak podľa magických bajtov
function mimePodlaObsahu(string $cesta): string
{
    if (class_exists('finfo')) {
        $mime = (string)(new finfo(FILEINFO_MIME_TYPE))->file($cesta);
        if ($mime !== '') return $mime;
    }
    $hlava = (string)file_get_contents($cesta, false, null, 0, 12);
    if (substr($hlava, 0, 5) === '%PDF-') return 'application/pdf';
    if (substr($hlava, 0, 3) === "\xFF\xD8\xFF") return 'image/jpeg';
    if (substr($hlava, 0, 8) === "\x89PNG\r\n\x1A\n") return 'image/png';
    if (substr($hlava, 0, 4) === 'RIFF' && substr($hlava, 8, 4) === 'WEBP') return 'image/webp';
    return 'application/octet-stream';
}

// odstráni riadiace znaky (okrem nových riadkov vo viacriadkových poliach) a oreže dĺžku
function text(string $kluc, int $max, bool $viacriadkove = false): string
{
    $hodnota = (string)($_POST[$kluc] ?? '');
    $ciste   = $viacriadkove
        ? preg_replace('/[^\PC\n\t]/u', '', $hodnota)
        : preg_replace('/\pC/u', '', $hodnota);
    // neplatné UTF-8 bajty → preg_replace vráti null; skutočný prehliadač ich nikdy nepošle,
    // ale nech to nie je potichu prázdne pole, ale viditeľné odmietnutie
    if ($ciste === null) {
        odmietni(
            'Správa obsahuje neplatné znaky, preto ju formulár neprijal.',
            '<strong>Vráťte sa tlačidlom Späť</strong> a skúste text napísať znova.'
        );
    }
    return mb_substr(trim($ciste), 0, $max);
}

// hodnota z pevného zoznamu (rádiá / select) — čokoľvek iné sa zahodí
function volba(string $kluc, array $povolene): string
{
    $hodnota = trim((string)($_POST[$kluc] ?? ''));
    return in_array($hodnota, $povolene, true) ? $hodnota : '';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Keď je požiadavka väčšia než post_max_size, PHP zahodí CELÝ $_POST aj $_FILES (bez chyby) —
// musí sa to zachytiť skôr než kontroly polí, inak by človek dostal nezmyselné „chýba token".
$dlzka = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($dlzka > 0 && $dlzka > iniBajty((string)ini_get('post_max_size'))) {
    error_log('i-studio form: request too large (' . $dlzka . ' B) from ' . ip());
    odmietni(
        'Prílohy sú príliš veľké a server ich neprijal.',
        '<strong>Vráťte sa tlačidlom Späť</strong>, priložte menej alebo menších súborov (spolu do 20 MB) a odošlite dopyt znova.',
        413
    );
}

// honeypot – boti vyplnia skryté pole; vyplní ho ale aj autofill prehliadača
if (!empty($_POST['web'] ?? '')) {
    error_log('i-studio form: honeypot filled from ' . ip());
    odmietni(
        'Formulár vyplnilo automatické dopĺňanie prehliadača aj do skrytého poľa, ktoré slúži na odhalenie robotov.',
        '<strong>Vráťte sa tlačidlom Späť</strong>, vymažte pole „Webová stránka" (ak ho vidíte) a odošlite dopyt znova.'
    );
}

// anti-spam token – vypĺňa ho JavaScript pri načítaní stránky; boti POSTujúci priamo ho nemajú
if (empty($_POST['cas'] ?? '')) {
    error_log('i-studio form: missing JS token from ' . ip());
    odmietni(
        'Formulár sa nepodarilo overiť — pravdepodobne máte vypnutý JavaScript alebo sa stránka nenačítala celá.',
        '<strong>Vráťte sa tlačidlom Späť</strong>, obnovte stránku a skúste dopyt odoslať znova.'
    );
}

// jednoduchý limit počtu správ z jednej IP (súbor v temp adresári; ak sa nedá zapísať, limit sa preskočí)
$rlSubor = sys_get_temp_dir() . '/istudio-dopyt-' . hash('sha256', ip() . '|' . ODOSIELATEL) . '.json';
$teraz   = time();
$casy    = [];
if (is_file($rlSubor)) {
    $casy = json_decode((string)@file_get_contents($rlSubor), true);
    $casy = is_array($casy) ? array_values(array_filter($casy, fn($t) => is_int($t) && $t > $teraz - 3600)) : [];
}
if (count($casy) >= MAX_SPRAV_ZA_HOD) {
    error_log('i-studio form: rate limit hit from ' . ip());
    odmietni(
        'Z vašej adresy prišlo za poslednú hodinu priveľa správ, preto formulár ďalšiu neprijal.',
        'Skúste to prosím o chvíľu, alebo nám zavolajte na +421 903 730 932.',
        429
    );
}
$casy[] = $teraz;
@file_put_contents($rlSubor, json_encode($casy), LOCK_EX);

// ---- polia sprievodcu ----
$KATEGORIE = ['Podlahy', 'Dvere', 'Skrine', 'Kuchyňa', 'Nábytok', 'Obklady a sanita'];
$TYPY      = ['Byt', 'Rodinný dom', 'Chata / chalupa', 'Kancelária / prevádzka'];
$STAVY     = ['Novostavba', 'Rekonštrukcia', 'Obývaný, len dozariadiť'];
$TERMINY   = ['Čo najskôr', 'Do 3 mesiacov', 'Neskôr, zatiaľ zisťujem'];
$ROZPOCTY  = ['do 3 000 €', '3 000 – 8 000 €', '8 000 – 15 000 €', 'nad 15 000 €'];
$KANALY    = ['Zavolajte mi', 'Radšej e-mailom'];

$coRaw = $_POST['co'] ?? [];
$co    = is_array($coRaw)
    ? array_values(array_intersect($KATEGORIE, array_map(fn($v) => trim((string)$v), $coRaw)))
    : [];

$typ     = volba('typ', $TYPY);
$stav    = volba('stav', $STAVY);
$termin  = volba('termin', $TERMINY);
$rozpocet= volba('rozpocet', $ROZPOCTY);
$kanal   = volba('kanal', $KANALY);
$obec    = text('obec', 80);
$plocha  = text('plocha', 20);
$sprava  = text('sprava', 5000, true);
$meno    = text('meno', 120);
$email   = text('email', 254);
$telefon = text('telefon', 40);

if ($meno === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    odmietni(
        'Chýba meno alebo e-mailová adresa nie je v správnom tvare.',
        '<strong>Vráťte sa tlačidlom Späť</strong>, doplňte údaje v poslednom kroku a odošlite dopyt znova.',
        400
    );
}
if ($co === [] && $sprava === '') {
    odmietni(
        'Dopyt je prázdny — nevybrali ste, čo zariaďujete, ani ste nenapísali správu.',
        '<strong>Vráťte sa tlačidlom Späť</strong>, v prvom kroku vyberte aspoň jednu oblasť alebo napíšte pár slov v treťom kroku.',
        400
    );
}

$volnyText = $meno . ' ' . $sprava . ' ' . $obec . ' ' . $telefon . ' ' . $plocha;

// neplatné UTF-8 bajty obídu všetky /u regexy — skutočný prehliadač ich nikdy nepošle
if (@preg_match('//u', $volnyText . $email) !== 1) {
    odmietni(
        'Správa obsahuje neplatné znaky, preto ju formulár neprijal.',
        '<strong>Vráťte sa tlačidlom Späť</strong> a skúste správu napísať znova.'
    );
}

// heuristika 1: odkaz v správe + úplne bez slovenskej diakritiky (typický anglický spam)
$hasLink       = (bool) preg_match('~https?://|www\.~i', $sprava);
$hasDiacritics = (bool) preg_match('/[áäčďéíľĺňóôŕšťúýžÁÄČĎÉÍĽĹŇÓÔŔŠŤÚÝŽ]/u', $sprava);
if ($hasLink && !$hasDiacritics) {
    odmietni(
        'Správy s webovými odkazmi nám žiaľ často posielajú roboti, preto ich formulár neprijíma.',
        '<strong>Vráťte sa tlačidlom Späť</strong>, odstráňte zo správy odkaz a odošlite ju znova.'
    );
}

// heuristika 2: výrazy, ktoré sa v dopyte na interiér nevyskytujú, ale v spame áno
$spamKeywords = '/\b(crypto|bitcoin|btc|ethereum|tokens?|forex|investment|investing|casino'
    . '|viagra|cialis|porno?|xxx|seo|backlinks?|followers|subscribers|telegram|telegra\.ph'
    . '|lottery|jackpot|gift ?card)\b|t\.me\/|\$\s?\d|\p{Cyrillic}/iu';
if (preg_match($spamKeywords, $volnyText)) {
    odmietni(
        'Správa obsahuje výrazy, ktoré sa typicky vyskytujú v spame, preto ju formulár neprijal.',
        '<strong>Vráťte sa tlačidlom Späť</strong>, preformulujte správu (bez anglických reklamných výrazov) a odošlite ju znova.'
    );
}

// ---- prílohy ----
// Povolené sú len JPEG, PNG, WebP a PDF. Typ sa určuje z obsahu (finfo + getimagesize / hlavička PDF),
// nie z názvu ani z Content-Type od prehliadača; názov prílohy v e-maile sa generuje, pôvodný sa len vypíše.
$POVOLENE = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'application/pdf' => 'pdf'];
$prilohy  = [];

if (isset($_FILES['subory']) && is_array($_FILES['subory']['name'] ?? null)) {
    $f     = $_FILES['subory'];
    $pocet = count($f['name']);
    $spolu = 0;

    if ($pocet > MAX_SUBOROV) {
        odmietni(
            'Priložili ste viac než ' . MAX_SUBOROV . ' súborov.',
            '<strong>Vráťte sa tlačidlom Späť</strong> a nechajte najviac ' . MAX_SUBOROV . ' príloh.'
        );
    }

    for ($i = 0; $i < $pocet; $i++) {
        $chyba = (int)$f['error'][$i];
        if ($chyba === UPLOAD_ERR_NO_FILE) continue;

        $povodnyNazov = mb_substr((string)preg_replace('/[^\p{L}\p{N} ._-]/u', '', (string)$f['name'][$i]), 0, 60);
        if ($povodnyNazov === '') $povodnyNazov = 'súbor';

        if ($chyba === UPLOAD_ERR_INI_SIZE || $chyba === UPLOAD_ERR_FORM_SIZE) {
            odmietni(
                'Súbor „' . htmlspecialchars($povodnyNazov, ENT_QUOTES) . '" je príliš veľký a server ho neprijal.',
                '<strong>Vráťte sa tlačidlom Späť</strong>, priložte menší súbor (do 10 MB) a odošlite dopyt znova.',
                413
            );
        }
        if ($chyba !== UPLOAD_ERR_OK) {
            error_log('i-studio form: upload error ' . $chyba . ' from ' . ip());
            odmietni(
                'Prílohu „' . htmlspecialchars($povodnyNazov, ENT_QUOTES) . '" sa nepodarilo nahrať.',
                '<strong>Vráťte sa tlačidlom Späť</strong> a skúste ju priložiť znova, prípadne dopyt odošlite bez nej.'
            );
        }

        $cesta    = (string)$f['tmp_name'][$i];
        $velkost  = (int)$f['size'][$i];
        $spolu   += $velkost;

        if (!is_uploaded_file($cesta) || $velkost <= 0 || $velkost > MAX_SUBOR_BAJTOV || $spolu > MAX_SPOLU_BAJTOV) {
            odmietni(
                'Prílohy presahujú povolenú veľkosť (10 MB na súbor, 20 MB spolu).',
                '<strong>Vráťte sa tlačidlom Späť</strong>, priložte menej alebo menších súborov a odošlite dopyt znova.',
                413
            );
        }

        $mime = mimePodlaObsahu($cesta);
        $ok   = isset($POVOLENE[$mime]);
        if ($ok && $mime === 'application/pdf') {
            $ok = substr((string)file_get_contents($cesta, false, null, 0, 5), 0, 5) === '%PDF-';
        } elseif ($ok) {
            $info = @getimagesize($cesta);
            $ok   = $info !== false && ($info['mime'] ?? '') === $mime;
        }
        if (!$ok) {
            error_log('i-studio form: rejected attachment type ' . $mime . ' from ' . ip());
            odmietni(
                'Súbor „' . htmlspecialchars($povodnyNazov, ENT_QUOTES) . '" nie je fotografia (JPG, PNG, WebP) ani PDF.',
                '<strong>Vráťte sa tlačidlom Späť</strong> a priložte fotografie alebo PDF, prípadne dopyt odošlite bez príloh.'
            );
        }

        $prilohy[] = [
            'nazov'   => 'priloha-' . (count($prilohy) + 1) . '.' . $POVOLENE[$mime],
            'povodny' => $povodnyNazov,
            'mime'    => $mime,
            'obsah'   => (string)file_get_contents($cesta),
        ];
    }
}

// ---- e-mail ----
$riadky = [
    'Meno:        ' . $meno,
    'E-mail:      ' . $email,
    'Telefón:     ' . ($telefon !== '' ? $telefon : '—'),
    'Kontaktovať: ' . ($kanal !== '' ? $kanal : '—'),
    '',
    'Zariaďuje:   ' . ($co !== [] ? implode(', ', $co) : '—'),
    'Priestor:    ' . ($typ !== '' ? $typ : '—'),
    'Stav:        ' . ($stav !== '' ? $stav : '—'),
    'Termín:      ' . ($termin !== '' ? $termin : '—'),
    'Obec:        ' . ($obec !== '' ? $obec : '—'),
    'Plocha:      ' . ($plocha !== '' ? $plocha . ' m²' : '—'),
    'Rozpočet:    ' . ($rozpocet !== '' ? $rozpocet : '—'),
    '',
    'Správa:',
    $sprava !== '' ? $sprava : '—',
];
if ($prilohy !== []) {
    $riadky[] = '';
    $riadky[] = 'Prílohy (' . count($prilohy) . '):';
    foreach ($prilohy as $p) {
        $riadky[] = '  ' . $p['nazov'] . '  (pôvodne: ' . $p['povodny'] . ', ' . round(strlen($p['obsah']) / 1024) . ' kB)';
    }
}
$telo = implode("\n", $riadky) . "\n";

$predmetText = 'Dopyt z webu i-studio.sk' . ($co !== [] ? ' – ' . implode(', ', $co) : '');
$predmet     = '=?UTF-8?B?' . base64_encode($predmetText) . '?=';

$hlavicky = [
    'From: ' . ODOSIELATEL,
    'Reply-To: ' . $email,  // prešiel FILTER_VALIDATE_EMAIL, nemôže obsahovať nový riadok
    'MIME-Version: 1.0',
];

if ($prilohy === []) {
    $hlavicky[] = 'Content-Type: text/plain; charset=utf-8';
    $hlavicky[] = 'Content-Transfer-Encoding: 8bit';
    $sprava_mail = $telo;
} else {
    $hranica    = 'istudio-' . bin2hex(random_bytes(12));
    $hlavicky[] = 'Content-Type: multipart/mixed; boundary="' . $hranica . '"';
    $casti = "--$hranica\r\n"
        . "Content-Type: text/plain; charset=utf-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $telo . "\r\n";
    foreach ($prilohy as $p) {
        $casti .= "--$hranica\r\n"
            . 'Content-Type: ' . $p['mime'] . '; name="' . $p['nazov'] . "\"\r\n"
            . "Content-Transfer-Encoding: base64\r\n"
            . 'Content-Disposition: attachment; filename="' . $p['nazov'] . "\"\r\n\r\n"
            . chunk_split(base64_encode($p['obsah']), 76, "\r\n")
            . "\r\n";
    }
    $casti .= "--$hranica--\r\n";
    $sprava_mail = $casti;
}

$ok = mail(PRIJEMCA, $predmet, $sprava_mail, implode("\r\n", $hlavicky), '-f' . ODOSIELATEL);
if (!$ok) {
    error_log('i-studio form: mail() failed from ' . ip());
}

header('Location: ' . ($ok ? '/dakujeme' : '/kontakt?odoslane=0'));
exit;
