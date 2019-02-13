<?php
session_start();
require_once("inc/connectMySqlW.php");
require_once("MySQLrequest.php");
$idcom=connect();
$order = $_GET['query'];
$query = 'SELECT sessionId, date, time, freeField1, freeField2, freeField3, regExp1, regExp2, regExp3, origin, autoRecord';
if ($_SESSION['username'] == 'RedBird') {
	$query = 'SELECT sessionId, date, time, serverURL, userId, origin, autoRecord, freeField1, freeField2, freeField3, regExp1, regExp2, regExp3 FROM Session ORDER BY ' . $order;
}
else if (isset($_SESSION['username']) && $_SESSION['username'] != '') {
	$query .= " FROM Session WHERE userId = '" . $_SESSION['username'] . "' ORDER BY " . $order;
}
else {
	$query .= " FROM Session WHERE userId = 'Anonyme' ORDER BY " . $order;
}
$result = $idcom->query($query);
while ($row = $result->fetch_array(MYSQLI_NUM)) {
	$ligne = "";
	$value = $row[0];
	$i = 0;
	$matches = array();
	foreach($row as $donn) {
		if(($i == 3) && ($_SESSION['username'] == 'RedBird')) {
			preg_match('/\.*\s\[(.*)\]$/',$donn,$matches);
//			$toto = $matches[1];  // bug PHP
			$ligne .= $matches[1] . ' ';
		}
		else {
			if ($i == 4 || $i == 5 || $i == 3) $ligne .= '[';
			else if ($i == 7 || $i == 8 || $i == 6) $ligne .= '/';
			if ($i != 0 ||  ($_SESSION['username'] == 'RedBird')) $ligne .= utf8_encode($donn);
			if ($i == 4 || $i == 5 || $i == 3) $ligne .= '] ';
			else if ($i == 7 || $i == 8 || $i == 6) $ligne .= '/ ';
			else $ligne .= ' ';
					
			if ($i == 2) {
				$query2 = "SELECT COUNT(*) FROM Event WHERE sessionId = '$value'";
				$result2 = $idcom->query($query2);
				$row2 = $result2->fetch_array(MYSQLI_NUM);
				$ligne = $ligne . ' *' . utf8_encode(sprintf("%04d",$row2[0])) . '* ';
			}
		}
		$i++;
	}
	echo "<option value=", $value, ">", $ligne, "</option>\n";
}
?>