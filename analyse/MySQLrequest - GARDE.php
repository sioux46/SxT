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
		echo '<br /><br /><div id="minute"><strong style="color:red" >Minute papillon...</strong><br /><br /><img src="Images/loaderB32.gif" /></div>';
		echo '<div id="globalDiv" >';  // hidden
		echo '<table>';
		
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
				    echo "<div align=\"left\"  id=\"divpng$divIndex\" class=\"png-png\"><div  id=\"innerdivpng$divIndex\">$png[0]</div></div>"; // affichage PNG
					
					$funcOnLoad[$divIndex] = "displayPng($divIndex,$rowPngInfo[0],$rowPngInfo[1],$rowPngInfo[2],$rowPngInfo[3],$rowPngInfo[4],$rowPngInfo[5],$rowPngInfo[6],\"$rowPngInfo[7]\",$reducShowPng);\n";  // appel DISPLAY PNG

					
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
		echo "</div>";
		$onLoadIndex = 0;
		echo "<script>";
		echo "window.onload = ";
		while($onLoadIndex < $divIndex) {
				$f = $funcOnLoad[$onLoadIndex++];
				echo "$f";
		}
		echo "document.getElementById('minute').setAttribute('hidden', 'hidden');";
		echo "document.getElementById('globalDiv').removeAttribute('hidden');";
		echo "</script>";
			
			
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