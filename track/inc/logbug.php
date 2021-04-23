<?php
function logbug($texte) {
// include_once('inc/logBug.php'); (dŽclaration)
// logbug("toto"); (utilisation)
    if ($log = fopen("logSxT.txt", "a+")) {
        flock($log, LOCK_SH);
        fwrite($log,$texte."\n");
        flock($log, LOCK_UN);
        fclose($log);
    }
    else {
//        echo "Erreur ecriture logbug";
        header("Status: 500 Internal server error");
        exit;
    }
}
?>