///////////////////////////////////////////////////////////////////////////////
/////////////////       inject.js   (opera)
////////////////////////////////////////////////////////////////////////////////
(function(){   ///// début fonction anonyme
//-------------------------------------------------------------------------------
var MAX_HTML = 10000;
var TYPE = 4;
var TARGET = 5;
var SEL_START = 52;
var SEL_END = 53;
var balHTML = 21;
var TIME_STAMP = 1;
var STATION = 23;
var FLAG_PHOTO = 75;
var FLAG_PHOTO_PLUS = 74;
var MAX_TEXT_CONTENT = 400;

////////////////////////////////////////////////////////////////
var lastURL = '';
var scrolling = false;
var lastTimeScroll;
var debInject = true;
var getHTML = false;
var getPngPlus = false;
var minStation = 0;
var interStation = 0;
var lastStation = (new Date()).getTime();
var lastHTML = '';
var changedHTML = false;
var lastEvent = '';
var mousedownCoors = {x:0, y:0};
var windowTarget = false;
var touchEvent = false;
var clickTimeout;
var fullEventMemo;
CLICK_DIF_DELAY = 500;
var MIN_TIME_INTER_PHOTO = 500;
var MIN_TIME_INTER_APP = 100;
var timeLastPhoto = Date.now();
var waitAppPhoto = 'clear';

var focusOffset;
var foxusExtend;

////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////// R E A D Y
$(document).ready(function () {

chrome.extension.onMessage.addListener(getEventNames);
if (window.top === window) chrome.extension.sendMessage('connect');


function getEventNames(data, sender, sendResponse) {

//	text20.connector.listener("fixation", getTobiiEvent);
//	text20.core.init();     //   init text20

	console.log('getEventNames: ' + data);
	for (var i = 0; i< data.length; i++) {
		if (data[i].getHTML) getHTML = (data[i].getHTML == 'true') ? true : false;
		else if (data[i].getPngPlus) getPngPlus = (data[i].getPngPlus == 'true') ? true : false;
		else if (data[i].minStation) minStation = Number(data[i].minStation);
		else document.addEventListener(data[i].event, getAction, true);
	}
	document.addEventListener('click', getAction, true);
	document.addEventListener('dblclick', getAction, true);

/*document.addEventListener('mousemove', getAction, true);  // envoyés par Background.js
document.addEventListener('mousewheel', getAction, true);
document.addEventListener('scroll', getAction, true);
document.addEventListener('mouseover', getAction, true);
document.addEventListener('mouseout', getAction, true);*/

	document.addEventListener('mousedown', getAction, true);
	document.addEventListener('mouseup', getAction, true);

	document.addEventListener('keypress', getAction, true);
	document.addEventListener('keydown', getAction, true);
	document.addEventListener('keyup', getAction, true);
	document.addEventListener('change', getAction, true);

//	document.addEventListener('pagehide', getAction, true);
	document.addEventListener('resize', getAction, true);
	document.addEventListener('undo', getAction, true);
	document.addEventListener('redo', getAction, true);

// document.addEventListener('load', getAction, true);      // load doc
	document.addEventListener('copy', getAction, true);


	document.addEventListener('contextmenu', getAction, true);
	document.addEventListener('dragstart', getAction, true);
	document.addEventListener('dragend', getAction, true);
	document.addEventListener('dragleave', getAction, true);
	document.addEventListener('drop', getAction, true);

	document.addEventListener('input', getAction, true);
	document.addEventListener('reset', getAction, true);
	document.addEventListener('select', getAction, true);
	document.addEventListener('submit', getAction, true);

	document.addEventListener('ended', getAction, true);
	document.addEventListener('pause', getAction, true);
	document.addEventListener('play', getAction, true);
	document.addEventListener('playing', getAction, true);
	document.addEventListener('seeking', getAction, true);
															// SVG
	document.addEventListener("SVGZoom",getAction,false);
	document.addEventListener("SVGScroll",getAction,false);
	document.addEventListener("SVGResize",getAction,false);

//	document.addEventListener("DOMFocusIn",getAction,false);
//	document.addEventListener("DOMFocusOut",getAction,false);

//                                                         	 TOUCH
	document.addEventListener('touchstart', getAction, true);
//document.addEventListener('touchmove', getAction, true);  // envoyés par Background.js
	document.addEventListener('touchend', getAction, true);
	document.addEventListener('touchenter', getAction, true);
	document.addEventListener('touchleave', getAction, true);

//	document.addEventListener('focus', getAction, true);
//	document.addEventListener('blur', getAction, true);

//	window.addEventListener('focus', getAction, true);  // important
//	window.addEventListener('blur', getAction, true);	// important

	window.addEventListener('resize', getAction, true);
	window.addEventListener('pageshow', getAction, true);
//	document.addEventListener('readystatechange', getAction, true); // alternative à pageshow ?
	window.addEventListener('pagehide', getAction, true);
//window.addEventListener('unload', getAction, true);
//window.addEventListener('load', getAction, true);        // load win   PERTURBE LES URL REC. DU HTML
	window.addEventListener('popstate', getAction, true);

//safari.self.addEventListener('okHtml', writeHtml, false);
}

/////////////////////////////////////////////////////////////////////////////////////
function getTobiiEvent(event) {   // événement Tobii
	if(event.type != "END") return;
	console.log("Fixation (" + event.x + "/" + event.y + ") " + event.duration + "ms, " + event.meanderivation + "px");
}
//////////////////////////////////////////////////////////////////////////////////////
//																												g e t  A c t i o n ( EVENT )
//////////////////////////////////////////////////////////////////////////////////////
function getAction(event) {    //  événement dans la page

var flagPhoto = false;
var action = [];

if (event.type == 'load') {
	console.log('load');
	if ((window.top != window) || (!event.target.URL)  || (event.target.URL == 'about:blank')) return;
}

if (window.top != window) console.log('FRAMEFRAMEFRAMEFRAMEFRAMEFRAME: ' + event.target.URL + '  ' + event.currentTarget.URL);

action.push('');				// userId  	0
//action.push(event.timeStamp);
action.push(Date.now());												// timeStamp  	1

var dt = (new Date());
var date = dt.getDate().toString();
if (date.length == 1) date = '0' + date;
var month = (dt.getMonth() + 1).toString();
if (month.length == 1) month = '0' + month;
var year = (dt.getYear() + 1900);
action.push(year + '-' + month + '-' + date);            //  date 2
action.push(dt.toTimeString().match(/^(.{8})/)[1]);       //  time 3

action.push(event.type); 			// type  	4

if ( event.type == 'copy' ) {
	console.log('----------------> copy');
}


action.push(getObjectClass(event.target));  	// target  	5


action.push(event.target.id);  			// elementId   LIBRE	6

action.push('');				// winIndex	 	7
action.push('');				// tabIndex  	8
action.push('');				// winTabCard	9

if (event.type.indexOf('touch') != -1) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>> TOUCH: ' + event.type);
    touchEvent = true;
}
else touchEvent = false;

/*/////////////////////////////////////////////////////   DEBUG
if (action[4] == 'focus' && action[5] == 'Input') {
	var coucou = 1;
}
//////////////////////////////////////////////////////*/

//if ((event.type == 'load') || (event.type == 'resize') || (event.type == 'pageshow')
//     || (event.type == 'pagehide') || (event.type == 'unload') || (event.type == 'popstate')) {
if (!('domain' in event.currentTarget)) {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WIN: ' + event.type);
  windowTarget = true;
  try {
	action.push(event.target.document.domain); // docDomain
	action.push(event.target.document.URL); // docURL
	action.push(event.target.document.referrer); // docReferrer
	action.push(event.target.document.title); // docTitle
  }
  catch(e) {
	try {
		action.push(event.target.domain); // docDomain
		action.push(event.target.URL); // docURL
		action.push(event.target.referrer); // docReferrer
		action.push(event.target.title); // docTitle
	}
	catch(e) {
		action.push(event.currentTarget.document.domain); // docDomain		10
		action.push(event.currentTarget.document.URL); // docURL		11
		action.push(event.currentTarget.document.referrer); // docReferrer	12
		action.push(event.currentTarget.document.title); // docTitle		13
	}
  }
}
else {
  windowTarget = false;
  action.push(event.currentTarget.domain); // docDomain		10
  action.push(event.currentTarget.URL); // docURL		11
  action.push(event.currentTarget.referrer); // docReferrer	12
  action.push(event.currentTarget.title); // docTitle		13
}


if (typeof event.target.className == 'string')
  action.push(event.target.className);  // targetClassName	14
else action.push('');

  action.push(event.target.localName);  // targetLocalName	15
  action.push(event.target.type);  // targetType		16
  action.push(event.target.nameSpaceURI); // targetNameSpaceURI	17
  action.push(event.target.defaultValue); // targetDefaultValue	18
/////////////////////////////////////////////////////////////////////////////////////////////////
//																																	-->	T E X T E   C O N T E N T
	var targetContent = event.target.textContent;
//	if ( (event.target.localName == 'div') && (lastEvent == 'keyup') )
//							action.push(targetContent.substring(textContent.length - MAX_TEXT_CONTENT + 10));


	if ( event.type == 'keypress' || event.type == 'input' )
				action.push('<same as previous>');													// targetValue		19

	else if ( event.type == 'keyup' || event.type == 'keydown') {
		// document.getSelection().focusNode.data // texte paragraphe du caret
		//																	.parentNode  // p quand paragraphe
		//																	.length // taille texte
		// 												.focusOffset // deb selection
		//												.extendOffset // fin selection

		var focusText = document.getSelection().focusNode.data;
		var focusTextLength = document.getSelection().focusNode.length;
		focusOffset = document.getSelection().focusOffset;
		focusExtend = document.getSelection().focusExtend;
		var caretText;
		if ( focusOffset < MAX_TEXT_CONTENT /2 - 1) {
			caretText = focusText;
		}
		else {
			focusOffset = focusOffset - MAX_TEXT_CONTENT /2 + 1;
			focusExtend = focusExtend - MAX_TEXT_CONTENT /2 + 1;
			caretText = focusText.substring(focusOffset, focusOffset + MAX_TEXT_CONTENT /2 -1);
		}
		action.push(caretText);																				// targetValue		19
	}

	else if (('textContent' in event.target) &&
        		(targetContent) &&
            (event.target.localName != 'svg')) {
              action.push(targetContent.substring(0, MAX_TEXT_CONTENT - 1)); // targetValue		19
	}

  else if ('value' in event.target) action.push(event.target.value); // targetValue		19

  else action.push('');																							// targetValue		19
//																													--> FIN   	T E X T E   C O N T E N T
//////////////////////////////////////////////////////////////////////////////////////////////////

  action.push(event.target.title);  // targetTitle		20

  //-----------------------------------------------------------------  htmlTag et outerHTML 21 et 22

	changedHTML = false;
	if ((getHTML /* || getPngPlus*/) && (lastEvent == 'click') && (event.type != 'mousemove')) {
		if (document.documentElement.outerHTML != lastHTML) changedHTML = true;  // comparaison balise html
	}
	if (debInject) changedHTML = true;

	action.push('');  																		 // réserve htmlTag document  21
		action.push('');   																	// réserve outerHTML document  22
	interStation = action[TIME_STAMP] - lastStation;
	lastStation = action[TIME_STAMP];


	var currentURL = action[11];				  															  //  htmlTag   21
	if (currentURL == undefined) currentURL = '';
	if ((lastURL != currentURL) && (currentURL) && (lastURL)) {
		flagPhoto = true;
		if (getHTML) {
			var newHtml = document.documentElement.outerHTML;
			if (!filtreUrl(currentURL)) {
																											// htmlTag commented out
				// action[balHTML] = newHtml; 																// htmlTag document  21
			}
			else {    // même URL
				if (changedHTML)   // changement dans la page
						action[balHTML] = document.documentElement.outerHTML;
			}
		}
	}
	lastURL = currentURL;
																										// outerHTML commented out
	// if (interStation > minStation * 3) action[22] = event.target.outerHTML; // outerHTML   22

//	console.log('minStation: ' + minStation);
//	console.log('interStation: ' + interStation);
//	console.log('--------');


   //--------------------------------------------------------------------------
  action.push(interStation);      						// station	 23
  action.push('doc');  						// winDoc	 24
  action.push(getObjectClass(event.relatedTarget));  		// relatedTarget 25
  //------------------------------------------------------------------------------  Rectangles
  //							   		 targetRect
  if ('getBoundingClientRect' in event.target) {
    action.push(event.target.getBoundingClientRect().bottom);	// targetRectB  26
    action.push(event.target.getBoundingClientRect().height);	// targetRectH  27
    action.push(event.target.getBoundingClientRect().left);	// targetRectL  28
    action.push(event.target.getBoundingClientRect().right);	// targetRectR  29
    action.push(event.target.getBoundingClientRect().top);	// targetRectT  30
    action.push(event.target.getBoundingClientRect().width);	// targetRectW  31
  }
  else for (i=0; i<6; i++) action.push(0);
  //									 docRect
  if ((event.currentTarget.documentElement != undefined) &&
	('getBoundingClientRect' in event.currentTarget.documentElement)) {
    action.push(event.currentTarget.documentElement.getBoundingClientRect().bottom); // docRectB 32
    action.push(event.currentTarget.documentElement.getBoundingClientRect().height); // docRectH 33
    action.push(event.currentTarget.documentElement.getBoundingClientRect().left);   // docRectL 34
    action.push(event.currentTarget.documentElement.getBoundingClientRect().right);  // docRectR 35
    action.push(event.currentTarget.documentElement.getBoundingClientRect().top);    // docRectT 36
    action.push(event.currentTarget.documentElement.getBoundingClientRect().width);  // docRectW 37
  }
  else for (i=0; i<6; i++) action.push(0);
//--------------------------------------------------------------------------------  Points
if (touchEvent) {
    var touch;
    if (event.type == 'touchend') touch = event.changedTouches.item(0);
    else touch = event.touches.item(0);
  action.push(touch.clientX);   	// clientX	38
  action.push(touch.clientY);   	// clientY	39
  action.push(touch.pageX);   		// pageX	40
  action.push(touch.pageY);   		// pageY	41
  action.push(touch.screenX);   	// screenX	42
  action.push(touch.screenY);   	// screenY	43
}
else {
  action.push(event.clientX);   	// clientX	38
  action.push(event.clientY);   	// clientY	39
  action.push(event.pageX);   		// pageX	40
  action.push(event.pageY);   		// pageY	41
  action.push(event.screenX);   	// screenX	42
  action.push(event.screenY);   	// screenY	43
}
// ------------------------------------------------------------------------------  AV
  action.push(event.target.src);  	// src		44
  action.push(event.target.checked);  	// shecked	45
  action.push('');  				// png		46
  action.push(event.target.href);  	// href  	47
  action.push(event.target.name);  	// name 	48
  action.push(event.target.autoPlay);  	// autoPlay	49
  action.push(event.target.currentSrc); // currentSrc	50
  action.push(event.target.muted);  	// muted	51
	if ( event.type.match(/key/) || event.type == 'input' ) {
		try {
			action.push(focusOffset); // selStart 	52
		}
		catch (e) {console.log(e)}
		try {
			action.push(focusExtend); // selEnd			53
		}
		catch (e) {console.log(e)}
	}
	else {
  	action.push(event.target.paused);  	// paused	52
  	action.push(event.target.poster);  	// poster	53
	}
// ------------------------------------------------------------------------------
  action.push('');			// tabIndex 	54
  action.push('');			// sessionIndex 55
// ------------------------------------------------------------------------------  Keyboard
  action.push(event.altKey); 				// altKey	56
  action.push(event.ctrlKey); 				// ctrlKey	57
  action.push(event.metaKey); 				// metaKey	58
  action.push(event.shiftKey); 				// shiftKey	59

  action.push(String.fromCharCode(event.charCode)); 	// char 	60
  action.push(event.charCode); 				// charCode	61
  action.push(event.keyCode); 				// keyCode	62
  action.push(event.button); 				// button	63
// ----------------------------------------------------------------------------- Windows coor
  action.push(window.innerHeight);			// winInnerHeight 64
  action.push(window.innerWidth);			// winInnerWidth 65
  action.push(window.outerHeight);			// winOuterHeight 66
  action.push(window.outerWidth);			// winOuterWidth 67
  action.push(window.pageXOffset);			// winPageXOffset 68
  action.push(window.pageYOffset);			// winPageYOffset 69
  action.push(window.screenX);				// winScreenX 70
  action.push(window.screenY);				// winScreenY 71
  action.push(window.screen.height);				// screenHeight 72
  action.push(window.screen.width);				// screenWidth 73

//--------------------------------------------
  action.forEach(function(prop,i,action) {
    if (prop===null) action[i]='';
    else if (prop === undefined) action[i]='';
    else if (prop === 'undefined') action[i]='';
    else if (prop === 'null') action[i]='';
    else if (prop===true) action[i]='true';
    else if (prop===false) action[i]='false';
  });
//---------------------------------------------
  if (action[balHTML] != '') {
    var base = document.querySelector('base');
//	var base = document.getElementsByTagName('base')[0];
	if (!base)  {
	  if (document.location.href.match(/:\/\/www\./)) base = document.location.protocol + '//' + document.location.hostname;
	  else base = document.location.href.match(/(.*)\//)[1];
	  action[balHTML] = action[balHTML].replace(/<head>/, '<head><base href="' + base + '/" />');
	}
  }


//..............................  mousedown   mouseup    drag     PHOTO
	action[FLAG_PHOTO_PLUS] = false;
	action[FLAG_PHOTO] = flagPhoto;

	if ((event.type == 'mousedown') || (event.type == 'touchstart')) {
		mousedownCoors.x = event.clientX;
		mousedownCoors.y = event.clientY;
	}
	else if ((event.type == 'mouseup') || (event.type == 'touchend')) {
		if (!((mousedownCoors.x == event.clientX) && (mousedownCoors.y == event.clientY))) {
			action[FLAG_PHOTO_PLUS] = true;
		}
	}
	else if ((event.type == 'dragend') || (event.type == 'dragstart') || (event.type == 'drop')) {
		action[FLAG_PHOTO_PLUS] = true;
	}
////////////////														PHOTO png PLUS  74

  if (scrolling && !((action[TYPE] == 'scroll') || (action[TYPE] == 'mousewheel') || (action[TYPE] == 'resize'))) {
	console.log('fin scroll');
	console.log('type: ' + action[TYPE]);
	scrolling = false;
	action[FLAG_PHOTO_PLUS] = true;	// FLAG_PHOTO_PLUS 74  true = faire photo
  }
  else if (!scrolling && ((action[TYPE] == 'scroll') || (action[TYPE] == 'mousewheel') || (action[TYPE] == 'resize'))) {
	lastTimeScroll = event.timeStamp;
	console.log('debut scroll');
	console.log('type: ' + action[TYPE]);
	scrolling = true;
  }
  else if (scrolling && ((action[TYPE] == 'scroll') || (action[TYPE] == 'mousewheel') || (action[TYPE] == 'resize'))) {
	if (((event.timeStamp - lastTimeScroll) > minStation) && (action[TYPE] != 'resize')) {
		console.log('max inter');
		lastTimeScroll = event.timeStamp;
		action[FLAG_PHOTO_PLUS] = true;   // FLAG_PHOTO_PLUS 74  true = faire photo
	}
  }
///////																	PHOTO png 75
  if (debInject) {
	action[FLAG_PHOTO] = true;   								// FLAG_PHOTO 75  true = faire photo
	debInject = false;
  }
//  else action[FLAG_PHOTO] = false;
  if (action[TYPE] == 'pageshow'/* || action[TYPE] == 'load'*/ ) {
	action[FLAG_PHOTO] = true;   // double emploi avec changement URL
  }

	if ( action[TYPE] == 'dblclick' ) clearTimeout(clickTimeout);

  if (getPngPlus) {
		if (changedHTML) action[FLAG_PHOTO_PLUS] = true;  // FLAG_PHOTO_PLUS 74   changement HTML
		else if ((action[TYPE] == 'focus') && (action[TARGET].indexOf('function') != -1)) action[FLAG_PHOTO_PLUS] = true;
//		else if ((lastEvent == 'blur') || (lastEvent == 'focus')) action[FLAG_PHOTO_PLUS] = true;
//		else if ((action[TYPE] == 'click') /* || (action[TYPE] == 'dblclick') */) action[FLAG_PHOTO_PLUS] = true;
		else if ((action[TYPE] !== 'resize') && (lastEvent == 'resize')) action[FLAG_PHOTO_PLUS] = true;
//		else if ((action[TYPE] == 'resize') && !(lastEvent == 'resize')) action[FLAG_PHOTO_PLUS] = true;
	}
	if ( (lastEvent == 'keyup') && ( action[TYPE].match(/mouse/)) ) { // photo frappe clavier
		action[FLAG_PHOTO_PLUS] = true;
  }
  if (action[FLAG_PHOTO]) console.log('>>>>>>>>>>>>>>>>>>>>>>>>photo');
  if (action[FLAG_PHOTO_PLUS]) console.log('>>>>>>>>>>>>>>>>>>>>>>photo plus');
  console.log(action[TYPE] + ' ' + action[TARGET]);
//  console.log('---------');

//////////////////////////////////////////////////////////////////////////////////////////
// ...................................................................... photo différée
	fullEventMemo = action;  // memo de l'évenement courant
	if ( action[TYPE] == 'click' ) {
		clearTimeout(clickTimeout);
		setTimeout(function () { doClickTimeout('clickDif1'); }, CLICK_DIF_DELAY);
		clickTimeout = setTimeout(function () { doClickTimeout('clickDif2'); }, CLICK_DIF_DELAY *3);
	}

////////////////////////////////////////////////////////   			TRANSMISSION
  try {
	chrome.extension.sendMessage(action);
  }
  catch (e) {
    console.log(e + ' DATA_CLONE_ERR DATA_CLONE_ERR DATA_CLONE_ERR DATA_CLONE_ERR');
  }
  lastEvent = event.type;
  if (action[balHTML] != '') lastHTML = action[balHTML];
}
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////// FIN getAction
///////////////////////////////////////////////////////////////////////////////////
function doClickTimeout(message) {

	var stamp = Date.now();
	// if ( (message == 'clickDif') && (stamp - timeLastPhoto) < MIN_TIME_INTER_PHOTO ) return;

	timeLastPhoto = stamp;  // mise à jour heure dernière photo

	fullEventMemo[1] = stamp;															// timeStamp  	1
	var dt = (new Date());
	var date = dt.getDate().toString();
	if (date.length == 1) date = '0' + date;
	var month = (dt.getMonth() + 1).toString();
	if (month.length == 1) month = '0' + month;
	var year = (dt.getYear() + 1900);
	fullEventMemo[2] = year + '-' + month + '-' + date;				//  date 2
	fullEventMemo[3] = dt.toTimeString().match(/^(.{8})/)[1];	//  time 3
	fullEventMemo[TYPE] = message;													//  type 4
	fullEventMemo[FLAG_PHOTO] = true;
	fullEventMemo[FLAG_PHOTO_PLUS] = true;

	console.log('>>>>>>>>>>>>>>>>>>>>>>PHOTO  ' + message);
	try {
	chrome.extension.sendMessage(fullEventMemo);
	}
	catch (e) {
		console.log(e + '>>>>>>>>>>>>>>>>>>>>>>>> DO_CLICK_TIMEOUT ERROR');
	}

}

/////////////////////////////////////////////////////////////////////////////////////
function filtreUrl(url) {
    try {
        var filtre = false;
        if (url.search(/^https?:\/\/www\.facebook\.com\/plugins/) != -1) filtre = true;
        else if (url.search(/^https?:\/\/platform\.twitter\.com/) != -1) filtre = true;
        else if (url.search(/^https?:\/\/plusone\.google/) != -1) filtre = true;
        if (filtre) {
            console.log('filtre: ' + url);
            return true;
        }
        return false;
    }
    catch (e) {
        return false;
    }
}
///////////////////////////////////////////////////////////////////////////////////
function getObjectClass(obj) {
     if (obj === null) return('null');
     if (obj === undefined) return('undefined');
     var arr;
     if (obj && obj.constructor && obj.constructor.toString) {
//      alert(obj.constructor.toString());
//	return(obj.constructor.toString());
	var var0 = obj.constructor.toString();
        arr = obj.constructor.toString().match(/^function HTML(\w+?)\(\)/);
        if (arr && arr.length == 2) {
            var arr2 = arr[1].match(/(.+)Element/);
            if (arr2 && arr2.length == 2) return arr2[1];
            else return arr[1];
        }
        arr = obj.constructor.toString().match(/^\[object HTML(\w+?)\]/);
        if (arr && arr.length == 2) {
             return arr[1];
        }
        arr = obj.constructor.toString().match(/^\[object (\w+?)Constructor\]/);
        if (arr && arr.length == 2) {
             return arr[1];
        }
     }
     if (obj.constructor.toString() === '[object HTMLElementConstructor]') return('Element');
      return(obj.constructor.toString().substring(0,17));
	// return('Function');
}
													// Patch pour Simples
  												// LISTEN to EVENT:  DOMSubtreeModified
///////////////////////////////////////////////////////////////////////////////
$(".hcollapsible-content #analysis-content").on("DOMSubtreeModified", function () {
	if ( waitAppPhoto == 'wait' ) return;
	waitAppPhoto = 'wait';
	setTimeout(function () {
		clearTimeout(clickTimeout);
		doClickTimeout('appEvent');
		waitAppPhoto = 'clear';
	}, MIN_TIME_INTER_APP);
});

}); // -----------  fin ready
/////////////////////////////////////////////////////////////// F I N     R E A D Y
///////////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------------
})();  ////   fin fonction anonyme
