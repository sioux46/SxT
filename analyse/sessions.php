<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<!-- 	<base href="dedi-elv.isep.fr/sioux/analyse/" />   -->
	<link rel="shortcut icon" href="Images/favicon.ico" type="image/x-icon" />
	<link href="styles/reset.css" rel="stylesheet" type="text/css">
	<link href="styles/sxt_index.css" rel="stylesheet" type="text/css">
	<script src="sessions.js" type="text/javascript"></script>
	<title>SiouXanalyse: Requ&ecirc;tes</title>
</head>

<body>
<div align="center">
<h1>S e s s i o n s</h1>
<img  src="Images/Red_Bird_Stip.png" alt=""  width="760" height="22"/>
<br />
<!---------------------------- DEBUT     BOUTONS -------------------------->
<div class="boutGroup" align="left">
&nbsp;&nbsp;
<a class="bout red"  href="./index">&nbsp;<span class="boutBold">Accueil</span>&nbsp;</a>&nbsp;&nbsp;
<!--
<a class="bout light-blue" href="./query" title="Ouvrir une nouvelle fen&ecirc;tre de rqu&ecirc;tes">&nbsp;<span class="boutBold">Requ&ecirc;tes</span>&nbsp;</a>
-->
</div>
<!----------------------------- FIN     BOUTONS -------------------------->

<?php //////////////////////////////////////////////////////////////////////  
include_once('inc/logBug.php'); 
//logbug("test"); 
require_once("inc/connectMySql.php");
require_once("MySQLrequest.php");
$idcom=connect();
////----------------------------------------------------------------------------
// ------------------------------  Requête Session  ----------------------------
echo '<form method="post" action="displayRequest.php" name="choixMul" onSubmit="return verifChoixMul()">';

echo '<span class="titre light-blueColor large">Choisissez zero, une ou plusieurs sessions...</span><br /><br />';

//echo '<fieldSet style="border:2px solid #47A;">';
$requete="SELECT sessionId, date, time, freeField1, freeField2, freeField3, freeField4, freeField5 FROM Session ORDER BY id";
$bulle = "&nbsp;&nbsp;&nbsp;&nbsp;S&eacute;lectionnez&nbsp;des&nbsp;sessions&nbsp;puis&nbsp;construisez&nbsp;votre&nbsp;requ&ecirc;te.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pour&nbsp;une&nbsp;requ&ecirc;te&nbsp;concernant&nbsp;l'ensemble&nbsp;des&nbsp;sessions,&nbsp;d&eacute;s&eacute;lectionnez&nbsp;la&nbsp;derni&egrave;re&nbsp;session&nbsp;qui&nbsp;est&nbsp;s&eacute;lectionn&eacute;e&nbsp;par&nbsp;d&eacute;faut.";
$result = $idcom->query($requete);
echoResultList($result, 16, $bulle);
echo '<br /> <p style="margin-top:6px" class="petit">SELECT sessionId,date,time,freeField1,freeField2,freeField3,freeField4,freeField5 FROM Session ORDER BY id</p>';
		
echo "<br /><br />";

$idcom->close();
/////////////////////////////////////////////////////////////////////////// ?>

</body>
</html>
