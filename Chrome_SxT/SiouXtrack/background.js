//    background.js

//												C H R O M E

var SXT_VERSION = 'O.66';

var TIME_OUT = 900000; // 15 minutes
var MAX_TIME = 18000000; // 5 heures
var MAX_TRACE = 6000;
var TIME_STAMP = 1;
var TYPE = 4;
var HTML = 21;
var DOC_URL = 11;
var FLAG_PHOTO = 75;
var FLAG_PHOTO_PLUS = 74;
var NB_REGEXP = 5;
var NB_FREEFIELD = 3;
var NS_START_INTERVAL = 0.05;  // minutes
var MAX_EVENT_INDEX = 4000; // 4000;  // nb max events par session

var dontPost = false;
var ST_Events = [];
var winds = [];
var tabs = [];
var ST_EventsPostSize;
var sessionId;
var startSessionTimeStamp = (new Date()).getTime();
var postTime = 0;
var filteredURLs = new Array(NB_REGEXP);
var eventIndex;
var pngStack = [];
var newSessionInterval = NS_START_INTERVAL;
var sessionTimeoutNumber;
var sXtRacine;
var startTime = 0;

var theButton;

var flagPrefChange = false;
var recording = false;
var flagButtonStartPhoto = false;

var pendingAjax = 0;

var lastURL = '';

//////////////////////////////////////////////////////////////////////////////////////
//chrome.runtime.onInstalled.addListener(function(details) {   //  load siouxtrack
	chrome.extension.onMessage.addListener(fromInject);
	chrome.browserAction.onClicked.addListener(saveFromButton);

	console.log('LOAD background.js');

	if ((localStorage.autoRecord == 'auto') || (localStorage.autoRecord == 'autoHidden'))
			pushNewSession('startSxT');
//	setSessionTimeout();
//});
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
chrome.runtime.onSuspend.addListener(function() {   //   			unload siouxtrack

//	if ((localStorage['autoRecord'] == 'auto') || (localStorage['autoRecord'] == 'autoHidden'))
//		    pushNewSession('quitSxT');

    console.log('Transmission finale en cours...');
	var xhr = new XMLHttpRequest();
	xhr.open('POST', localStorage.ST_URL + '/SiouXtrack.php', false);
    var track = JSON.stringify(ST_Events);
    console.log('Taille POST: ' + track.length);
	xhr.send(track);
	if (xhr.status !== 200) {
		alert(xhr.statusText + '. Echec de l\'enregistrement (URL non trouvé)');
	}
});
/////////////////////
// F U N C T I O N S
///////////////////////////////////////////////////////////////////////////////////////
function fromInject(data, sender, sendResponse) {    // inject à l'écoute
	var event = {origin: sender.tab.url, source: sender.tab.id};
	if (data == 'connect') connectInject(event);	// envoi prefs
	else getNewEvent({data: data, tabId: sender.tab.id, windowId: sender.tab.windowId});
}
///////////////////////////////////////////////////////////////////// SESSION TIMEOUT
function setSessionTimeout() {
	sessionTimeoutNumber = setTimeout(doSessionTimeout, newSessionInterval * 60000);
}
//.....................................
function doSessionTimeout() {
	return;  // fonction désactivée
//	if (newSessionInterval > 1) pushNewSession('sleeping');
//	newSessionInterval *= 1;  // 3 ?
//	setSessionTimeout();
//	showError("Transmission 6 sec. demandée...");
//	postTrack();
}
//.....................................
function clearSessionTimeout() {
	clearTimeout(sessionTimeoutNumber);
	newSessionInterval = NS_START_INTERVAL;
	setSessionTimeout();
}
/////////////////////////////////////////////////////////////////////////////////////////
function showHideButton() {
		console.log('STButton: ' + localStorage.STButton);
		if (localStorage.STButton == 'true')  {
				if (recording || (localStorage.autoRecord.indexOf('auto') != -1)) {
					chrome.browserAction.setBadgeBackgroundColor({color: '#F00'});
					chrome.browserAction.setIcon({path: 'icon_19_record.png'});
				}
				else {
					chrome.browserAction.setBadgeBackgroundColor({color: '#0A0'});
					chrome.browserAction.setIcon({path: 'icon_19.png'});
				}
				chrome.browserAction.enable();
		}
		else  {
				chrome.browserAction.setBadgeText({text: ''});
				chrome.browserAction.setIcon({path: 'icon_19_trans.png'});
//				chrome.browserAction.disable();
		}
		updateBadge();
}
/////////////////////////////////////////////////////////////////////////////////////////
function updateBadge(err) {
	var text;
	if (err) text = 'Error';
	else {
		if (localStorage.STButton == 'true') {
			if (pendingAjax || recording || (localStorage.autoRecord.indexOf('auto') != -1))
//					text = String(ST_Events.length);
					text = String(pendingAjax);
			else text = '';
		}
		else text = '';
	}
	chrome.browserAction.setBadgeText({text: text});
}
/////////////////////////////////////////////////////////////////////////////////////////
function saveFromButton(tab) {

	if ( !localStorage.autoRecord ) {
		showHideButton();
		return;
	}
	if (localStorage.autoRecord.indexOf('auto') != -1) return;
	////
  showError("[button]");
	if (localStorage.autoRecord.indexOf('Hidden') != -1) {
		localStorage.STButton = (localStorage.STButton == 'true') ? 'false' : 'true';
	}
	recording = !recording;
	showHideButton();
	if (recording) {
		pushNewSession('buttonStart');
		flagButtonStartPhoto = true;
	}
//	else pushNewSession('buttonStop');
	flagPrefChange = false;
    postTrack();
}
///////////////////////////////////////////////////////////////////////////////////////////////
function writeFilteredURLs() {
    var regExp;
    var match;
    for (var i = 1; i <= NB_REGEXP; i++) {
        regExp = "regExp" + i;
        match = localStorage[regExp];
        if (!match) match = "";
        match = match.match(/^\s*(.*?)\s*$/);
        if (!match) filteredURLs[i-1] = "";
        else filteredURLs[i-1] = match[1];
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////
function connectInject(event) {                      //  Envoi préférences
//        if (event.target.page === undefined) return;

        var eventNames = [];
        var settings = localStorage;

		if (event.origin[4] == "s")  if (settings.noHTTPS == 'true') return;      //  https

//    filtrage
		writeFilteredURLs();

        var filter;
        var match = true;
        if (event.origin) {
            for (var i = 0; i < NB_REGEXP; i++) {
                if ((filteredURLs[i] != "") && (filteredURLs[i].substr(0,3) != "(?#")) {
                    filter = event.origin.match(filteredURLs[i]);
                    if (filter === null) match = false;
                    else {
                        match = true;
                        break;
                    }
                }
            }
        }
        if (!match) {
            return;
        }

//
        if (settings.mouseover == 'true') eventNames.push({event:'mouseover'});
        if (settings.mousemove == 'true') {
			eventNames.push({event:'mousemove'});
			eventNames.push({event:'touchmove'});
		}
        if (settings.mouseout == 'true') eventNames.push({event:'mouseout'});
        if (settings.mousewheel == 'true') eventNames.push({event:'mousewheel'});
        if (settings.scroll == 'true') eventNames.push({event:'scroll'});
        eventNames.push({'getHTML': settings.html});
        eventNames.push({'getPngPlus': settings.pngPlus});
        eventNames.push({'minStation': settings.minStation});
		try {
			chrome.tabs.sendMessage(event.source, eventNames);
			showHideButton();
		}
		catch(e){
			return;
		}
		showError("Connect OK **********************************************");
}
/////////////////////////////////////////////////////////////////////////////////////////////
function userChanged(id) {
	showHideButton();
//	pushNewSession('prefChange');
	flagPrefChange = true;
}
///////////////////////////////......
function verifGlobalPass() {
	var passUrl = localStorage.ST_URL + '/verifGlobalPassTest.php';
	var xhr = new XMLHttpRequest();
	xhr.open('GET', passUrl, false);
	xhr.send(null);
	if (xhr.status !== 200) {
		alert(xhr.statusText);
		return(xhr.responseText);
	}
	return(xhr.responseText);
}
/////////////////////////////////////////////////////////////////////////////////////////////......
function pushNewSession(origin) {

	if (!localStorage.ST_URL) return;

    var newSession = [];

    newSession[2] = localStorage.userId;                           //  userId 2

    var settings = localStorage;

    sessionId = (new Date()).getTime() +
             Math.random().toString().substring(2,9) +
             Math.random().toString().substring(2,9);
    newSession[0] = sessionId;                                 //  sessionId O
    newSession[1] = "newSession";                              //  newSession 1


    var dt = (new Date());
    var date = dt.getDate().toString();
    if (date.length == 1) date = '0' + date;
    var month = (dt.getMonth() + 1).toString();
    if (month.length == 1) month = '0' + month;
    var year = (dt.getYear() + 1900);
    newSession[3] = year + '-' + month + '-' + date;            //  date 3
    newSession[4] = dt.toTimeString().match(/^(.{8})/)[1];       //  time 4


    ST_Events.push(newSession);

    startSessionTimeStamp = (new Date()).getTime();
    showError("Nouvelle session: " + newSession);

	sXtRacine = settings.ST_URL;

    newSession[5] = settings.ST_URL + ' [chr-' + SXT_VERSION + ']';  //  serverURL  5
    newSession[6] = (settings.STButton == "true") ? 1 : 0;          //  recButton  6
	if (origin == 'sleeping') origin = origin + '-' + newSessionInterval;
    newSession[7] = origin;           			// origin (ancien stateBar ) 7
    newSession[8] = settings.maxEvents;           //  maxEvents  8
    newSession[9] = settings.minStation;           //  minStation  9
    newSession[10] = (settings.mousemove == "true") ? 1 : 0;           //  mouseMove  10
    newSession[11] = (settings.mouseover == "true") ? 1 : 0;           //  mouseOver  11
    newSession[12] = (settings.mouseout == "true") ? 1 : 0;           //  mouseOut  12
    newSession[13] = (settings.mousewheel == "true") ? 1 : 0;           //  mouseWheel  13
    newSession[14] = (settings.scroll == "true") ? 1 : 0;           //  scroll  14
    newSession[15] = (settings.png == "true") ? 1 : 0;           //  png  15
    newSession[16] = (settings.html == "true") ? 1 : 0;           //  html  16

	writeFilteredURLs();

//    var regExp;
//    var match;
		var i;
    for (i = 1; i <= NB_REGEXP; i++) {
/*        regExp = "regExp" + i;
        match = settings[regExp];
        if (!match) match = "";
        match = match.match(/^\s*(.*?)\s*$/);
        if (!match) filteredURLs[i-1] = "";
        else filteredURLs[i-1] = match[1];
*/
        newSession[16 + i] = filteredURLs[i-1];           //  regExp1 -> 10  17 -> 26
    }
    var freeField;
    for (i = 1; i <= NB_FREEFIELD; i++) {
        freeField = "freeField" + i;
        match = settings[freeField];
        if (!match) match = "";
        match = match.match(/^\s*(.*?)\s*$/);
        if (!match) newSession[26 + i] = "";
        else newSession[26 + i] = match[1];                     // freeField1 -> 5  27 -> 31
    }
    newSession[32] = '[chr-' + SXT_VERSION + '] ' +
			 navigator.platform + // version SxT et navigateur 32
			 ', ' + navigator.userAgent;
    newSession[33] = (settings.pngPlus == "true") ? 1 : 0;      // pngPlus 33
    newSession[34] = settings.pngReduc;                         // pngReduc 34
    newSession[35] = settings.noHTTPS;                          // noHTTPS 35
	newSession[36] = settings.autoRecord;      // autoRecord 36
//console.debug("newSession: " + newSession);
    eventIndex = 1;
}
//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
function getNewEvent(event) {                                        // From  INJECTED SCRIPT
                                                                    ///////////////////////////

	if (startTime == 0) startTime = event.data[TIME_STAMP];  // init startTime

	if (event.data[TYPE] == 'readystatechange') {
		console.log('-------------------->>> background readystatechange ');
	}


	if ( (localStorage.autoRecord != 'auto') &&
		 (localStorage.autoRecord != 'autoHidden') &&
		 !recording ) return;

	updateBadge();

	if (flagPrefChange) {
        flagPrefChange = false;
        pushNewSession('prefChange');
    }
	else if (eventIndex > MAX_EVENT_INDEX) {
		pushNewSession('maxEvents');
		event.data[FLAG_PHOTO] = true;
	}
	else if ((event.data[TIME_STAMP] - startTime) > MAX_TIME) {
		pushNewSession('maxTime');
		startTime = event.data[TIME_STAMP];
		event.data[FLAG_PHOTO] = true;
	}

	//if (newSessionInterval > NS_START_INTERVAL) pushNewSession('wakingUp' + '-' + newSessionInterval);
//	clearSessionTimeout();

        event.data[0] = localStorage.userId; // userId

        var winTabIndex = findWinTabIndex(event.tabId, event.windowId);
        event.data[7] = winTabIndex.win;	        // winIndex  	7
        event.data[8] = winTabIndex.tab;            // tabIndex	8

		var currentURL = event.data[11];
		if (!currentURL) currentURL = '';
		if ((lastURL != currentURL) && (currentURL) && (lastURL)) {
			event.data[FLAG_PHOTO] = true;
			console.log('lastURL: ' + lastURL);
			console.log('currentURL: ' + currentURL);
		}
		lastURL = currentURL;

		var tabsCount = "";

//		chrome.windows.getLastFocused(function(window) {tabsCount = window.tabs.length});

//		chrome.windows.getAll(function(windows) {event.data[9] = windows.length}); // winTabCard	9
        event.data[54] = eventIndex++;        // eventIndex (old 54  rang event dans session)
        event.data[55] = sessionId;                      // sessionId   55

        if (ST_Events.length == 0) {  // ??????????????
//            ST_Events.push(event.data);
//            return;
        }
//------------------------------------------------------------------------   	//  PHOTO
		if (flagButtonStartPhoto) {
			event.data[FLAG_PHOTO] = true;
			flagButtonStartPhoto = false;
		}
        var photoDone = false;
        event.data[46] = "";
                                             //   "pngPlus" (46)
        if (localStorage.pngPlus == 'true') {
            if (event.data[FLAG_PHOTO_PLUS]   //  74
			/*&& event.data[5] != 'function Window()'*/) {  //  5: target=function Window()

				if (event.data[FLAG_PHOTO] && event.data[TYPE] == 'readystatechange') {
					console.log('-------------------->>> photo readystatechange ');
				}

				captureVisibleTab();
				photoDone = true;
            }
        }
        if (!photoDone) {
            if (localStorage.png == 'true') {
                if (event.data[FLAG_PHOTO]     // 75
				/*&& event.data[5] != 'function Window()'*/) {  //  5: target=function Window()
					captureVisibleTab();
					photoDone = true;
                }
            }
        }

        if (photoDone) {
            console.log("PHOTO!");
            pngStack.push(event.data);
        }
        else {
            ST_Events.push(event.data);
        }

        if (ST_Events.length > localStorage.maxEvents) {     // maxEvents
             showError("Transmission demandée...");
             postTrack();
        }
}
//////////////////////////////////////////////////////////////////// FIN getNewEvent
///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////   captureVisibleTab
function captureVisibleTab() {

  chrome.tabs.captureVisibleTab({format: 'png'},
		function (srcImage) {  /* handleImage */

	    var pngEvent = pngStack.shift();
	    if (localStorage.pngReduc != '1' && srcImage) {
	    	//****************************************************************  réduction png
				var transIm = document.createElement('img');
				transIm.src = srcImage;
			//	transIm.width = pngEvent[65];
			//	transIm.height = pngEvent[64];
				var reduc = localStorage.pngReduc;
				var width2 = Math.round(pngEvent[65] * reduc);
				var height2 = Math.round(pngEvent[64] * reduc);
				var myCanvas2 = document.createElement('canvas');

				myCanvas2.width = width2;
				myCanvas2.height = height2;

				var ctx2 = myCanvas2.getContext('2d');
				ctx2.drawImage(transIm, 0, 0, width2, height2);
				//srcImage = myCanvas2.toDataURL().replace("image/png", "image/octet-stream");
				srcImage = myCanvas2.toDataURL("image/png").replace("image/png", "image/octet-stream");
	    }
	   //   *****************************************************************

	    if (!srcImage || srcImage.length < 20) console.log('$$$$$$$$$$$$$$$$$$$$$  ERREUR image ');

			console.log("callBackImage: " + pngStack.length);
			pngEvent[46] = '<img src="' + srcImage + '" alt="Pas d\'image!" />';
	    ST_Events.push(pngEvent);

	    showError("***********************Transmission IMAGE demandée...");
	    postTrack();
	  }
);

}
////////////////////////////////////////////////////////////////  MEMO WINDS & TABS
function findWinTabIndex(sourceTab, activeWin) {
    var winIndex = -1;
    var tabIndex = -1;
		var i;
    for (i = 0; i < winds.length; i++) {
        if (winds[i] === activeWin) {
            winIndex = i;
            break;
        }
    }

    if (winIndex == -1) {
        winIndex = winds.push(activeWin) - 1;
        var newTabsLine = [];
        newTabsLine.push(sourceTab);
        tabs.push(newTabsLine);
    }

    for (i = 0; i < tabs[winIndex].length; i++) {
        if (tabs[winIndex][i] === sourceTab) {
            tabIndex = i;
            break;
        }
    }
    if (tabIndex == -1) {
        tabIndex = tabs[winIndex].push(sourceTab) - 1;
    }

    winIndex++; tabIndex++;
//    console.log("WIN TAB :" + winIndex  + "," + tabIndex);
    return({win: winIndex, tab: tabIndex});
}

/////////////////////////////////////////////////////////////////////
function preTraitementHTML(html, base) {                        //   inutilisé
    if (html == "") return("");
    console.log('<head><base href="' + base + '/" />');
    return(html.replace(/<head>/, '<head><base href="' + base + '/" />'));
/*
    var newHtml = html.replace(/\s+(action\s*=\s*"|action\s*=\s*'|url\('|url\("|href\s*=\s*'|src\s*=\s*'|href\s*=\s*"|src\s*=\s*")(?!https?:\/\/)/g, " $1" + base + "/");
    newHtml = newHtml.replace(/\/\.\//g, "/");
//    newHtml = newHtml.replace(/\/\//g, "/");
    console.log("base: " + base);
    return(newHtml);
*/
}
///////////////////////////////////////////////////////////    showError(errorText)
function showError(errorText, err) {
    console.log(errorText);
	updateBadge(err);
}
/////////////////////////////////////////////////////////////// postTrack
function postTrack() {
	if (ST_Events.length == 0) return;
	if (ST_Events[ST_Events.length-1][1] == "newUser") return;
    if (dontPost) return;

//		BLOCAGE SÉRIALISATION DU POST
    dontPost = true;
	showError("Transmission en cours...");
    ST_EventsPostSize = ST_Events.length;
    var jsonString = JSON.stringify(ST_Events);
    post(jsonString, postCallback);
}
////////////////////////////////////////////////// post
function post(track, callback) {                // CGI-AJAX
    var url0 = localStorage.ST_URL;

    var match = url0.match(/^https?:\/\/\w/);
    if (!match) {
        showError("URL invalide: " + url0, true);
        dontPost = false;
        return;
    }
	sXtRacine = url0;
    var url = url0 + "/SiouXtrack.php";
    showError("Taille POST: " + track.length);
    postTime = Math.round((new Date()).getTime()/1000);
    var request = new XMLHttpRequest();
    var timedOut = false;
    var timer = setTimeout(function() {
        timedOut = true;
//        dontPost = false;
        request.abort();
    }, TIME_OUT);

    request.open("POST", url);
    request.onreadystatechange = function() {
      if (request.readyState !== 4) return;
//        request.timeout = TIME_OUT;  non implémenté
      if (timedOut) {
          showError("Le serveur ne repond pas!   Timeout", true);
//          dontPost = false;
          return;
      }
      clearTimeout(timer);
      if (request.status === 200) {
//      showError("Status: " + request.getResponseHeader("Status"));
          if (request.getResponseHeader("SebStatus") > 300)
                callback([false, request.readyState, request.getResponseHeader("SebStatus"), url0, request.getResponseHeader("SebError")]);
          else
                callback([true, request.readyState, request.status, url0, request.status]);
      }
      else  {
          callback([false, request.readyState, request.status, url0, request.status]);
      }
    };

    request.onerror = function() {
            showError("Le serveur ne repond pas. Verifier l'URL: " + url + "   status: " + request.status, true);
//       dontPost = false;
		};


//      request.ontimeout = function() { } non implémenté
     request.setRequestHeader("Content-Type", "application/json");
//     request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	try {
		request.send(track);
		pendingAjax++;
		chrome.browserAction.setBadgeText({text: String(pendingAjax)});
        for (var i = 0; i < ST_EventsPostSize; i++) {
           ST_Events.shift();
        }
		while (ST_Events.length > MAX_TRACE) {
			  ST_Events.pop();
			  showError("Trace trop longue!\nShift.");
		}
		dontPost = false;
	}
	catch(e) {
		updateBadge(true);
		showError("----------------------------------- Echec du SEND");
		dontPost = false;
	}
}
///////////////////////////////////////////////////////////// callback du post
function postCallback(result) {
	pendingAjax--;
	chrome.browserAction.setBadgeText({text: String(pendingAjax)});
    showError("CALLBACK: " + result[0] + "  " + result[1] + "  " + result[2]  + result[3] + " status: " + result[4]);
    if (result[0]) {

//  POUBELLE
/*
          var newNbEvent = ST_Events.length - ST_EventsPostSize;
          if (newNbEvent > 0) {
                var ST_Temp = [];
                for(var i = ST_Events.length - newNbEvent, j = 0; i < ST_Events.length; i++, j++) {
                    ST_Temp[j] = ST_Events[i];
                }
                ST_Events = ST_Temp;
          }
          else ST_Events=[];
*/

//  version GARDE
/*          for (var i = 0; i < ST_EventsPostSize; i++) {
                ST_Events.shift();
          }
*/
          postTime = Math.round((new Date()).getTime()/1000) - postTime;
          showError("Enregistrement OK en " + postTime + " sec.");   //  OK OK OK OK
    }

// version GARDE
/*    while (ST_Events.length > MAX_TRACE) {
          ST_Events.pop();
          showError("Trace trop longue!\nShift.");
    }
*/
	if (result[2] == 500) showError('status of 500 (No Content)', true);
    else if (!result[0] && (result[2] > 499)) {
          showError(result[3] + " (" + result[4] + ")");
    }
    else if (!result[0] && (result[2] > 399)) {
          showError(result[3] + " (No Found " + result[2] + ")", true);
    }
//    dontPost = false;
}
