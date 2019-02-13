<?php
/*if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="SiouXtrack"');
    header('HTTP/1.0 401 Unauthorized');
//    echo 'Texte utilisé si le visiteur utilise le bouton d\'annulation';
    echo 'NO';
    exit;
}
else {
//    echo "<p>Bonjour, {$_SERVER['PHP_AUTH_USER']}.</p>";
//    echo "<p>Votre mot de passe est {$_SERVER['PHP_AUTH_PW']}.</p>";
    if (($_SERVER['PHP_AUTH_USER'] == 'lutin2012') && ($_SERVER['PHP_AUTH_PW'] == 'lutin2012')) {
        echo 'YES';
    }
    else echo 'NO';
}*/

    header('WWW-Authenticate: Basic realm="SiouXtrack"');
//    header('HTTP/1.0 401 Unauthorized');


//    echo "<p>Bonjour, {$_SERVER['PHP_AUTH_USER']}.</p>";
//    echo "<p>Votre mot de passe est {$_SERVER['PHP_AUTH_PW']}.</p>";
    if (($_SERVER['PHP_AUTH_USER'] == 'lutin2012') && ($_SERVER['PHP_AUTH_PW'] == 'lutin2012')) {
        echo 'YES';
    }
    else echo 'NO';

?>