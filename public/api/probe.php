<?php
// dočasná sonda: ako backend vidí HTTPS za proxy (odstrániť po zistení)
header('Content-Type: text/plain');
foreach (['HTTPS', 'SERVER_PORT', 'REQUEST_SCHEME', 'HTTP_X_FORWARDED_PROTO', 'HTTP_X_FORWARDED_SSL', 'HTTP_X_FORWARDED_PORT', 'HTTP_HOST'] as $k) {
    echo $k, '=', $_SERVER[$k] ?? '(unset)', "\n";
}
