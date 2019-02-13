<?php
//error_reporting(E_ERROR);
session_start();
require_once("MySQLrequest.php");
require_once("inc/connectMySqlW.php");
include_once('inc/logBug.php');
$idcom=connect();
if (isset($_POST['list'])) {
	$keys = $_POST['list'];			
	$sessions = "sessionId IN (";
	foreach ($keys as $key) {
		$sessions = $sessions . "'" . $key . "', ";
	}
	$sessions = substr($sessions, 0, -2) . ")";
	$requete = "SELECT * FROM Event_L_DocSuite WHERE $sessions ORDER BY timeStamp";
}
else if (isset($_POST['requestText'])) {
	$requete = $_POST['requestText'];
}
$result = $idcom->query($requete);
if (!$result) {
	print_r($idcom->error);
	exit;
}
$array = arrayResult($result, 1);
arrayToCsvFile($array, 'sXtQuery.csv');
$taille = count($array);
echo $taille;
?>