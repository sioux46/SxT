<?php
//									delete multi sessions VIDES (sans Event)
//include_once('inc/logBug.php'); 
//logbug("test");
session_start();
/*if ($_SESSION['username'] != 'RedBird') {
	echo 'Forbidden';
	exit;
}*/
/*if (!isset($_SESSION['username'])) {
	echo 'bad username';
	exit;
}*/
require_once("MySQLrequest.php");
require_once("inc/connectMySqlW.php");
$idcomW = connect();
$nbDelete = 0;
if (isset($_POST['sessionIds'])) {
	$sessionIds = $_POST['sessionIds'];
}
else {
	$query = "SELECT sessionId FROM Session";
	$result = $idcomW->query($query);
	$sessionIds = array();
	for($i = 0; $i < $result->num_rows; $i++) {
		$row = $result->fetch_array(MYSQLI_NUM);
		$sessionIds[$i] = $row[0];
	}
}
foreach($sessionIds as $sessionId) {
	$query = "SELECT COUNT(*) FROM Event WHERE sessionId = '$sessionId'";
	$result = $idcomW->query($query);
	$row = $result->fetch_array(MYSQLI_NUM);
	if ($row[0] == 0) {
		deleteSessionMuet($sessionId, $idcomW);
		$nbDelete++;
	}
}
echo $nbDelete;
?>