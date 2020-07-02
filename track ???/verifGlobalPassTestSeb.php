<?php
if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="SiouXtrack"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Cancel!';
    exit;
}
else {
    if (($_SERVER['PHP_AUTH_USER'] == 'lutin2012') && ($_SERVER['PHP_AUTH_PW'] == 'lutin2012')) {
        echo 'YES';
    }
    else echo 'NO';
}
?>