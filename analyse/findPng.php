<?php

require_once("inc/connectMySql.php");
$base=connect();

$reponse = 'no';
$id = $_GET['id'];
if ($id > 0) {
	$query = "SELECT png from DocBlob WHERE id = '$id'";
	$result = $base->query($query);
	$row = $result->fetch_assoc();
	if (($row['png'][0] == '<') && ($row['png'][10] == 'd') && ($row['png'][11] == 'a')) {
		$reponse = $row['png'];
	}
}
//if ($id == 0) echo "zero";
echo $reponse;
//$result->close();
?>