<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<!-- 	<base href="dedi-elv.isep.fr/sioux/analyse/" />   -->
	<link rel="shortcut icon" href="Images/favicon.ico" type="image/x-icon" />
	<link href="styles/reset.css" rel="stylesheet" type="text/css">
	<link href="styles/sxt_index.css" rel="stylesheet" type="text/css">
	<script src="lib/jquery-2.1.3.min.js"></script>
	<script src="query.js" type="text/javascript"></script>
	<title>Requ&ecirc;tes</title>
</head>

<!--  onpageshow="loadHisto()"  onpagehide="saveHisto()"   -->
<body onload="addSelectOrderByStar(); restorePrefs(); loadExemples();" onpopstate="loadHisto()" onfocus="loadHisto();" onblur="saveHisto()">
<div align="center">


<br />
<h1>R&nbsp;e&nbsp;q&nbsp;u&nbsp;&ecirc;&nbsp;t&nbsp;e&nbsp;s</h1>
<div class="boutGroupImage top"><img id="sioux" src="Images/Red_Bird_Stip.png"  width="600" height="25" alt="" /></div>

<!-- +++++++++++++++++++++++++DEBUT     BOUTONS -------------------------->
<div class="boutGroup" align="left">
&nbsp;&nbsp;
<a class="bout light-blue"  href="./index.php">&nbsp;<span class="boutBold">Accueil</span>&nbsp;</a>&nbsp;&nbsp;
<!--
<a class="bout light-blue" href="./query" title="Ouvrir une nouvelle fen&ecirc;tre de rqu&ecirc;tes">&nbsp;<span class="boutBold">Requ&ecirc;tes</span>&nbsp;</a>
-->
</div>

<!-- +++++++++++++++++++++++ - FIN     BOUTONS -------------------------->

<?php //////////////////////////////////////////////////////////////////////
session_start();
include_once('inc/logBug.php');
//logbug("test");
//require_once("inc/connectMySql.php");
//$idcom=connect();
require_once("MySQLrequest.php");
////----------------------------------------------------------------------------

// --------------------------------------------------------------------------------
echo '<br />';
// ------------------------------  Requête Session  FORMULAIRE 1 ----------------------------
echo '<form method="post" action="displayRequest.php" target="_blank" name="choixMul">';


// ------------------------------- type de tri de la liste de sessions
echo '<br /><span class="titre light-blueColor large">Choisissez zero, une ou plusieurs sessions...</span><br /><br /><br />';

echo '<div id="order-sessions" style="display:none;">';
	echo '<br /><p class="titre gray" >Ordre des sessions:</p><br />';
	echo '<label for="sortSessionsUser" class="titre gray" title="Trier la liste de sessions par noms utilisateurs">userIds</label>';
	echo '<input type="radio" id="sortSessionsUser" name="sortSessions" value="user"  onclick="sortSessionsQuery(this)" />';

	echo '<label class="titre light-blueColor">&nbsp;</label>';

	echo '<input type="radio" id="sortSessionsDate" name="sortSessions" value="date" onclick="sortSessionsQuery(this)" />';
	echo '<label for="sortSessionsDate" class="titre gray" title="Trier la liste de sessions par dates">&nbsp;dates</label>';
echo '</div>';

echo '<br />';
echo '<label for="orderSessionsAsc" class="titre gray" title="Trier la liste de sessions par dates ascendantes">&nbsp;dates&nbsp;&nbsp;asc.</label><input type="radio" id="orderSessionsAsc" name="orderSessions" value="asc" onclick="sortSessionsQuery(this)" />';

echo '<label class="titre light-blueColor">&nbsp;&nbsp;&nbsp;</label>';

echo '<input type="radio" id="orderSessionsDesc" name="orderSessions" value="desc" onclick="sortSessionsQuery(this)" /><label for="orderSessionsDesc" class="titre gray" title="Trier la liste de sessions par dates descendantes">dates&nbsp;desc.</label>';

echo '<br /><p id="username" style="text-align:left; padding-left:65px; padding-bottom:5px; font-size:medium;"></p>';
//echo '<br /><br />';

//echo '<hr />';


//---------------------------------    liste des sessions


$bulle = "&nbsp;&nbsp;&nbsp;&nbsp;S&eacute;lectionnez&nbsp;des&nbsp;sessions&nbsp;puis&nbsp;construisez&nbsp;votre&nbsp;requ&ecirc;te.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pour&nbsp;une&nbsp;requ&ecirc;te&nbsp;concernant&nbsp;l'ensemble&nbsp;des&nbsp;sessions,&nbsp;ne&nbsp;rien&nbsp;s&eacute;lectionner.\n";

// echo "<br /> <p style=\"margin-top:6px\" class=\"petit\" id=\"sessionsListQuery\"></p><br />\n";

$nbLig = 20;
// <table  style='overflow:auto'><tr>
echo "<select title=$bulle class=\"selMul body\" multiple id=\"sessionsList\" name=\"list[]\" size=$nbLig><br /><br />\n";
//echo '<script>', "\n";
//echo "sortSessionsQuery('load');\n";
//echo '</script>', "\n";
echo "</select>";

//--------------------------------- suppression sessions
//echo '<form method="post"  target="_blank" action="doDeleteSessions.php" onSubmit="return verifSuppSessions()">';
echo '<br /><br /><button id="deleteSessions" class="bout"><span style="color:red;">Supprimer les sessions sélectionnées</span></button>';
echo '<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>';
//--------------------------------- télécharger csv
echo '<button id="downloadCsv" class="bout"><span style="color:green;">Télécharger le fichier CSV des sessions sélectionnées</span></button><br /><br /><br />';
//echo '<a class="bout" href="downloadSxTQuery.php?dl=sXtQuery.csv&chemin=./">Télécharger le fichier CSV</a>';


//-------------------------------   choix  reducValue capture écran
echo '<label class="titre gray">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Echelle des captures d\'&eacute;cran:</label><span id="SelectReduc"></span>&nbsp;&nbsp;&nbsp;&nbsp;', "\n";
echo '<script>addSelectReduc();</script>';
echo '<br /><br /><br />';


//  													REPLAY SESSIONS
echo '<span class="titre light-blueColor large">...puis rejouez les sessions choisies</span>';
echo '<br /><br /><br />';

// MODE CHANTIER: disabled='disabled' style='opacity:0.5;'
echo "<button onmouseup='this.blur();' onclick=\"$('#replayFlag').val('replay');\" class='buttonQuest titre medium light-blueColor topLight-blue body' type='submit' title='Rejouer les sessions sélectionnées'>- SiouXplay -</button>";
echo '<input hidden name="replayFlag" id="replayFlag" value="0">';
echo '<br /><br /><br /><br />';
echo '<div class="boutGroupImage miniStripBottom"><img src="Images/Red_Bird_MiniStip.png" width="600" height="13" /></div>';

//													CONSTRUIRE REQUETE
echo '<br /><br />';
echo '<span class="titre light-blueColor large">...ou construisez une requ&ecirc;te</span>';
echo '<br /><br /><br />';
echo '<div class="titre">';



// -----------------------------------------------------  S E L E C T
echo '<label class="titre red">SELECT</label><br />';

echo '<input type="checkbox" name="globalSelectDistinct" title="Ne conserver que des lignes diff&eacute;rentes (suppression des doublons)" id="selDict"><label for="selDist" class="titre gray">DISTINCT</label>&nbsp&nbsp;&nbsp&nbsp;&nbsp;&nbsp;';

echo '<input type="radio" id="distinctCountStarStar" name="distinctCountStar" value="star" title="S&eacute;lectionner toutes les colonnes">*</input>&nbsp;';
echo '<input type="radio" id="distinctCountStarCountStar" name="distinctCountStar" value="countStar" title="Compter les lignes (par groupes s\'il y a une clause GROUP BY)"><label class="titre gray">COUNT</label>(*)</input>';


echo "<br />";
echo '<fieldSet id="selectSelect"></fieldSet>';
echo '<input type="button" onclick="addSelectSelect()" value="+">';
echo '<br /><hr />';
//						FROM
echo '<label class="titre red">FROM&nbsp;</label><label class ="titre">EventTable</label>
<br /><hr />';

//                       W H E R E
echo '<label class="titre red">WHERE</label><br />';
echo '<div class="titre gray" id="divAndOr" hidden="hidden"><input type="radio" checked name="andOr" value="AND">AND</input>&nbsp;&nbsp;';
echo '<input type="radio" name="andOr" value="OR">OR</input></div>';

echo '<fieldSet id="selectWhere"></fieldSet>';
echo '<fieldSet id="selectSelect"></fieldSet>';
echo '<input type="button" onclick="addSelectWhere()" value="+">';
echo '<br /><hr />';

//						GROUP BY
echo '<label class="titre red">GROUP BY</label><br />';
echo '<fieldSet id="selectGroupBy"></fieldSet>';

echo '<input type="button" onclick="addSelectGroupBy()" value="+">';
echo '<br /><hr />';

//					     ORDER BY
echo '<label class="titre red">ORDER BY</label><br />';
echo '<input type="checkbox" name="countStarOrderBy" title="Ordonner par effectif des groupes de lignes d&eacute;finis dans la clause GROUP BY"><label class="titre gray">COUNT</label>(*)&nbsp;</input>';
echo '<span id="selectOrderByStar"></span>';
echo '<fieldSet id="selectOrderBy"></fieldSet>';

echo '<input type="button" onclick="addSelectOrderBy()" value="+">';
echo '<br /><hr />';

//						LIMIT
echo '<label class="titre red">LIMIT</label>
<input class="limit" type="number" min="0" step="1" value="0" name="limit1"></input>
<input class="limit" type="number" min="1" step="1" value="1000" name="limit2" ></input>';

//echo '</fieldSet>';
echo '<hr /><br />';

//   ................................................ submit

//--------------------------------   afficher Png
echo '<span class="titre ">Faut-il afficher les captures d\'&eacute;cran ?</span><br />';
echo '<input type="checkbox" id="showPng" name="showPng" onchange="checkPng();" title="Afficher les captures d\'écran">';
echo '<label class="titre gray">Afficher</label><br /><br /><br />';

echo "<button onclick=\"$('#replayFlag').val('0');\"  onmouseup='this.blur();' class='buttonQuest titre medium light-blueColor topLight-blue body' type='submit'>- Exécuter -</button>";
echo '<br /><br />';

echo '</div></form>';


echo '<br /><br />';

echo '<div class="boutGroupImage miniStripBottom"><img src="Images/Red_Bird_MiniStip.png" width="600" height="13" /></div>';


//		----------------------------------		Requêtes sauvegardées
echo '<br /><br />';
//echo '<div class="boutGroupImage miniStripBottom"><img src="Images/Red_Bird_MiniStip.png" width="600" height="13" /></div>';
//echo '<p class="titre medium light-grayColor" style="margin-bottom:1px">Requêtes sauvegardées</p>';

echo '<div class="titre light-blueColor large">...ou choisissez une requ&ecirc;te sauvegard&eacute;e</div>';

echo '<br />';

echo '<select onmouseup="clickExemple();" class="light-grayColor selMul body" size="8" id="exemples" title="Cliquez sur une requ&ecirc;te sauvegardée pour l\'ex&eacute;cuter dans le champ des requ&ecirc;tes libres ci-dessous"></select>';
echo '<br /><br />';

echo '<button class="bout" onclick="deleteExemple()"  title="Supprimer la requ&ecirc;te sauvegard&eacute;e s&eacute;lectionn&eacute;e"><span style="color:red;">&nbsp;&nbsp;&nbsp;&nbsp;Supprimer la s&eacute;lection&nbsp;&nbsp;&nbsp;&nbsp;</span></button><br />';


//echo '<input type="button" value="-" onclick="deleteExemple()" title="Supprimer la requ&ecirc;te sauvegard&eacute;e s&eacute;lectionn&eacute;e"></input>';
//echo '<label class="titre light-grayColor">&nbsp;Supprimer la s&eacute;lection</label>';


// -------------------------------  Requête libre  ---------------------------

echo '<form method="post" action="displayRequest.php"  target="_blank" name="libre"  onSubmit="return verifLibre()">';
echo '<br /><br /><br />';

echo '<div class="titre light-blueColor large">...ou entrez une requ&ecirc;te libre</div>';
//				texte requete libre    style="color:white; background-color:#7BB"
echo   '<textarea placeholder="SELECT..." style="margin-top:6px; margin-bottom:0px; border:2px solid #47A; color:#47A; background-color:#FFF; font-weight:bold;"  class="selMul body" rows="6" cols="120" name="request" id="requestLibre" title="Tapez ou collez une requ&ecirc;te"></textarea><br />';

//				boutons requete libre
echo '<br />';
//echo '<button type="button" class="buttonQuest titre medium light-grayColor topGreen body" onclick="addExemple(this)"  title="Ajouter aux requ&ecirc;tes sauvegard&eacute;es la s&eacute;lection faite dans la requ&ecirc;te libre ou dans l\'historique">- Sauvegarder -</button>';



//echo '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
echo '<button onmouseup="this.blur();" class="buttonQuest titre medium light-blueColor topLight-blue body" type="submit">- Exécuter -</button><br />';

//   éléments cachés
echo '<input hidden name="showPng" id="showPngLibre">';
echo '<input hidden name="reducValue" id="reducValueLibre">';
echo '<select multiple hidden name="list[]" id="sessionsListLibre"></select>';
echo '</form>';

echo '<button class="bout" onclick="addExemple(this)"  title="Ajouter aux requ&ecirc;tes sauvegard&eacute;es la s&eacute;lection faite dans la requ&ecirc;te libre ou dans l\'historique"><span style="color:green;">&nbsp;&nbsp;&nbsp;&nbsp;Ajouter aux requêtes sauvegardées&nbsp;&nbsp;&nbsp;&nbsp;</span></button><br />';

echo '<br /><br />';



//		---------------------------------		 historique

echo '<p class="titre medium blackColor" style="margin-bottom:1px">Historique</p>';
echo '<br />';

echo '<textarea class=" selMul body" rows="20" cols="88" id="requestHisto" onfocus="loadHisto()" onblur="saveHisto()" title="Toutes les requ&ecirc;tes ex&eacute;cut&eacute;es sont ajout&eacute;es &agrave; l\'historique. Editez les et copiez-collez les dans le champ des requ&ecirc;tes ci-dessus pour une nouvelle ex&eacute;cution"></textarea><br />';
echo '<br /><br />';
echo '<div class="boutGroupImage miniStripTop"><img src="Images/Red_Bird_bandeInvEnv.png"  width="600" height="80" /></div>';
echo '<p class="miniSiouxText">Red Bird, a Sioux Indian<br />';
echo  'from the Library of Congress REPRODUCTION NUMBER: LC-USZ62-107140 <br /></p>';
echo '<br /><br />';
echo '<br /><br /><br />';
//$idcom->close();
/////////////////////////////////////////////////////////////////////////// ?>

<script type="text/javascript">
	loadHisto();
</script>
</body>
</html>
