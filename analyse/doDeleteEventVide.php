<?php
//				delete multi Event VIDES (sans Session)
require_once("MySQLrequest.php");
require_once("inc/connectMySqlW.php");
$idComW = connect();
$nbEventDelete = $nbDocSuiteDelete = $nbDocBlobDelete = 0;
if (isset($_POST['eventIds'])) {
	$eventIds = $_POST['eventIds'];
}
else {
	$query = "SELECT id FROM Event";
	$result = $idComW->query($query);
	$eventIds = array();
	for($i = 0; $i < $result->num_rows; $i++) {
		$row = $result->fetch_array(MYSQLI_NUM);
		$eventIds[$i] = $row[0];
	}
}
//
$idComW->autocommit(FALSE);	    	// début transaction
//
foreach($eventIds as $eventId) {  	
	$query = "SELECT COUNT(*) FROM Session WHERE sessionId = (SELECT sessionId FROM Event WHERE id = '$eventId' )";
	$result = $idComW->query($query);
	$row = $result->fetch_array(MYSQLI_NUM);
	if ($row[0] == 0) {
		$query2 = "DELETE FROM Event WHERE id = $eventId";
		$result2 = $idComW->query($query2);				// delete Event
		if (!$result2) {
			$idComW->rollback();
			echo 'ERREUR';
			exit;
		}
		$nbEventDelete++;
//
		$query3 = "DELETE FROM DocSuite WHERE eventId = $eventId";
		$result3 = $idComW->query($query3);				// delete DocSuite
		if ($result3) $nbDocSuiteDelete++;
//
		$query4 = "DELETE FROM DocBlob WHERE eventId = $eventId";
		$result4 = $idComW->query($query4);				// delete DocBlob
		if ($result4) $nbDocBlobDelete++;
	}
}
$idComW->commit();
echo json_encode(array($nbEventDelete, $nbDocSuiteDelete, $nbDocBlobDelete));
?>