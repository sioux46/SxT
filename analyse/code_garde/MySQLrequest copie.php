<?php
//////////////////////////////////////////////////////////////////
/////////////////////    AFFICHAGE RESULT DANS LISTE
//////////////////////////////////////////////////////////////////
function echoResultList($result, $nbLig, $bulle, $sel) {
//	$result=$idcom->query($requete);
    if(!$result) {
    	echo "ERREUR!!!";
        echo "<br />";
        echo $idcom->error;
    }			
    else {
		if (!isset($nbLig)) $nbLig = 16;
    	$titres = $result->fetch_fields();
		$numRows = $result->num_rows; $r=0;
		echo "<select title=$bulle class=\"selMul body\" multiple id=\"sessionsList\" name=\"list[]\" size=$nbLig>\n"; 
    	while ($row = $result->fetch_array(MYSQLI_NUM)) {
    		$ligne = "";
			$value = $row[0];
    		foreach($row as $donn) {
    			$ligne = $ligne . $donn . " ";
    		}
			$r++;
			if (($numRows == $r) && ($sel == "sel")) $selected = "selected";
			else  $selected = "";
				
			echo "<option $selected value=", htmlentities($value), ">", htmlentities($ligne), "</option>\n";
    	}
		echo "</select>";
//    	$result->close();
    }
}
//////////////////////////////////////////////////////////////////
/////////////////////    AFFICHAGE RESULT DANS INNER HTML LISTE
//////////////////////////////////////////////////////////////////
function echoResultInnerList($result) {
		$numRows = $result->num_rows; 
    	while ($row = $result->fetch_array(MYSQLI_NUM)) {
    		$ligne = "";
			$value = $row[0];
    		foreach($row as $donn) {
    			$ligne = $ligne . $donn . " ";
    		}
			echo "<option $selected value=", htmlentities($value), ">", htmlentities($ligne), "</option>\n";
    	}
}
//////////////////////////////////////////////////////////////////
/////////////////////    AFFICHAGE RESULT DANS TABLE
//////////////////////////////////////////////////////////////////
function echoResultTable($result, $colTitles) {
    if(!$result) {
    	echo "ERREUR!!!";
        echo "<br />";
        echo $idcom->error;
    }			
    else {
		echo "<table>";
		if ($colTitles) {
			echo "($result->num_rows lignes)<br /><br />\n";
			$titres = $result->fetch_fields();			
			foreach($titres as $colonne) {
				echo "<th>", htmlentities($colonne->name), "</th>";
			}
		}
    	while ($row = $result->fetch_array(MYSQLI_NUM)) {
    		echo "<tr>";
    		foreach($row as $donn) {
    			echo "<td>", htmlentities($donn), "</td>";
    		}
    		echo "</tr>\n";
    	}
    	echo "</table>";
//    	$result->close();
    }
}
//////////////////////////////////////////////////////////////////
/////////////////////    AFFICHAGE RESULT DANS TABLE + PNG
//////////////////////////////////////////////////////////////////
function echoResultTablePng($result, $colTitles, $idcom, $colPng, $resultPngInfo, $reducShowPng) {
    if(!$result) {
    	echo "ERREUR!!!";
        echo "<br />";
        echo $idcom->error;
    }			
    else {
		$divIndex = 0;
		echo "<table>";
		
		if ($colTitles) {
		    echo "($result->num_rows lignes)<br /><br />\n";
		    $titres = $result->fetch_fields();
		    if ($colPng == 0) $stop = 1;
		    foreach($titres as $colonne) {
			if ($stop) {$stop = 0; continue;}
			echo '<th>', htmlentities($colonne->name), '</th>';
		    }
		}
    	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		if ($resultPngInfo) $rowPngInfo = $resultPngInfo->fetch_array(MYSQLI_NUM);
		echo '<tr>';
		if ($colPng == 0) $stop = 1;
    		foreach($row as $donn) {
		    if ($stop) {$stop = 0; continue;}
    		    echo '<td>', htmlentities($donn), '</td>';
    		}
    		echo '</tr>';
			
			if (($colPng != -1) && ($resultPngInfo)) {
			    $png = $row[$colPng];
			    if ($png) { 
				$requetePng = "SELECT png from DocBlob WHERE id = '$png'";
//				logbug($requetePng);
				$resultPng = $idcom->query($requetePng);
				$png = $resultPng->fetch_array(MYSQLI_NUM);
				if ($png && $png[0][0] == '<') {
				
				    if ($colTitles) {
				        if ($colPng == 0) $stop = 1;
					    foreach($titres as $colonne) {
				    	if ($stop) {$stop = 0; continue;}
						    echo '<th>', htmlentities($colonne->name), '</th>';
				        }
				    }

				    echo "</table><br /><br /><table><tr>\n";
				    echo "<div id=\"divpng$divIndex\" align=\"left\" class=\"png-png\"><div id=\"innerdivpng$divIndex\">$png[0]</div></div>"; // affichage PNG
										
					echo "<script>\n";
					echo "displayPng($divIndex,$rowPngInfo[0],$rowPngInfo[1],$rowPngInfo[2],$rowPngInfo[3],$rowPngInfo[4],$rowPngInfo[5],$rowPngInfo[6],\"$rowPngInfo[7]\",$reducShowPng);\n";  // appel DISPLAY PNG
					echo "</script>";
/*					
				    echo "<script>\n";
					echo "var divPng = document.getElementById('divpng' + '$divIndex');\n";
					echo "var imgPng = divPng.firstChild;\n";

					echo "var reducFactor = imgPng.height / $rowPngInfo[0];\n";
					echo "reducFactor = reducFactor * $reducShowPng;\n";
					
					echo "var x = $rowPngInfo[1] * reducFactor;\n";
					echo "var y = $rowPngInfo[2] * reducFactor;\n";
					echo "var l = $rowPngInfo[3] * reducFactor;\n";
					echo "var t = $rowPngInfo[4] * reducFactor;\n";
					echo "var w = $rowPngInfo[5] * reducFactor;\n";
					echo "var h = $rowPngInfo[6] * reducFactor;\n";
					echo "var type = \"$rowPngInfo[7]\";\n";
					
					echo "var canvasPng = document.createElement('canvas');\n";
					echo "canvasPng.height = imgPng.height * $reducShowPng;\n";
					echo "canvasPng.width = imgPng.width * $reducShowPng;\n";
					echo "var cpc = canvasPng.getContext('2d');\n";
					echo "cpc.drawImage(imgPng, 0, 0, imgPng.width * $reducShowPng, imgPng.height * $reducShowPng);\n";
					
					echo "cpc.fillStyle = 'rgba(127,127,127,0.2)';";
					echo "cpc.fillRect(l, t, w, h);";
					echo "cpc.strokeStyle = 'rgba(0,255,0,0.7)';";
					echo "cpc.lineWidth = 7;";
					echo "cpc.strokeRect(l, t, w, h);";
					echo "cpc.beginPath();";
					echo "cpc.arc(x, y, 20, 0, 2*Math.PI, true);";
					echo "cpc.fillStyle = 'rgba(255,255,0,0.3)';";
					echo "cpc.fill();";
					echo "var strokeTextStyle;";
					echo "if ((type == 'click') || (type == 'dblclick')) {";
						echo "cpc.strokeStyle = 'rgba(255,0,0,0.7)';";
						echo "strokeTextStyle = 'rgba(255,0,0,1)';";
					echo "}";
					echo "else strokeTextStyle = 'rgba(0,255,0,1)';";
					echo "cpc.lineWidth = 7;";
					echo "cpc.stroke();";
					echo "cpc.strokeStyle = strokeTextStyle;";
					echo "cpc.lineWidth = 2;";
					echo "cpc.font = '32px lighter';";
					echo "var decalText = (type.length -1) * 9;";
					echo "cpc.strokeText(type, x - decalText, y + 46);";
					echo "imgPng.parentNode.replaceChild(canvasPng, imgPng);";
				    echo "</script>";
 */					
					
				    $divIndex++;
					
				    echo '</tr></table><table>';
					
				    if ($colTitles) {
				        echo '<br /><hr class="fat-seb-dark" />';
				        if ($colPng == 0) $stop = 1;
						foreach($titres as $colonne) {
							if ($stop) {$stop = 0; continue;}
							echo '<th>', htmlentities($colonne->name), '</th>';
						}
				    }					
				}
			    }
			}
    	}
    	echo "</table>";
//    	$result->close();
    }
}
//////////////////////////////////////////////////////////////////
////////////////       CODAGE RESULT EN JSON 
/////////////////////////////////////////////////////////////////
function jsonResult($requete, $idcom) {
$result = $idcom->query($requete);
$debut = true;
$nbColonnes=$result->field_count;

$json =  "[";
if ($result->num_rows){
$colonnes = $result->fetch_fields();
while ($ligne = $result->fetch_array(MYSQLI_NUM)) {
	if ($debut){
		$json = $json . "{";
		$debut = false;
	} else {
		$json = $json . ",{";
	}
	for($j=0;$j<$nbColonnes;$j++){
		$colonne = $colonnes[$j]->name;
		$json = $json . "\"".$colonne."\":\"". utf8_encode($ligne[$j])."\"";
		if ($j != $nbColonnes-1)	$json = $json .  ",";	//condition virgule dernière colonne 
	}
	$json = $json .  "}";
}
}
$json = $json .  "]";
return($json);	
}
//////////////////////////////////////////////////////////////
////////////////		CODAGE RESULT DANS TABLEAU PHP
/////////////////////////////////////////////////////////////
function arrayResult($result, $colTitles) {
//	$result = $idcom->query($requete);
	$nbRows = $result->num_rows;
	$nbCols=$result->field_count;
	if ($colTitles) {
		$titres = $result->fetch_fields();
		for($i = 0; $i < $nbCols; $i++) {
			$tab[0][$i] = $titres[$i]->name;
		}
		$nbRows++;
	}
	$i = ($colTitles)? 1: 0;
	for (; $i < $nbRows; $i++) {
		$row = $result->fetch_array(MYSQLI_NUM);
		for ($j = 0; $j < $nbCols; $j++) {
			$tab[$i][$j] = $row[$j];
		}
	}
	return($tab);
}
//////////////////////////////////////////////////////////////
////////////////		SUPPRESSION DE SESSIONS
/////////////////////////////////////////////////////////////
function deleteSession($sessionId, $idComW) {
	
//	recherche des id  des Event de la session

//	$sessionId = substr($sessionId, 12);
	$requete = "SELECT id FROM Event WHERE sessionId = '$sessionId'";
	$result = $idComW->query($requete);
	if (!$result) {
		print_r($idComW->error);
		exit;
	}
	echo "<p>*************************************</p>";
	echo "<p>Sessions: $sessionId</p>";
//	delete 
	$idComW->autocommit(FALSE);		// début transaction
	$nbRows = $result->num_rows;
	if ($nbRows > 0) {
	
		//   concaténation des id des Event de la session
		$eventIds = "(";
		for ($i = 0; $i < $nbRows; $i++) {
			if ($i > 0) $eventIds = $eventIds . ", ";
			$row = $result->fetch_array(MYSQLI_NUM);
			$eventIds = $eventIds . "'" . $row[0] . "'";
		}
		$eventIds = $eventIds . ")";
		
		//  delete DocSuite
		$requete = "DELETE FROM DocSuite WHERE eventId IN $eventIds";
		echo "<p>$requete</p>";
		$result = $idComW->query($requete);
		if (!$result) {
			$idComW->rollback();
			print_r($idComW->error);
			exit;
		}
//		$nbRows = $result->num_rows;
//		echo "<p>Nombre de lignes supprimées dans DocSuite: $nbRows</p>";

		//  delete DocBlob
		$requete = "DELETE FROM DocBlob WHERE eventId IN $eventIds";
		echo "<p>", substr($requete, 0, 20), "...</p>";
		$result = $idComW->query($requete);
		if (!$result) {
			$idComW->rollback();
			print_r($idComW->error);
			exit;
		}
//		$nbRows = $result->num_rows;
//		echo "<p>Nombre de lignes supprimées dans DocBlob: $nbRows</p>";

		//  delelte Event
		$requete = "DELETE FROM Event WHERE id IN $eventIds";
		echo "<p>", substr($requete, 0, 18), "...</p>";
		$result = $idComW->query($requete);
		if (!$result) {
			$idComW->rollback();
			print_r($idComW->error);
			exit;		
		}
//		$nbRows = $result->num_rows;
//		echo "<p>Nombre de lignes supprimées dans Event: $nbRows</p>";
	}
	
	// delete Session
	$requete = "DELETE FROM Session WHERE sessionId = '$sessionId'";
		echo "<p>$requete</p>";
	$result = $idComW->query($requete);
	if (!$result) {
		$idComW->rollback();
		print_r($idComW->error);
		exit;
	}
	echo "<p>Session supprimée</p>";
	$idComW->commit();
}
/////////////////////////////////////////////////////////////
////////////////		ECRITURE  TABLEAU DANS FICHIER CSV
/////////////////////////////////////////////////////////////
function arrayToCsvFile($tab, $fileName) {
	if ($f = @fopen($fileName, 'w')) {
		flock($f, LOCK_SH);
		for ($i = 0; $i < count($tab); $i++) {
			fputcsv($f, $tab[$i]);
		}
		flock($f, LOCK_UN);
		fclose($f);
	}
	else {
		echo "Impossible d'acc&eacute;der au fichier" . $fileName . ".";
	}
}

?> 