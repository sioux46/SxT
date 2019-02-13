<!DOCTYPE html>
<html>
<head>
<!--	<meta http-equiv="content-type" content="text/html; charset=utf-8" />  -->
<!-- 	<base href="dedi-elv.isep.fr/sioux/analyse/" />   -->
	<link rel="shortcut icon" href="Images/favicon.ico" type="image/x-icon" />
	<link href="styles/reset.css" rel="stylesheet" type="text/css">
	<link href="styles/sxt_index.css" rel="stylesheet" type="text/css">
	<script src="lib/jquery-2.1.0.min.js"></script>
	<script src="styles/sxt_index.js" type="text/javascript"></script>
	<script src="displayPng.js" type="text/javascript"></script>
	<script src="storeHisto.js" type="text/javascript"></script>
	<title>R&eacute;sultats</title>
</head>

<body>
<script  type="text/javascript">
	var queryData;
</script>

<div align="center">

<br />
<h1>R &eacute; s u l t a t s</h1>
<div class="boutGroupImage top"><img src="Images/Red_Bird_Stip.png" width="600" height="25"  alt="" /></div>

<!---------------------------- DEBUT     BOUTONS -------------------------->
<div class="boutGroup">
<a class="bout light-blue" href="./index.php">&nbsp;<span class="boutBold">Accueil</span>&nbsp;</a>
&nbsp;&nbsp;
<!--      href="./query" -->
<!-- 
<a class="bout green" href="javascript:history.back()" title="Revenir &agrave; la fen&ecirc;tre de requ&ecirc;tes">&nbsp;<span class="boutBold">Requ&ecirc;tes</span>&nbsp;</a>
-->
&nbsp;&nbsp;

<a class="bout gray" href="downloadSxTQuery.php?dl=sXtQuery.csv&chemin=./">
&nbsp;T&eacute;l&eacute;charger&nbsp;<span class="boutBold">fichier&nbsp;CSV</span>&nbsp;</a>
&nbsp;&nbsp;
</div><br /><br />


<!----------------------------- FIN     BOUTONS -------------------------->

<?php
require_once("MySQLrequest.php");
require_once("inc/connectMySql.php");
include_once('inc/logBug.php');
$idcom=connect();

?>

</body>
</html>
