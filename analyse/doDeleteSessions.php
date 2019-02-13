<?php
include_once('inc/logBug.php'); 
//logbug("test"); 
require_once("MySQLrequest.php");
require_once("inc/connectMySqlW.php");
$idcomW = connect();

if (isset($_POST)) {
	if (isset($_POST['list'])  && !empty($_POST['list'])) {
		$sessionIds = $_POST['list'];
		foreach ($sessionIds as $sessionId) {
			deleteSession($sessionId, $idcomW);
		}
        echo '>>>>>>>>>>>>>>>>> FIN';
    }
}
?>