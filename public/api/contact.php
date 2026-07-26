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
    header('Location: /kontakt?odoslane=1');
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

$to      = 'office@i-studio.sk';
$subject = '=?UTF-8?B?' . base64_encode('Dopyt z webu i-studio.sk' . ($kategoria !== '' ? " – $kategoria" : '')) . '?=';
$body    = "Meno: $meno\nE-mail: $email\nTelefón: $telefon\nZáujem: $kategoria\n\nSpráva:\n$sprava\n";
$headers = [
    'From: web@i-studio.sk',
    'Reply-To: ' . preg_replace('/[\r\n]/', '', $email),
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
];

$ok = mail($to, $subject, $body, implode("\r\n", $headers));

header('Location: /kontakt?odoslane=' . ($ok ? '1' : '0'));
exit;
