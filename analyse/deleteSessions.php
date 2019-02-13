<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<!-- 	<base href="dedi-elv.isep.fr/sioux/analyse/" />   -->
	<link rel="shortcut icon" href="Images/favicon.ico" type="image/x-icon" />
	<link href="styles/reset.css" rel="stylesheet" type="text/css">
	<link href="styles/sxt_index.css" rel="stylesheet" type="text/css">
	<title>Suppression de sessions</title>
	
	<script type="text/javascript">
		function verifSuppSessions() {
			return(confirm("Supprimer les sessions sélectionnées ?"));
		}
	</script>
</head>

<body align="left">
<div align="center">
<br />
<h1>S u p p r e s s i o n&nbsp;&nbsp;&nbsp;&nbsp;d e&nbsp;&nbsp;&nbsp;&nbsp;s e s s i o n s</h1>
<img  src="Images/Red_Bird_Stip.png" alt=""  width="862" height="22"/>
<br />
<!---------------------------- DEBUT     BOUTONS -------------------------->
<div class="boutGroup" align="left">
&nbsp;&nbsp;
<a class="bout red"  href="./index.php">&nbsp;<span class="boutBold">Accueil</span>&nbsp;</a>&nbsp;&nbsp;
<!--
<a class="bout light-blue" href="./query" title="Ouvrir une nouvelle fen&ecirc;tre de rqu&ecirc;tes">&nbsp;<span class="boutBold">Requ&ecirc;tes</span>&nbsp;</a>
-->
</div>
<!----------------------------- FIN     BOUTONS -------------------------->

<?php //////////////////////////////////////////////////////////////////////  
include_once('inc/logBug.php'); 
//logbug("test"); 
require_once("inc/connectMySqlW.php");
require_once("MySQLrequest.php");
$idcom = connect();
////----------------------------------------------------------------------------//

// --------------------------     LISTE DES SESSIONS

echo '<form method="post"  target="_blank" action="doDeleteSessions.php" onSubmit="return verifSuppSessions()">';

echo '<span class="titre blackColor large">Sessions triées sur Session.date</span><br /><br />';

$requete="SELECT sessionId, date, time, userId, origin, freeField1, freeField2, freeField3, freeField4, freeField5 FROM Session ORDER BY date, time";
$bulle = "&nbsp;&nbsp;&nbsp;&nbsp;S&eacute;lectionnez&nbsp;des&nbsp;sessions";
$result = $idcom->query($requete);
echoResultList($result, 20, $bulle, "noSel");
echo "<br /> <p style=\"margin-top:6px\" class=\"petit\">$requete</p>";
		
echo "<br />";
echo '<button class="titre medium blackColor topBlack body" type="submit">- Supprimer -</button>';
echo '<br /><br />';
echo '<img style="margin-top:2px; opacity:1;" src="Images/Red_Bird_MiniStip.png" width="862"><br /><br />';
echo "</form>";
// --------------------------     LISTE DES USERS

echo '<form method="post"  target="_blank" action="doDeleteSessions.php" onSubmit="return verifSuppSessions()">';

echo '<span class="titre blackColor large">Sessions triées sur Session.userId</span><br /><br />';

$requete="SELECT sessionId, date, time, userId, origin, freeField1, freeField2, freeField3, freeField4, freeField5 FROM Session ORDER BY userId, date, time";
$bulle = "&nbsp;&nbsp;&nbsp;&nbsp;S&eacute;lectionnez&nbsp;des&nbsp;sessions";
$result = $idcom->query($requete);
echoResultList($result, 20, $bulle, "noSel");
echo "<br /> <p style=\"margin-top:6px\" class=\"petit\">$requete</p>";
		
echo "<br />";
echo '<button class="titre medium blackColor topBlack body" type="submit">- Supprimer -</button>';
echo '<br /><br />';
echo '<img style="margin-top:2px; opacity:1;" src="Images/Red_Bird_MiniStip.png" width="862"><br /><br /><br />';
echo "</form>";


echo '</div>';
$idcom->close();
/////////////////////////////////////////////////////////////////////////// ?>

</body>
</html>
