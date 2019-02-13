<?php
session_start();
/*if (!isset($_SESSION['username'])) {
	echo 'bad username';
	exit;
}*/
require_once("MySQLrequest.php");
require_once("inc/connectMySqlW.php");
$stb = connect();
if (isset($_POST)) {
	$stb->autocommit(FALSE);
	$props = $_POST['newSession'];
	$eventIds = $_POST['eventIds'];
//												mise à jour sessionId dans Event
	$query = "UPDATE Event SET sessionId = " . $props[1] . " where id in ($eventIds)";
	$result = $stb->query($query);                        // Ecriture sessionIds *****        
	if (!$result) {
		$err = $stb->error;
		$stb->rollback();
		echo $err;
		exit;
	}
//														Ecriture blobId 
	if ($_POST['blobId']) {
		$query = "UPDATE Event SET blobId = " . $_POST['blobId'] . " WHERE id = " . $_POST['firstEventId'];
		$result = $stb->query($query);                           
		if (!$result) {
			$err = $stb->error;
			$stb->rollback();
			echo $err;
			exit;
		}
	}
//	echo json_encode($_POST['newSession']);
//	echo "OK";
//	echo $_POST['newSession'][6];
		$query = "INSERT INTO Session VALUES ("     
        . "NULL,'"
        . $props[1] . "','"      		# sessionId
        . $props[2] . "','"     		# clientIP
        . $props[3] . "','"             # userId
        . $props[4] . "','"             # date
        . $props[5] . "','"             # time
        . $props[6] . "','"             # serverURL
        . $props[7] . "','"             # recButton
        
        . $props[8] . "','"             # autoRecord
        
        . $props[9] . "','"             # stateBar
        . $props[10] . "','"             # maxEvents
        . $props[11] . "','"             # minStation
        . $props[12] . "','"             # mouseMove
        . $props[13] . "','"             # mouseOver
        . $props[14] . "','"             # mouseOut
        . $props[15] . "','"             # mouseWheel
        . $props[16] . "','"             # scroll
        
        . $props[17] . "','"             # html
        . $props[18] . "','"             # png
        
        . $props[19] . "','"             # pngPlus        
        . $props[20] . "','"             # pngReduc
        . $props[21] . "','"             # noHTTPS
        
        . $props[22] . "','"             # regExp1
        . $props[23] . "','"             # regExp2
        . $props[24] . "','"             # regExp3
        . $props[25] . "','"             # regExp4
        . $props[26] . "','"             # regExp5
        . $props[27] . "','"             # regExp6
        . $props[28] . "','"             # regExp7
        . $props[29] . "','"             # regExp8
        . $props[30] . "','"             # regExp9
        . $props[31] . "','"             # regExp10
        . $props[32] . "','"             # freeField1
        . $props[33] . "','"             # freeField2
        . $props[34] . "','"             # freeField3
        . $props[35] . "','"             # freeField4
        . $props[36] . "','"             # freeField5
        . $props[37] . "')";             # version
        $result = $stb->query($query);                        // Ecriture Session *****        
        if (!$result) {
            $err = $stb->error;
            $stb->rollback();
			echo $err;
			exit;
		}
//																
	$stb->commit();
	echo "OK";
}
else echo "ERREUR";
?>