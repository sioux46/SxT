// JavaScript Document

var colName = ["-","viewId","sessionId","timeStamp","eventDate","eventTime","clientIP","userId","eventIndex","type","target","targetValue","targetLocalName","station","docURL","targetTitle","docTitle","winDoc","winIndex","tabIndex","winTabCard", "winInnerHeight", "winInnerWidth", "winOuterHeight", "winOuterWidth", "winPageXOffset", "winPageYOffset","winScreenX","winScreenY","screenHeight","screenWidth","blobId","docSuiteId","eventId","docDomain","docReferrer","targerClassName","targetType","targetNameSpaceURI","targetDefaultValue","relatedTarget","targetRectB","targetRectH","targetRectL","targetRectR","targetRectT","targetRectW","docRectB","docRectH","docRectL","docRectR","docRectT","docRectW","clientX","clientY","pageX","pageY","screenX","screenY","src","checked","href","name","autoplay","currentSrc","muted","paused","poster","altKey","ctrlKey","metaKey","shiftKey","char","charCode","keyCode","button"];

var compValue = ["=","<&gt;","<","&gt;","<=","&gt;=","LIKE","RLIKE","NOT&nbsp;LIKE","NOT&nbsp;RLIKE"];

var EventType = ["-","activate","beforeNavigate","blur","change","click","close","contextmenu","dblclick","deactivate","dragend","dragstart","ended","focus","input","keydown","keypress","keyup","load","mousedown","mousemove","mouseout","mouseover","mouseup","mousewheel","navigate","open","pagehide","pageshow","pause","play","playing","popstate","redo","reset","resize","scroll","seeking","select","submit","touchstart","touchmove","touchend","touchenter","touchleave","undo","unload"];

var EventTarget = ["-","Anchor","Area","Blockquote","Body","Button","Canvas","Div","DList","Document","DOMWindow","Element","Embed","FieldSet","Font","ForbiddenURL","Form","Frame","FrameSet","Heading","HR","Html","IFrame","Image","Input","Label","Legend","LI","Marquee","Mod","Object","OList","Option","Paragraph","Pre","Script","Select","tab","Table","TableCaption","TableCell","TableRow","TableSection","Text","TextArea","UList","Video","window"];

var EventTag = ['a','abbr','address','article','aside','b','body','button','center','cite','dd','div','dl','dt','em','embed','fieldset','footer','form','h1','h2','h3','h4','h5','header','hr','html','i','iframe','img','input','label','li','nav','object','ol','option','p','pre','rect','section','select','span','strong','table','tbody','td','textarea','th','ul','video'];

var EventWinDoc = ["doc","win"];

var orderBy2 = ["ASC", "DESC"];

var reduc = [2,1.8,1.6,1.5,1.4,1.2,1,0.8,0.6,0.5,0.4,0.2,0.1];

var groupFunc = ["-","COUNT","LENGTH","GROUP_CONCAT","AVG","MIN","MAX","SUM","STDEV","VARIANCE"];

var rangWhereValue = 0;
var rangOrderByValue = 0;
var rangSelectValue = 0;
var rangGroupByValue = 0;
//////////////////////////////////////////////////////////////////////////////////////////////
function addSelectGroupBy() {   //                                  GROUP BY
    var selectBalise = document.getElementById("selectGroupBy");
    selectBalise = selectBalise.appendChild(document.createElement("span"));
    var selectInner = '';
    for(var col in colName) {
        selectInner += '<option value=' + colName[col] + '>' + colName[col] + '</option>';
    }
    var newField = document.createElement("select");
    newField.setAttribute("class", "large");
    newField.innerHTML = selectInner;
    newField.name = "groupByValue" + rangGroupByValue++;
    selectBalise.appendChild(newField);
    selectBalise.appendChild(document.createTextNode(" "));
    selectBalise.appendChild(newMoinsField());
    selectBalise.appendChild(document.createElement("br"));
}
//////////////////////////////////////////////////////////////////////////////////////////////
function addSelectOrderBy() {  //                                   ORDER BY
    var col;
    var selectBalise = document.getElementById("selectOrderBy");
    selectBalise = selectBalise.appendChild(document.createElement("span"));
    var selectInner = '';
    for( col in colName ) {
        selectInner += '<option value=' + colName[col] + '>' + colName[col] + '</option>';
    }
    var newField = document.createElement("select");
    newField.setAttribute("class", "large");
    newField.innerHTML = selectInner;
    newField.name = "orderByValue" + rangOrderByValue;
    selectBalise.appendChild(newField);
    selectBalise.appendChild(document.createTextNode(" "));
    //
    selectInner = '';
    for( col in orderBy2 ) {
        selectInner += '<option value=' + orderBy2[col] + '>' + orderBy2[col] + '</option>';
    }
    newField = document.createElement("select");
//    newField.setAttribute("class", "large");
    newField.innerHTML = selectInner;
    newField.name = "orderByOrder" + rangOrderByValue++;
    selectBalise.appendChild(newField);
    selectBalise.appendChild(document.createTextNode(" "));
    selectBalise.appendChild(newMoinsField());
    selectBalise.appendChild(document.createElement("br"));
}
//////////////////////////////////////////////////////////////////////////////////////////////
function addSelectOrderByStar() {
    var selectBalise = document.getElementById("selectOrderByStar");
    var selectInner = '';
    for(var col in orderBy2) {
        selectInner += '<option value=' + orderBy2[col] + '>' + orderBy2[col] + '</option>';
    }
    var newField = document.createElement("select");
//    newField.setAttribute("class", "large");
    newField.innerHTML = selectInner;
    newField.name = "orderByOrderStar";
    selectBalise.appendChild(newField);
    selectBalise.appendChild(document.createTextNode(" "));
//    selectBalise.appendChild(document.createElement("br"));
}
//////////////////////////////////////////////////////////////////////////////////////////////
function addSelectWhere() { //                                        W H E R E
    var selectWhereSet = document.getElementById("selectWhere");
    var lastSelect = selectWhereSet.lastChild;
    if (lastSelect) {
        var andOr = document.getElementById("divAndOr");
        andOr.hidden = "";
    }
    selectWhereSet = selectWhereSet.appendChild(document.createElement("span"));

    var selectSet = "";
    //      CHOIX COLONNE
    var valName = "whereColName" + rangWhereValue;
    selectSet += '<select class="large" name="' + valName + '" onchange="computeValues(this)">';
    for(var col in colName) {
        selectSet += '<option value=' + colName[col] + '>' + colName[col] + '</option>';
    }
    selectSet += '</select>&nbsp;';
    //      CHOIX COMPARATEUR
    valName = "whereCompValue" + rangWhereValue;
    selectSet += '<select onchange="computeComp(this)" name="' + valName + '" size=1>';
    for(var comp in compValue) {
        selectSet += '<option value=' + compValue[comp] + '>' + compValue[comp] + '</option>';
    }
    selectSet += '</select>&nbsp;';
    //       CHOIX VALEUR
    valName = "whereValue" + rangWhereValue++;
    selectSet += '<input type="text" placeholder="Entrez une valeur" name="' + valName + '">';

    var newField = document.createElement("span");
    newField.innerHTML = selectSet;
    selectWhereSet.appendChild(newField);
    selectWhereSet.appendChild(document.createTextNode(" "));
    selectWhereSet.appendChild(newMoinsField());
    selectWhereSet.appendChild(document.createElement("br"));
}
//////////////////////////////////////////////////////////////////////////////////////////////
function addSelectSelect() {    //                                     S E L E C T
    var selectBalise = document.getElementById("selectSelect");
    selectBalise = selectBalise.appendChild(document.createElement("span"));
    var selectInner = '';
    for (var func in groupFunc) {
        selectInner += '<option value=' + groupFunc[func] + '>' + groupFunc[func] + '</option>';
    }
    var newField = document.createElement("select");
    newField.setAttribute("class", "large");
    newField.innerHTML = selectInner;
    newField.name = "selectFunc" + rangSelectValue;
    newField.setAttribute("onchange", "showGoast(this)");
    selectBalise.appendChild(newField);
    selectBalise.appendChild(document.createTextNode(" "));

    var goast = document.createElement("span");
    newField = document.createElement("input");
    newField.type = "checkbox";
    newField.name = "selectDistinct" + rangSelectValue;
    newField.setAttribute("id", "selectDistinct" + rangSelectValue);
    goast.appendChild(newField);
    newField = document.createElement("label");
    newField.setAttribute("class", "titre gray");
    newField.setAttribute("for", "selectDistinct" + rangSelectValue);
    newField.textContent = "DISTINCT";
    goast.appendChild(newField);
    goast.appendChild(document.createTextNode(" "));
    goast.hidden = "hidden";
    selectBalise.appendChild(goast);

    selectInner = '';
    for (var col in colName) {
        selectInner += '<option value=' + colName[col] + '>' + colName[col] + '</option>';
    }
    newField = document.createElement("select");
    newField.setAttribute("class", "large");
    newField.innerHTML = selectInner;
    newField.name = "selectValue" + rangSelectValue++;
    selectBalise.appendChild(newField);
    selectBalise.appendChild(document.createTextNode(" "));
    selectBalise.appendChild(newMoinsField());
    selectBalise.appendChild(document.createElement("br"));

    document.getElementById('distinctCountStarCountStar').checked = false;
    document.getElementById('distinctCountStarStar').checked = false;
}
/////////////////////////////////////////////////////////////////////////////////////////////
function showGoast(avantGoast) {
    if (avantGoast.value == '-' || avantGoast.value == 'GROUP_CONCAT') {
            avantGoast.nextSibling.nextSibling.hidden = "hidden";
    }
    else {
            avantGoast.nextSibling.nextSibling.hidden = "";
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////
function newMoinsField() {
    var newField = document.createElement("input");
    newField.type = "button";
    newField.value = "-";
    newField.setAttribute("onclick", "deleteField(this)");
    return(newField);
}
////////////////////////////////////////////////////////////////////////////////////////////////
function computeValues(colNameSelect) {
    var compSelect = colNameSelect.nextSibling.nextSibling;
    var valueSelect = compSelect.nextSibling.nextSibling;
    var select = "";
    var type;
    var newField;
    //
    if ((!compSelect.value.match(/LIKE/)) &&
         (colNameSelect.value == "type" || colNameSelect.value == "target" || colNameSelect.value == "targetLocalName" || colNameSelect.value == "winDoc")) {
        if (colNameSelect.value == "type") {         // TYPE
            for(type in EventType) {
                select += '<option value=' + EventType[type] + '>' + EventType[type] + '</option>';
            }
        }
        else if (colNameSelect.value == "target") {  // TARGET
            for(type in EventTarget) {
                select += '<option value=' + EventTarget[type] + '>' + EventTarget[type] + '</option>';
            }
        }
        else if (colNameSelect.value == "targetLocalName") {  // TARGET TAG
            for(type in EventTag) {
                select += '<option value=' + EventTag[type] + '>' + EventTag[type] + '</option>';
            }
        }
        else if (colNameSelect.value == "winDoc") {  // WINDOC
            for(type in EventWinDoc) {
                select += '<option value=' + EventWinDoc[type] + '>' + EventWinDoc[type] + '</option>';
            }
        }
        newField = document.createElement("select");
        newField.size="1";
        newField.innerHTML = select;
        newField.setAttribute("class", "large");
    }
    //
    else {
        newField = document.createElement("input");
        newField.type = "text";
        newField.placeholder = "Entrez une valeur";
        newField.name = valueSelect.name;
    }
    newField.name = valueSelect.name;
    valueSelect.parentNode.replaceChild(newField, valueSelect);
}
////////////////////////////////////////////////////////////////////////////////////////////
function computeComp(compSelect) {
    computeValues(compSelect.previousSibling.previousSibling);
}
////////////////////////////////////////////////////////////////////////////////////////////
function deleteField(selectField) {
    selectField.parentNode.parentNode.removeChild(selectField.parentNode);
}
////////////////////////////////////////////////////////////////////////////////////////////
function verifLibre() {
	var libre = document.getElementById("requestLibre");
	var histo = document.getElementById('requestHisto');
	var selHisto = histo.value.substring(histo.selectionStart, histo.selectionEnd);
	if (selHisto) {
		libre.value = selHisto;
		histo.selectionStart = histo.selectionEnd = 0;
	}
	if (!libre.value) return false;

    document.getElementById('showPngLibre').value = localStorage.getItem('SXTshowPng');
    document.getElementById('reducValueLibre').value = localStorage.getItem('SXTreducValue');

    var sel = document.getElementById('sessionsList');
    var selLib = document.getElementById('sessionsListLibre');

    selLib.setAttribute('hidden', 'hidden');
    selLib.innerHTML = '';
    var newOpt;
    for (var opt in sel.options) {
        if (sel.options[opt].selected == true) {
            newOpt = document.createElement('option');
            newOpt.value = sel.options[opt].value;
            newOpt.setAttribute('selected', 'selected');
            selLib.appendChild(newOpt);
        }
    }
    return true;
}
////////////////////////////////////////////////////////////////////////////////////////////
function verifChoixMul() {
    return true;
}
////////////////////////////////////////////////////////////////////////////////////////////
function loadHisto() {
    var histo = document.getElementById("requestHisto");
    var histoRead = localStorage.getItem("SXThisto");
    if (histoRead && histo) {
        histo.value = histoRead;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////
function loadExemples() {
    var exemples = document.getElementById("exemples");
    var newOpt;
//    exemples.value ="\nDESCRIBE EventTable;";
    if (!(localStorage.SXTexemples)) localStorage.setItem('SXTexemples', '');
    if (localStorage.SXTexemples == '') {
        newOpt = document.createElement('option');
        newOpt.setAttribute('value', "SELECT eventDate, eventTime, station, type, targetLocalName as 'target', targetValue, targetTitle ,docTitle, docURL FROM EventTable WHERE type NOT IN ('mousedown', 'mouseup', 'keyup', 'keydown', 'keypress') AND docURL <> '' ORDER BY timeStamp LIMIT 10000;");
        newOpt.innerHTML = "SELECT eventDate, eventTime, station, type, targetLocalName as 'target', targetValue, targetTitle ,docTitle, docURL FROM EventTable WHERE type NOT IN ('mousedown', 'mouseup', 'keyup', 'keydown', 'keypress') AND docURL <> '' ORDER BY timeStamp LIMIT 10000;";
        exemples.appendChild(newOpt);
        localStorage.setItem('SXTexemples', localStorage.getItem('SXTexemples') + exemples.lastChild.value);

        newOpt = document.createElement('option');
        newOpt.setAttribute('value', 'SELECT COUNT(*) FROM EventTable;');
        newOpt.innerHTML = 'SELECT COUNT(*) FROM EventTable;';
        exemples.appendChild(newOpt);
        localStorage.setItem('SXTexemples', localStorage.getItem('SXTexemples') + exemples.lastChild.value);

        newOpt = document.createElement('option');
        newOpt.setAttribute('value', 'SELECT type, target, targetValue, docURL FROM EventTable ORDER BY timeStamp LIMIT 1000;');
        newOpt.innerHTML = 'SELECT type, target, targetValue, docURL FROM EventTable ORDER BY timeStamp LIMIT 1000;';
        exemples.appendChild(newOpt);
        localStorage.setItem('SXTexemples', localStorage.getItem('SXTexemples') + exemples.lastChild.value);

        newOpt = document.createElement('option');
        newOpt.setAttribute('value', 'SELECT DISTINCT type FROM EventTable;');
        newOpt.innerHTML = 'SELECT DISTINCT type FROM EventTable;';
        exemples.appendChild(newOpt);
        localStorage.setItem('SXTexemples', localStorage.getItem('SXTexemples') + exemples.lastChild.value);

        newOpt = document.createElement('option');
        newOpt.setAttribute('value', 'SELECT DISTINCT type, target FROM EventTable WHERE type IN (\'click\', \'input\') ORDER BY type, target;');
        newOpt.innerHTML = 'SELECT DISTINCT type, target FROM EventTable WHERE type IN (\'click\', \'input\') ORDER BY type, target;';
        exemples.appendChild(newOpt);
        localStorage.setItem('SXTexemples', localStorage.getItem('SXTexemples') + exemples.lastChild.value);

        newOpt = document.createElement('option');
        newOpt.setAttribute('value', 'SELECT COUNT(*), type, target FROM EventTable GROUP BY type, target ORDER BY COUNT(*) DESC;');
        newOpt.innerHTML = 'SELECT COUNT(*), type, target FROM EventTable GROUP BY type, target ORDER BY COUNT(*) DESC;';
        exemples.appendChild(newOpt);
        localStorage.setItem('SXTexemples', localStorage.getItem('SXTexemples') + exemples.lastChild.value);

		newOpt = document.createElement('option');
        newOpt.setAttribute('value', 'SELECT distinct userId FROM EventTable ORDER BY userId;');
        newOpt.innerHTML = 'SELECT distinct userId FROM EventTable ORDER BY userId;';
        exemples.appendChild(newOpt);
        localStorage.setItem('SXTexemples', localStorage.getItem('SXTexemples') + exemples.lastChild.value);

        newOpt = document.createElement('option');
        newOpt.setAttribute('value', 'SELECT * FROM Session ORDER BY id DESC;');
        newOpt.innerHTML = 'SELECT * FROM Session ORDER BY id DESC;';
        exemples.appendChild(newOpt);
        localStorage.setItem('SXTexemples', localStorage.getItem('SXTexemples') + exemples.lastChild.value);
}
    else {
        var exs = localStorage.getItem('SXTexemples').split(';');
        exs.length--;
        for (var ex in exs) {
            newOpt = document.createElement('option');
            newOpt.setAttribute('value', exs[ex] + ';');
            newOpt.innerHTML = exs[ex] + ';';
            exemples.appendChild(newOpt);
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////
function deleteExemple() {
    var ex = document.getElementById('exemples');
    if (ex.selectedIndex == -1) return;
    var delExemple = ex.options[ex.selectedIndex].value;
    var exemples = localStorage.getItem('SXTexemples');
    exemples = exemples.replace(delExemple, '');
    localStorage.setItem('SXTexemples' , exemples);
    ex.removeChild(ex.options[ex.selectedIndex]);
}
////////////////////////////////////////////////////////////////////////////////////////////
function addExemple(button) {
    button.blur();
    var libre = document.getElementById("requestLibre");
    var sel = libre.value.substring(libre.selectionStart, libre.selectionEnd);
    var exemples = document.getElementById('exemples');
    var histo = document.getElementById('requestHisto');

    if (!sel) sel = histo.value.substring(histo.selectionStart, histo.selectionEnd);
    if (!sel) sel = libre.value;
    else {
        histo.selectionStart = histo.selectionEnd = 0;
        sel = sel.replace(/;.*/, ';');
        while (sel.lastIndexOf('\n') != -1) sel = sel.substring(0, sel.length - 1);
    }
    if (!sel) return;
//    sel = sel.replace(/;.+/, ';');
//    if (sel.charAt(sel.length - 1) == '\n') sel = sel.replace(/.$/, ';');
    if (sel.charAt(sel.length - 1) != ';') sel = sel + ';';
    localStorage.setItem('SXTexemples', sel + localStorage.getItem('SXTexemples'));
    var newOpt;
    newOpt = document.createElement('option');
    newOpt.setAttribute('value', sel);
    newOpt.innerHTML = sel;
    exemples.insertBefore(newOpt, exemples.firstChild);
    exemples.selectedIndex = 0;

}
////////////////////////////////////////////////////////////////////////////////////////////
function clickExemple() {
    var ex = document.getElementById('exemples');
    document.getElementById('requestLibre').value = ex.options[ex.selectedIndex].value;
    document.getElementById('requestLibre').innerHTML = ex.options[ex.selectedIndex].value;
}
////////////////////////////////////////////////////////////////////////////////////////////
function saveHisto() {
    var histo = document.getElementById("requestHisto");
    var size = histo.value.length;
    size = (size < 20000) ? size : 20000;
    localStorage.setItem("SXThisto", histo.value.slice(0, size));
}
///////////////////////////////////////////////////////////////////////////////////////////
function clearHisto() {  // non utilisé
    localStorage.setItem("SXThisto","");
    var histo = document.getElementById("requestHisto");
    histo.value = "";
}
///////////////////////////////////////////////////////////////////////////////////////////
function showHisto(button) { // non utilisé
    var histo = document.getElementById("requestHisto");
    if (histo.hidden) {
        histo.hidden = "";
        button.innerText = "- Cacher -";
    }
    else {
        histo.hidden = "hidden";
        button.innerText = "- Montrer -";
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////
	function sortSessionsQuery(load) {
		var query, userId, order, sortUser, orderAsc;
		if (load == 'load') {
			sortUser = localStorage.getItem('SXTsortUser');
			if (sortUser) {
				document.getElementById('sortSessionsUser').setAttribute('checked', 'checked');
				document.getElementById('sortSessionsDate').removeAttribute('checked');
			}
			else {
				document.getElementById('sortSessionsUser').removeAttribute('checked');
				document.getElementById('sortSessionsDate').setAttribute('checked', 'checked');
			}

			orderAsc = localStorage.getItem('SXTorderAsc');
			if (orderAsc) {
				document.getElementById('orderSessionsAsc').setAttribute('checked', 'checked');
				document.getElementById('orderSessionsDesc').removeAttribute('checked');
			}
			else {
				document.getElementById('orderSessionsAsc').removeAttribute('checked');
				document.getElementById('orderSessionsDesc').setAttribute('checked', 'checked');
			}
		}
		else {
			sortUser =  document.getElementById('sortSessionsUser').checked;
			orderAsc =  document.getElementById('orderSessionsAsc').checked;
		}
	//--------------------------------------------
		if (sortUser) {
			localStorage.setItem('SXTsortUser', 'checked');
			userId = 'userId,';
		}
		else {
			localStorage.removeItem('SXTsortUser');
			userId = ' ';
		}
	//--------------------------------------------
		if (orderAsc) {
			localStorage.setItem('SXTorderAsc', 'checked');
			order = '';
		}
		else {
			localStorage.removeItem('SXTorderAsc');
			order = ' DESC';
		}
	//---------------------------------------------
		query = userId + 'date' + order + ',time' + order;

		$.ajax({
			url:'ajaxInnerListQuery.php',
			data:{query:query},
			complete: function(xhr, result) {
				if (result == 'success') $("#sessionsList").html(xhr.responseText);
				else alert('Pas de réseau! ajaxInnerListQuery.php');
			}
		});

	}
//////////////////////////////////////////////////////////////////////////////////////////////
function restorePrefs() {
    if (localStorage.getItem('SXTshowPng')) document.getElementById('showPng').setAttribute('checked', 'checked');
    else document.getElementById('showPng').removeAttribute('checked');

    if (localStorage.getItem('SXTreducValue')) document.getElementById('reducValue').value = localStorage.getItem('SXTreducValue');
}
//////////////////////////////////////////////////////////////////////////////////////////////
function checkPng() {
    if (localStorage.getItem('SXTshowPng')) {
        document.getElementById('showPng').removeAttribute('checked');
        localStorage.removeItem('SXTshowPng');
    }
    else {
        document.getElementById('showPng').setAttribute('checked', 'checked');
        localStorage.setItem('SXTshowPng', 'checked');
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////
function checkReduc() {
    localStorage.setItem('SXTreducValue', document.getElementById('reducValue').value);
}
//////////////////////////////////////////////////////////////////////////////////////////////
function addSelectReduc() {
    var selectBalise = document.getElementById("SelectReduc");
    var selectInner = '';
    for(var col in reduc) {
        selectInner += '<option value=' + reduc[col] + '>' + reduc[col] + '</option>';
    }
    var newField = document.createElement("select");
	newField.setAttribute('onchange', 'checkReduc()');
    newField.innerHTML = selectInner;
    newField.name = "reducValue";
    newField.id = "reducValue";
    newField.value = localStorage.getItem('SXTreducValue');
    selectBalise.appendChild(newField);
    selectBalise.appendChild(document.createTextNode(" "));
//    selectBalise.appendChild(document.createElement("br"));
}

//////////////////////////////////////////////////////////////////////////////////////////////
function goPlayback() {
//	$("#sessionsList option:selected").each(function() {
//            alert($(this).val());  // .text()
//	});


}
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

	sortSessionsQuery('load');
	localStorage.reloadSessions = 'false';
//....................
	$(window).on("focus", function() {
		if (localStorage.reloadSessions == 'true') {
			sortSessionsQuery('load');
		}
		localStorage.reloadSessions = 'false';
	});


//...........................................................
	$("#deleteSessions").on('click', function(event) {
		event.preventDefault();
		this.blur();
		if ($("#sessionsList").val() && verifSuppSessions($("#sessionsList").val().length)) {
			$.ajax({
				url: 'doDeleteSessionsMuet.php',
				type: 'POST',
				data: { list: $("#sessionsList").val() },
				complete: function(xhr, result) {
					if (result == 'success') {
						if ((xhr.responseText == 'OK') || (xhr.responseText == ' OK')) {
							// alert('Sessions supprimées');
							window.location.href = window.location.href;
						}
					}
					else {
						alert('Pas de réseau! doDeleteSessionsMuet.php');
					}
				}
			});
		}
	});
//...........................................................
	$("#downloadCsv").on('click', function(event) {
		event.preventDefault();
		this.blur();
		if ($("#sessionsList").val()) {
			$.ajax({
				url: 'downloadSxTQueryFromQuery.php',
				type: 'POST',
				data: { list: $("#sessionsList").val()},
				complete: function(xhr, result) {
					if (result == 'success') {
						window.location = 'downloadSxTQuery.php';
					}
					else {
						alert('Pas de réseau! downloadSxTQueryFromQuery.php');
					}
				}
			});
		}
	});

});		//	fin READY

//............................................................
	$.ajax({
		url: 'verifSuperu.php',
		complete: function(xhr, result) {
			if (result == 'success') {
				if (xhr.responseText == "OK") $('#order-sessions').show(400);
				else {
					if (xhr.responseText == 'Bad username') {
						$('#deleteSessions').hide();
						//$('#downloadCsv').hide();
						$("#username").text('Anonyme');
					}
					else $("#username").text(xhr.responseText);
					$('#order-sessions').hide();  // bout radio trier user
				}
			}
			else alert('Pas de réseau!verifSuperu.php');
		}
	});
//////////////////////////////////////////////////////////////////////////////////////////////
		function verifSuppSessions(n) {
			if (n > 1)
				return(confirm("Supprimer les " + n + " sessions sélectionnées ?  (opération irréversible)"));
			else
				return(confirm("Supprimer la session sélectionnée ?  (opération irréversible)"));
		}
