<?php
function logbug($texte) {
    // include_once('inc/logBug.php'); (dŽclaration)
    // logbug("toto"); (utilisation)
    if (!file_exists("logSxT.txt")) touch("logSxT.txt", time());
    if ($log = fopen("logSxT.txt", "a+")) {
        flock($log, LOCK_SH);
        fwrite($log,$texte."\n");
        flock($log, LOCK_UN);
        fclose($log);
    }
}
?>