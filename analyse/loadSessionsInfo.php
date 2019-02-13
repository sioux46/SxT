<?php
//include_once('inc/logBug.php'); 
//require_once("MySQLrequest.php");
require_once("inc/connectMySqlW.php");
$idcomW = connect();
$sessionsInfo = array();
if (isset($_POST)) {
	if (isset($_POST['sessionIds'])  && !empty($_POST['sessionIds'])) {
		$sessionIds = $_POST['sessionIds'];
		$i = 0;  
		foreach ($sessionIds as $sessionId) {
			$query = "SELECT * FROM Session WHERE sessionId = '$sessionId'";
			$result = $idcomW->query($query);
			$sessionsInfo[$i++] = $result->fetch_array(MYSQLI_NUM);
		}
		$sessionsInfo  = json_encode($sessionsInfo);
        echo $sessionsInfo;
    }
	else echo "ERREUR";
}
?>