<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<!-- 	<base href="dedi-elv.isep.fr/sioux/analyse/" />   -->
	<link rel="shortcut icon" href="Images/favicon.ico" type="image/x-icon" />
	<link href="styles/reset.css" rel="stylesheet" type="text/css">
	<link href="styles/sxt_index.css" rel="stylesheet" type="text/css">
	<link href="styles/replay.css" rel="stylesheet" type="text/css">
	<script src="styles/sxt_index.js" type="text/javascript"></script>
	<script src="lib/jquery-2.1.3.min.js"></script>
	<script src="displayPng.js" type="text/javascript"></script>
	<script src="storeHisto.js" type="text/javascript"></script>
<!--		<script src="replay.js" type="text/javascript"></script>  -->
	<title>R&eacute;sultats</title>
</head>

<body>
<script  type="text/javascript">
	var queryData;
</script>



<br />
<div align="center">
<h1 id="h1-replay">R &eacute; s u l t a t s</h1>
<div class="boutGroupImage top"><img src="Images/Red_Bird_Stip.png" width="600" height="25"  alt="" /></div>
</div>
<!--********************* DEBUT     BOUTONS -------------------------->
<div class="boutGroup">
<a class="bout light-blue" href="./index.php">&nbsp;<span class="boutBold">Accueil</span>&nbsp;</a>
&nbsp;&nbsp;
<!--      href="./query" -->
<!--
<a class="bout green" href="javascript:history.back()" title="Revenir &agrave; la fen&ecirc;tre de requ&ecirc;tes">&nbsp;<span class="boutBold">Requ&ecirc;tes</span>&nbsp;</a>

&nbsp;&nbsp;

<a class="bout gray" href="downloadSxTQuery.php">
&nbsp;T&eacute;l&eacute;charger&nbsp;le&nbsp;<span class="boutBold">fichier&nbsp;CSV</span>&nbsp;</a>
&nbsp;&nbsp;
-->
</div>

<div align="center">
<!--**********************- FIN     BOUTONS -------------------------->


<?php
// echo 'coucou0';
session_start();
require_once("MySQLrequest.php");
require_once("inc/connectMySqlW.php");
//include_once('inc/logBug.php');

$idcom=connect();
$maxPost = 100;

// echo 'coucou2'; // exit; // debug

if (isset($_POST)) {
//print_r($_POST);
//exit;
	//			S E S S I O N S
	if (isset($_POST['list'])  && !empty($_POST['list'])) {
		$keys = $_POST['list'];
		$sessions = "sessionId IN (";
		foreach ($keys as $key) {
			$sessions = $sessions . "'" . $key . "', ";
		}
		$sessions = substr($sessions, 0, -2) . ")";
	}
	else $sessions = "";

	if(isset($_POST['replayFlag']) && $_POST['replayFlag'] == 'replay') {     //  REPLAY SESSIONS
		$replay = 1;
	}
	else $replay = 0;

	if(isset($_POST['request'])) {    					// requete LIBRE  -------
		$requeteLibre = true;
		$requete = stripcslashes($_POST['request']);
		$requete = str_replace('EventTable', 'Event_L_DocSuite', $requete);

		if (strstr($requete, 'WHERE') && $sessions !='') {
			$requete = str_replace('WHERE ', 'WHERE '.$sessions.' AND ', $requete);
		}
		else if (strstr($requete, 'where') && $sessions !='') {
			$requete = str_replace('where ', 'WHERE '.$sessions.' AND ', $requete);
		}
		else if ($sessions !='') {
			$requete = str_replace('Event_L_DocSuite ', 'Event_L_DocSuite WHERE '.$sessions.' ', $requete);
		}
	}
	else if ($replay) {									//  REPLAY SESSIONS
		$requete = "SELECT * FROM Event_L_DocSuite WHERE $sessions ORDER BY timeStamp";

	}
	else {
		$requeteLibre = false;							// NON LIBRE  ---------
		//			S E S S I O N S
		$distinct = (isset($_POST['globalSelectDistinct']))? "DISTINCT":"";
		$limit1 = (($_POST['limit1']) != "" )? $_POST['limit1'] . ", ":"";
		$limit2 = (($_POST['limit2']) != "" )? $_POST['limit2']:"";
		if ($limit1 != "" && $limit2 == "") $limit = "";
		else $limit = $limit1 . $limit2;
		if ($limit != "") $limit = 'LIMIT ' . $limit;

		if ($_POST['distinctCountStar'] == "star") $colonnes = ' * ';
		else {
			if ($_POST['distinctCountStar'] == "countStar") $colonnes = "COUNT(*),";
			else $colonnes = "";
			for ($colName = 0; $colName < $maxPost; $colName++) {
			if (isset($_POST["selectValue$colName"])) {
				if ($_POST["selectValue$colName"] != '-') {
					if ($_POST["selectFunc$colName"] != '-')
							$colonnes = $colonnes . $_POST["selectFunc$colName"] . "(";
					if (isset($_POST["selectDistinct$colName"]))
							$colonnes = $colonnes . "DISTINCT ";
					if ($_POST["selectFunc$colName"] != '-') {
						$colonnes = $colonnes .  $_POST["selectValue$colName"] . "),";
					}
					else {
						$colonnes = $colonnes . ' ' . $_POST["selectValue$colName"] . ',';
					}
				}
			}}
			$colonnes = substr($colonnes, 0, -1);
		}
		//				W H E R E
		$where = "";
		for ($colName = 0; $colName < $maxPost; $colName++) {
		if (isset($_POST["whereColName$colName"])) {
			$whereValue = $_POST["whereValue$colName"];
			$whereCompValue = $_POST["whereCompValue$colName"];
			$whereColName = $_POST["whereColName$colName"];
			if (($whereValue != '-') && ($whereValue != '') && ($whereColName != '-')) {
				if ($where != "") $where = $where . $_POST["andOr"] . " ";
				$where = $where . $whereColName . ' ';
				$where = $where . $whereCompValue . ' ';
				$where = $where . "'" . $whereValue . "' ";
				$nextCol = $colName + 1;
			}
		}}
		if ($where != "") {
			$where = substr($where, 0, -1);
			$where = " AND (" . $where . ") ";
		}
		//				GROUP BY
		$groupBy = "";
		for ($colName = 0; $colName < $maxPost; $colName++) {
		if (isset($_POST["groupByValue$colName"])) {
			$groupByValue = $_POST["groupByValue$colName"];
			if ($groupByValue != '-') {
				$groupBy = $groupBy . ' ' . $groupByValue . ',';
			}
		}}
		if ($groupBy != "") {
			$groupBy = "GROUP BY " . $groupBy;
			$groupBy = substr($groupBy, 0, -1);
		}
		//				ORDER BY
		if (isset($_POST["countStarOrderBy"])) {
			$orderBy = "COUNT(*) " . $_POST["orderByOrderStar"] . ",";
		}
		else $orderBy = "";
		for ($colName = 0; $colName < $maxPost; $colName++) {
		if (isset($_POST["orderByValue$colName"])) {
			$orderByValue = $_POST["orderByValue$colName"];
			$orderByOrder = $_POST["orderByOrder$colName"];
			if (($orderByValue != '-') && ($orderByOrder != '-')) {
				$orderBy = $orderBy . ' ' . $orderByValue . ' ' . $orderByOrder . ',';
			}
		}}
		if ($orderBy != "") {
			$orderBy = "ORDER BY " . $orderBy;
			$orderBy = substr($orderBy, 0, -1);
		}
		if ($where == "" && $sessions == "") $sessionsWhere = "";
		else {
			if ($where != "" && $sessions == "") $where = substr($where, 5);
			$sessionsWhere = "WHERE $sessions $where";
		}
		$requete = "SELECT $distinct $colonnes FROM Event_L_DocSuite $sessionsWhere $groupBy $orderBy $limit";
	}
	$requete = ltrim(rtrim($requete));

//											****** AFFICHAGE DES PNG *******

	$showPng = $_POST["showPng"];
	$reducPng = $_POST["reducValue"];

	if ($replay
		|| stristr($requete, 'GROUP BY')
		|| stristr($requete, 'DISTINCT')
		|| stristr($requete, 'COUNT')
		|| !$showPng) $colPng = -1;
	else if ((stristr($requete, '*')) && stristr($requete, 'Event_L_DocSuite')) {
		$colPng = 28; // *
	}
	else if (stristr($requete, 'Event_L_DocSuite')) {
		$select = substr($requete, 0, 7);
		$requete = str_replace($select, $select.'blobId, ', $requete);
		$colPng = 0;  // POINTEUR VERS PNG EN COL 0
		if (stristr($requete, 'SELECT blobId,   FROM')
			|| stristr($requete, 'SELECT blobId,  FROM')
			|| stristr($requete, 'SELECT blobId, FROM')) {
			$select = substr($requete, 0, 14);
			$requete = str_replace($select, 'SELECT blobId', $requete);
		}
	}
	else $colPng = -1;  // PAS DE PNG

	$requeteDisplay = substr($requete,0,strlen($requete) );
	$requeteDisplay = str_replace('Event_L_DocSuite', 'EventTable', $requeteDisplay);
	if ($colPng == 0) {
		if (stristr($requete, 'SELECT blobId,'))
			$requeteDisplay = str_replace('SELECT blobId,', 'SELECT', $requeteDisplay);
		else
			$requeteDisplay = str_replace('SELECT blobId', 'SELECT', $requeteDisplay);
	}
	echo "<p class=\"titre\" id=\"requestText\">$requeteDisplay</p><br />";
	echo '<button id="downloadCsv" class="bout"><span style="color:green;">Télécharger le fichier CSV</span></button><br /><br />';


//												****** requete info sur curseur
	if ($colPng != -1) {
		if ($requeteLibre == false)
			$requetePngInfo = "SELECT winInnerHeight, clientX, clientY,targetRectL, targetRectT, targetRectW, targetRectH, type FROM Event_L_DocSuite $sessionsWhere $groupBy $orderBy $limit";
		else {
			$postRequete = stristr($requete, 'Event_L_DocSuite');
			$requetePngInfo = "SELECT winInnerHeight, clientX, clientY,targetRectL, targetRectT, targetRectW, targetRectH, type FROM $postRequete";
		}
		$requetePngInfo = ltrim(rtrim($requetePngInfo));
		$resultPngInfo = $idcom->query($requetePngInfo);
	}
	else $requetePngInfo = false;

// ****************************************************************************
//	logbug('Disp requete: '.$requeteDisplay);
//	logbug('requete: '.$requete);



	$result = $idcom->query($requete);
	if (!$result) {
		print_r($idcom->error);
		exit;
	}

	if (!$replay) {
		echoResultTablePng($result, 1, $idcom, $colPng, $resultPngInfo, $reducPng);
		$result->data_seek(0);
	}

//echo $result->num_rows; //debug

	$array = arrayResult($result, 1);

//echo "coucou4"; //debug

	arrayToCsvFile($array, 'sXtQuery.csv');

	if ($replay) {
		$jsonArray  = json_encode($array);

//echo $array; exit; //debug

		echo "<script>";
		$reducPng = $_POST["reducValue"];
		echo "var reducShowPng = $reducPng;";
		echo "var sessions = $jsonArray;";
		echo "</script>";
		echo '<script src="replay.js"></script>';
	}
	else {
		echo "<script>";
		echo "var sessions;";
		echo "</script>";
	}

	$result->free_result();
}


?>
</div>

<?php
	if (!$replay) {
		echo "<script> storeHisto(); </script>";
		echo "</body></html>";
		exit;
	}
?>

<!--                  +++++++++++++++++   R E P L A Y	+++++++++++++++++++++++-->
<!--                  +++++++++++++++++   R E P L A Y	+++++++++++++++++++++++-->

<div id="global-replay" style="opacity:0;" class="center">
	<div id="top-board0" class="board top-board"></div>
	<div id="top-board1" class="board top-board"></div>

<div id="bottom-boards" style="opacity:0">
	<div id="top-board2" class="board top-board"></div>
	<input type="text" id="event-url">
	<div id="timeline00" class="board top-board" title="Click pour dézoomer"></div>
	<div id="timeline0" class="board top-board" title="Click pour afficher l'évènement courant. Drag pour déplacer la timeline.">
		<div id="dureeWidthDiv"></div>
	</div>
	<div id="timeline" class="board top-board" title="Drag pour zoomer. Click pour aller à l'évènement suivant."></div>
	<div id="timelineZoom" class="board top-board"  title="Drag pour zoomer. Click pour aller à l'évènement suivant."></div>
	<div id="top-board3" class="board top-board"></div>
	<div id="top-board4" class="board"></div>
	<div id="top-board5"class="board">
		<input type="text" id="event-type">
		<div id="event-target"></div>
	</div>
	<div id="top-board6" class="board top-board"></div>
	<div id="top-board7" class="board top-board"></div>


	<div id="left-board">     <!--  L E F T    B O A R D  -->

		<br /><br /><br /><br /><br /><br /><br /><br />
		<br /><br /><br />

<!--		<p style="margin-left:6px;color:red;font-size:24px;font-weight:bold;">SiouXplay</p>-->
		<br /><br />
		<div class="boutGroupReplay">
			<p style="font-size:18px;" class="petit-titre petit-t-auto">Play/Pause</p>
			<button onmouseup="this.blur();" id="foreward-multi" class="titre large blackColor boutReplay body" title="Play/Pause">&nbsp;&nbsp;&nbsp;<span>>></span></button>
			<div id="count-down" title="Temps avant l'évènement suivant"></div>
		</div>

<!--		<label for="speed" class="titre medium light-blueColor" title="vitesse">&nbsp;V:</label>
		<input type="number" id="speed" min="0.1" max="10" value="1">-->

		<br /><br />

		<div class="boutGroupReplay">
			<p style="font-size:18px;" class="petit-titre petit-t">Pas à Pas</p>
			<button title="Evènement Précédant" onmouseup="this.blur();" id="backward" class="titre large blackColor boutReplay bootReplay-l-one body"><span><&nbsp;</span></button>
			<button title="Evènement suivant" onmouseup="this.blur();" id="foreward" class="titre large blackColor boutReplay bootReplay-r-one body"><span>&nbsp;></span></button>

<!--			<label for="event-num" class="titre medium light-blueColor" title="Position" style="color:white;">></label>-->
			<input  type="text" id="event-num" min="1" title="Evènement courant">
			<button id="new-session" onmouseup="this.blur();"  title="Créer une nouvelle session à partir de l'évènement courant">&nbsp;+&nbsp;</button>
			<br /><br />
<!--			<label for="event-num" class="titre medium light-blueColor" title="Position" style="color:white;"><</label>-->

			<p style="font-size:18px;" class="petit-titre petit-b">Début-Fin</p>
			<button title="Premier évènement" onmouseup="this.blur();" id="begin" class="titre large blackColor boutReplay bootReplay-l body" ><span>|<</span></button>
			<button title="Dernier évènement" onmouseup="this.blur();" id="end" class="titre large blackColor boutReplay bootReplay-r body"><span>>|</span></button>
		<br /><br /><br />
		</div>




<!--		<label for="constantSpeed" class="titre  light-blueColor" title="séquencement constant">&nbsp;Réel</label>
		<input type="checkbox" id="constantSpeed" name="speedType" value="constantSpeed" />-->

	</div>    				 <!-- fin  L E F T    B O A R D  -->

	<div id="right-board"></div>

	<div id="screen">
		<div id="bille">
			<div id="billePng"></div>
			<div id="billePngClick"></div>
			<div id="clicPoint"></div>
		</div>
		<div id="billeFloat">
			<div id="billeF1"><img src="Images/empreinte.png" /></div>
			<div  id="billeF2"><img src="Images/empreinte.png" /></div>
		</div>
		<div id="screenshot"></div>
		<div id="screenshot-back"></div>
		<div id="screenshot-frame"></div>
	</div>
	<div id="miniDocWin0">
		<div id="miniDocWin">
			<div id="miniWin">
				<div id="miniDoc"></div>
			</div>
		</div>
	</div>
</div>
</div>









</body>
</html>
