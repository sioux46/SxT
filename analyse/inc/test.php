<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);


function connect()
{
	// include_once("inc/mySqlParamW.php");

	define("MYHOST","localhost");
	define("MYUSER","sioux");
	define("MYPASS","sioux");
	define("MYBASE","siouxtrack");
        echo "coucou avant le new<hr>" ;
// 	echo MYHOST,MYUSER,MYPASS,MYBASE;
	$idcomW = new mysqli(MYHOST,MYUSER,MYPASS,MYBASE);
	// echo "<br> idcomW[" . $idcomW . "]<br>";

	/* Vérification de la connexion */
	if ($idcomW->connect_errno) {
    	echo "Échec de la connexion:  $idcomW->connect_error";
    	exit();
	}
	if (!$idcomW)
	{
	    echo "<script type=text/javascript>";
		echo "alert('Connexion mode Write Impossible à la base')</script>";
		exit();
	}
	echo 'essai connection <br>';
	$idcomW->query("SET sql_mode = 'ONLY_FULL_GROUP_BY'");
	echo 'query ok';
//	$isa_base->query("SET NAMES 'utf8'");
	return $idcomW;
}

echo "on vas se connecter ...<hr" ;

$connect = connect();



echo "apres connecttion ...<hr>" ;


?>
