<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<!-- 	<base href="dedi-elv.isep.fr/sioux/analyse/" />  -->
	<link rel="shortcut icon" href="Images/favicon.ico" type="image/x-icon" />
	<link href="styles/reset.css" rel="stylesheet" type="text/css" />
    <link href="styles/sxt_index.css" rel="stylesheet" type="text/css" />
	<script src="lib/jquery-2.1.3.min.js"></script>
    <script src="styles/sxt_index.js" type="text/javascript"></script>
    <script src="index.js" type="text/javascript"></script>
    <title>SiouXtrack</title>
</head>

<body>
<script type="text/javascript">
//  setInterval(function () {window.location.href = window.location.href}, 900000);
</script>
<script>
	if  (!localStorage.getItem('SXThisto')) localStorage.setItem('SXThisto', '');
	if  (!localStorage.getItem('SXTreducValue')) localStorage.setItem('SXTreducValue', 1);
</script>
<div align="center">
<!--+++++++++++++++++++++++++- ENTÊTE     INDEX ++++++++++++++++++++++++++-
<div style="position:fixed; z-index:1000; background:#FFF; right:0%; left:0%;">  -->
<div class="boutGroupImage siouxImg"><img src="Images/Red_Bird_Lutin.png"  width="600" height="170" /></div>

<!--+++++++++++++++++++- DEBUT     BOUTONS  width="284" height="89"-------------------------->
<div class="boutGroup">
<a class="bout chrome" href="./downloadSxT_d-ffx.php?dl=d-siouxtrack.xpi&chemin=/firefox">
&nbsp;Pour&nbsp;<span class="boutBold">Firefox</span>&nbsp;</a>

<a class="bout mauve" href="https://addons.opera.com/fr/extensions/details/install-chrome-extensions">
&nbsp;Pour&nbsp;<span class="boutBold">Opera</span>&nbsp;</a>

<a id="query" class="bout opera"  href="https://chrome.google.com/webstore/detail/hmbonbeafhmjcpcfeabnnodjjlhpaedl/publish-accepted?authuser=0&hl=fr" target="_blank" >&nbsp;Pour&nbsp;<span class="boutBold">Chrome</span>&nbsp;</a>

&nbsp;&nbsp;&nbsp;&nbsp;
<a class="bout safari" href="../moocs.mov">
&nbsp;<span class="boutBold">Documentation</span>&nbsp;</a>

<a id="query" class="bout requetes"  href="query.php" target="_blank" >&nbsp;<span class="boutBold">Requ&ecirc;tes</span>&nbsp;</a>

</div>
<br /><br />
<!--+++++++++++++++++++++++++++++- FIN     BOUTONS +++++++++++++++++++++++++++++++-->

<!--.................................................. identification ...-->

		<div id="popupLogin" class="login" style="padding:10px 20px;">
			<h3  style="text-align:center;">- Identifiez-vous -&nbsp;</h3>
			<br />
		    <input id="username" type="text" style="text-align:center;"  name="user" id="observateur" value="" placeholder="Identifiant">
			<br />
		    <input id="password" type="password" style="text-align:center;" name="pass" id="password" value="" placeholder="Mot de passe">
			<br /><br />
			<button id="login-button" class="bout">&nbsp;&nbsp;Connection&nbsp;&nbsp;</button>
		</div>
		<br /><br /><br />

		<div id="admin-info" style="display:none;">
			<button id="sup-sessions-vide" class="bout">&nbsp;&nbsp;Supprimer les sessions vides&nbsp;&nbsp;</button>
			<button id="sup-events-vide" class="bout">&nbsp;&nbsp;Grand ménage de printemps&nbsp;&nbsp;</button>
<!----------------------------------------->

<?php /////////////////////////////////////////////////////////////////////  P H P
session_start();
session_unset();
include_once('inc/logBug.php');
//logbug("session");
require_once("inc/connectMySql.php");
require_once("MySQLrequest.php");

$idcom=connect();

//echo "<hr />";
//echo '<br />';

/*
echo "<strong style='color:red;'>";
echo "<p>Suite à un bug dans la dernière mise à jour de Google Chrome, les captures d'écrans sont impossibles dans SiouXtrack pour Chrome.</p><p>(détails ici --> https://code.google.com/p/chromium/issues/detail?id=352165)</p><p>En attendant la résolution du  problème, il faut utiliser Opera (version 16 ou +).</p>";
echo "</strong><br />";
*/
echo "<p class=\"titre\">Version, IP, date et heure de la derni&egrave;re session pour chaque utilisateur</p><br/><div>SELECT s1.userId, s1.version, s1.clientIP, s1.date, s1.time
FROM Session s1 LEFT JOIN Session s2 <br/>
ON s1.userId = s2.userId AND s1.id &lt; s2.id<br/>
WHERE s2.id IS NULL<br/>
ORDER BY date DESC, time DESC</div>

";
$requete = "SELECT s1.userId, s1.version, s1.clientIP, s1.date, s1.time FROM Session s1 LEFT JOIN Session s2 ON s1.userId = s2.userId AND s1.id < s2.id WHERE s2.id IS NULL ORDER BY date desc, time desc";
$result=$idcom->query($requete);
echoResultTable($result, 1);

echo "<br /><div class=\"boutGroupImage miniStripTop miniStrip\"><img  src=\"Images/Red_Bird_MiniStip.png\"  width=\"600\" height=\"13\" /></div><br /><br />";

echo "<br /><p class=\"titre\">Utilisateur, origine, date et heure des 50 derni&egrave;res sessions</p><br /><p>SELECT userId, origin, date, time FROM Session ORDER BY date DESC, time DESC LIMIT 50</p>";
$requete="SELECT userId, origin, date, time FROM Session ORDER BY date DESC, time DESC limit 50";
$result=$idcom->query($requete);
echoResultTable($result, 1);


$idcom->close();  /* Fermeture de la connexion*/
/////////////////////////////////////////////////////////////////////// ?>

</div>  <!-- fin admin-info  -->
<br />

<div class="boutGroupImage miniStripTop"><img src="Images/Red_Bird_bandeInvEnv.png"  width="600" height="80" /></div>
<p class="miniSiouxText">Red Bird, a Sioux Indian<br />
  from the Library of Congress REPRODUCTION NUMBER: LC-USZ62-107140 <br /></p>
<br /><br />
</div>
<!-- <a href=verifGlobalPassTest.php>pass<a>   -->
</body>
</html>
