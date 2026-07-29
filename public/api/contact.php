<?php
// Jednoduchý handler dopytového formulára pre Websupport hosting (PHP mail()).
declare(strict_types=1);

header('Content-Type: text/html; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// honeypot – boti vyplnia skryté pole
if (!empty($_POST['web'] ?? '')) {
    header('Location: /dakujeme');
    exit;
}

// anti-spam token – vypĺňa ho JavaScript pri načítaní stránky;
// boti POSTujúci priamo na endpoint ho nemajú
if (empty($_POST['cas'] ?? '')) {
    header('Location: /dakujeme');
    exit;
}

$meno      = trim((string)($_POST['meno'] ?? ''));
$email     = trim((string)($_POST['email'] ?? ''));
$telefon   = trim((string)($_POST['telefon'] ?? ''));
$kategoria = trim((string)($_POST['kategoria'] ?? ''));
$sprava    = trim((string)($_POST['sprava'] ?? ''));

if ($meno === '' || $sprava === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit('Chýbajúce alebo neplatné údaje. Vráťte sa späť a skúste to znova.');
}

// heuristika na spam: správa s odkazom a bez slovenskej diakritiky (typický anglický
// spam). Nezahadzuje sa potichu — návštevník dostane vysvetlenie a tlačidlom Späť
// sa vráti k vyplnenému formuláru (ľudia píšuci bez diakritiky oň neprídu).
$hasLink       = (bool) preg_match('~https?://|www\.~i', $sprava);
$hasDiacritics = (bool) preg_match('/[áäčďéíľĺňóôŕšťúýžÁÄČĎÉÍĽĹŇÓÔŔŠŤÚÝŽ]/u', $sprava);
if ($hasLink && !$hasDiacritics) {
    http_response_code(422);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="sk"><head><meta charset="utf-8">'
       . '<meta name="viewport" content="width=device-width, initial-scale=1">'
       . '<title>Správu sa nepodarilo odoslať — i-studio</title></head>'
       . '<body style="font-family:system-ui,sans-serif;max-width:34rem;margin:15vh auto;padding:0 1.5rem;line-height:1.6;color:#14130f">'
       . '<h1 style="font-size:1.4rem">Správu sa nepodarilo odoslať</h1>'
       . '<p>Správy s webovými odkazmi nám žiaľ často posielajú roboti, preto ich formulár neprijíma.</p>'
       . '<p><strong>Vráťte sa tlačidlom Späť</strong>, odstráňte zo správy odkaz a odošlite ju znova. '
       . 'Prípadne nám napíšte priamo na <a href="mailto:office@i-studio.sk" style="color:#14130f">office@i-studio.sk</a> — '
       . 'v e-maile môžu byť odkazy bez obmedzenia.</p>'
       . '</body></html>';
    exit;
}

$to      = 'office@i-studio.sk';
// testovacia adresa: vktrhilmer21@gmail.com
$subject = '=?UTF-8?B?' . base64_encode('Dopyt z webu i-studio.sk' . ($kategoria !== '' ? " – $kategoria" : '')) . '?=';
$body    = "Meno: $meno\nE-mail: $email\nTelefón: $telefon\nZáujem: $kategoria\n\nSpráva:\n$sprava\n";
// Websupport: odosielateľ musí byť existujúca schránka na hostingu,
// inak sa mail potichu zahodí. Envelope sender (-f) musí sedieť tiež.
$from    = 'office@i-studio.sk';
$headers = [
    'From: ' . $from,
    'Reply-To: ' . preg_replace('/[\r\n]/', '', $email),
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
];

$ok = mail($to, $subject, $body, implode("\r\n", $headers), '-f' . $from);

header('Location: ' . ($ok ? '/dakujeme' : '/kontakt?odoslane=0'));
exit;
