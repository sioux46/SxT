<?php
function connect()
{
	include_once("inc/mySqlParam.php");
	$idcom = new mysqli(MYHOST,MYUSER,MYPASS,MYBASE);
	if (!$idcom) 
	{
	    echo "<script type=text/javascript>";
		echo "alert('Connexion Impossible à la base')</script>";
		exit();
	}
	$idcom->query("SET sql_mode = 'ONLY_FULL_GROUP_BY'");
//	$isa_base->query("SET NAMES 'utf8'");
	return $idcom;
}
?>