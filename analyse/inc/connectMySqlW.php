<?php
function connect()
{
	include_once("inc/mySqlParamW.php");
	$idcomW = new mysqli(MYHOST,MYUSER,MYPASS,MYBASE);
	if (!$idcomW)
	{
	    echo "<script type=text/javascript>";
		echo "alert('Connexion mode Write Impossible à la base')</script>";
		exit();
	}
	$idcomW->query("SET sql_mode = 'ONLY_FULL_GROUP_BY'");
//	$isa_base->query("SET NAMES 'utf8'");
	return $idcomW;
}
?>