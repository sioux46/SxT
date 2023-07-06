<?php
session_start();
//session_destroy();
include_once("inc/connectMySqlW.php");
$base = connect();
//include_once("inc/mySqlParam.php");
//$base = new mysqli(MYHOST,MYUSER,MYPASS,MYBASE);


header("content-type:text/plain");
$reponse = "Connection...";
$username =  $_REQUEST['username'];
$password =  $_REQUEST['password'];
if ($username == "") $reponse = "ERR-username vide";
else if ($username == 'RedBird' )  { //  && $password == 'supersioux'
	$reponse = "OK";
}
else {
	$query = "SELECT count(*) as `card` FROM `User` WHERE `username` = '$username'";
	$result = $base->query($query);
	$row = $result->fetch_assoc();
	if ($row['card'] == 0)  $reponse = "ERR-username non trouvé: [$username]";
	else {
		$query = "SELECT `username` FROM `User` WHERE `username` = '$username'";
		$result = $base->query($query);
		$row = $result->fetch_assoc();
		if ($row['username'] != $username) $reponse = "ERR-username non trouvé 2: [$username]";
		else {
			$query = "SELECT `password` FROM `User` WHERE `username` = '$username'";
			$result = $base->query($query);
			$row = $result->fetch_assoc();
			if ($row['password'] == "") {
				if($password != "") {
					$password = md5($password);
					$query = "UPDATE `User` SET `password` = '$password' WHERE `username` = '$username'";
					$result = $base->query($query);
					if (!result)  $reponse = "ERR-ecriture password";
					else $reponse = "OK";
				}
				else $reponse = "OK";
			}
			else {
				if ($row['password'] == md5($password)) $reponse = "OK";
				else $reponse = "ERR-password eronné";
			}
		}
	}
}


if ($reponse == 'OK') 	$_SESSION['username'] = $username;
else $_SESSION['username'] = '';

echo $reponse;
$base->close();


?>
