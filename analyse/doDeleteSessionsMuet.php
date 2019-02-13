<?php
session_start();
//include_once('inc/logBug.php'); 
//logbug("test");
if (!isset($_SESSION['username'])) {
	echo 'bad username';
	exit;
}
require_once("MySQLrequest.php");
require_once("inc/connectMySqlW.php");
$idcomW = connect();
if (isset($_POST)) {
	if (isset($_POST['list'])  && !empty($_POST['list'])) {
		$sessionIds = $_POST['list'];
		foreach ($sessionIds as $sessionId) {
			deleteSessionMuet($sessionId, $idcomW);
		}
        echo 'OK';
    }
}
?>