
//  REPLAY.JS

var TIME_STAMP = 2;
var EVENT_DATE = 3;
var EVENT_TIME = 4;
var USER_ID = 6;
var TYPE = 8;
var TARGET = 9;
var DOC_URL = 11;
var DOC_TITLE = 13;
var WIN_INNER_HEIGHT = 18;
var WIN_INNER_WIDTH =  19;
var WIN_OUTER_HEIGHT = 20;
var WIN_OUTER_WIDTH = 21;
var WIN_PAGE_X_OFFSET = 22;
var WIN_PAGE_Y_OFFSET = 23;
var WIN_SCREEN_X = 24;
var WIN_SCREEN_Y = 25;
var SCREEN_HEIGHT = 26;
var SCREEN_WIDTH = 27;
var EVENT_ID = 30;
var BLOB_ID = 28;
var TARGET_LOCAL_NAME = 34;
var TARGET_VALUE = 38;
var CLIENT_X = 52;
var CLIENT_Y = 53;
var PAGE_X = 54;
var PAGE_Y = 55;
var SCREEN_X = 56;
var SCREEN_Y = 57;
var TARGET_RECT_B = 40;
var TARGET_RECT_H = 41;
var TARGET_RECT_L = 42;
var TARGET_RECT_R = 43;
var TARGET_RECT_T = 44;
var TARGET_RECT_W = 45;
var DOCRECT_B = 46;
var DOCRECT_H = 47;
var DOCRECT_L = 48;
var DOCRECT_R = 49;
var DOCRECT_T = 50;
var DOCRECT_W = 51;
var KEY_PRESS_CHAR = 71;
var ORG_REDUC_FACTOR = 20;
var ZOOM = 74;
var BUTTON = 74;
var SESSION_ID = 1;

//.............................
var LEFT_BOARD_WIDTH = 120;
var LEFT_BOARD_HEIGHT = 800;
var TOP_BOARD_HEIGHT = 20;
var BOTTOM_BOARD_HEIGHT = 120;
var BOARD_MARGIN = 15;
var GLOBAL_HEIGHT = 500;
var BOARD_MIN_WIDTH = 1000;
var INPUT_HEIGHT = 26;
var PADDING = 8;
var USER_ID_WIDTH = 460;
var TIMELINE_ZOOM_WIDTH = 220;
var TIMELINE_RIGHT_MARGIN = 30;
var TIMELINE_ADJUST = 20; // 25
//.............................
var BILLE_SIZE = 70; //100;
var MAX_ANIM_TIME = 800;
var MINI_REDUC= 8;
var MIN_TIME_ZOOM = 1;
var DECI_COUNTDOWN = 100; // 50;

var VERY_LIGHT_GRAY = '#EEE';
var DARK_BLUE = '#00B';
var DARK_GREEN = '#0A0';
var DARK_GREEN_TRANS = 'rgba(0,192,0,0.5)';
var DARK_GRAY = '#666';
var DARK_RED = '#d01c00';

/*
var EVENT_PROPS = {
			'focus': {color:'#4F4', z:13, width:3},
			'click': {color:'red', z:15, width:3},

		 	'clickDif1': {color:'green', z:15, width:1},
		 	'clickDif2': {color:'green', z:15, width:1},
		 	'appEvent': {color:'blue', z:15, width:2},

		 	'touchstart': {color:'#F82', z:14, width:2},
		 	'touchend': {color:'#4AA', z:14, width:2},

		 	'pageshow': {color:'#4F4', z:13, width:3},
		 	'resize': {color:'#730', z:16, width:3},  // #9DF
		 	'mousewheel': {color:'#FD0', z:9, width:1},
		 	'scroll': {color:'#FD0', z:9, width:2},
		 	'keydown': {color:'black', z:9, width:2},
		 	'keyup': {color:'black', z:9, width:2},
		 	'input': {color:'black', z:14, width:3},
		 	'keypress': {color:'black', z:9, width:2}
		};
*/

// créé par displayRequest.php: sessions, reducShowPng

var eventIndex = 0;
var pngIndex = 0;
var pngsIndex = [];
var pngs = {};
var pngsNumber = 0;
var reducFactor, origReducFactor;
var billeSize, correcPointer = 0;
var autoMode = false;
var prevMouse = false;
var speedFactor = 1;
var eventCountDown = 0;
var startEventCountDown= 0;
var timeOutId;
var countDownId;
var animTimeOutId;
var deciCountDownId;
var offsetX, offsetY;
var newImage = true;
var lastCommand;
var eventCountDownString;
var dureeProto, dureeProtoSec, dureeProtoMilli;
var lastImg, backImg;
var typeFilter = "";
var urlFilter = "";
var clignoUrlId, clignoTypeId;
var miniReducFactor = 0;
var timeLengthUnit;
var timeLineLeft;
var timelineDown = 0;
var timelineDrag = false;
var zoomOn = false;
var lastTimeDrag = 0;
var flagZoomOk = false;
var scales = [];
var moveBarreDiv = true;
var inputOn = false;
var sessionsInfo = {};
var currentSession;
var initFrame = true;
var inter1, waitResize1;

var mouseIsDown = false;
var zoomOrgFactor;



//*************************************************************************************************
//******************************************************************	R E A D Y   ***************
//*************************************************************************************************
$(document).ready(function() {
	var noSession = 'Aucun évènement!\nSélectionnez une ou plusieurs sessions contenant des énénements';
	try {					// pas de replay
		if (/*!sessions || */sessions.length < 2) {
			alert(noSession);
			window.close();
			return;
		}
	}
	catch(e) {
//			alert('ERROR' + noSession);
//			window.close();
//		return;
	}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


	dureeProtoMilli = sessions[sessions.length -1][TIME_STAMP] - sessions[1][TIME_STAMP];
	dureeProtoSec = (dureeProtoMilli / 1000).toFixed();
	dureeProto = secondstotime(dureeProtoSec);


	billeSize = reducShowPng * BILLE_SIZE;
	initReplay();  // NON déplacé dans findPngs()

	loadSessionsInfo();
	findPngs();


//	var flagbug = true; 					 	// forcer debug
//..........................................................

	$(document).keydown(function (event) {
/*												//	forcer debug
		if (flagbug) {
			flagbug = false;
			findPngs();
		}
*/
		if (event.which == 32 && inputOn) return;
		if (event.which == 9) {   // TAB
//			$(document).blur();
			event.preventDefault();
			return;
		}
		if ((event.which < 32) || (event.which > 40)) return;

		$("#event-type, #event-url").blur();
		event.preventDefault();
		if (event.which == 40) $("#end").click();
		else if (event.which == 38) $("#begin").click();
		else if (event.which == 39) $("#foreward").click();
		else if (event.which == 32) $("#foreward-multi").click();
		else if (event.which == 37) $("#backward").click();
	});
//................................................................
//................................................................
	$("#foreward-multi").on("click", function() {
		if (autoMode) {
			lastCommand = 'auto-stop';
			autoModeStop();
		}
		else if (eventIndex < sessions.length - 1) {
			lastCommand = 'auto-start';
			autoModeStart();
			displayMultiEvent(eventIndex);
		}
		else flashForbidden();
	});

	$("#begin").on("click", function() {
		if (eventIndex > 1) {
		lastCommand = 'begin';
			autoModeStop();
			var gardeIndex = eventIndex;
			eventIndex = 1;
			newImage = true;
			if (typeFilter || urlFilter) {
				if (findEventWithType(eventIndex, gardeIndex, 1)) displayEvent(eventIndex);
				else {
					flashForbidden();
					eventIndex = gardeIndex;
				}
			}
			else displayEvent(eventIndex);
			dureeWidthDivUpdate();
		}
		else flashForbidden();
	});

	$("#end").on("click", function() {
		if (eventIndex < sessions.length - 1) {
			lastCommand = 'end';
			autoModeStop();
			var gardeIndex = eventIndex;
			eventIndex = sessions.length - 1;
			newImage = true;
			if (typeFilter || urlFilter) {
				if (findEventWithType(eventIndex, gardeIndex, -1)) displayEvent(eventIndex);
				else {
					flashForbidden();
					eventIndex = gardeIndex;
				}
			}
			else displayEvent(eventIndex);
			dureeWidthDivUpdate();
		}
		else flashForbidden();
	});

	$("#foreward").on("click", function() {
		if (eventIndex < sessions.length - 1) {
			lastCommand = 'foreward';
			if (autoMode) {
				autoModeStart();
				displayMultiEvent(++eventIndex)
			}
			else {
				if (typeFilter || urlFilter) {
					var gardeIndex = eventIndex;
					if (findEventWithType(++eventIndex, gardeIndex, 1)) {
						newImage = true;
						displayEvent(eventIndex);
					}
					else {
						flashForbidden();
						eventIndex = gardeIndex;
					}
				}
				else {
					displayEvent(++eventIndex);
				}
			}
		}
		else flashForbidden();
	});

	$("#backward").on("click", function() {
		autoModeStop();
		if (eventIndex > 1) {
			lastCommand = 'backward';
			var gardeIndex = eventIndex;
			var nextIndex = eventIndex - 1;
			while (false) /* ((sessions[nextIndex][TYPE] == 'mousewheel')
					|| (sessions[nextIndex][TYPE] == 'scroll'))*/ {
				nextIndex--;
			}
			eventIndex = nextIndex;
			if (typeFilter || urlFilter) {
				if (findEventWithType(eventIndex, gardeIndex, -1)) {
					newImage = true;
					displayEvent(eventIndex);
				}
				else {
					flashForbidden();
					eventIndex = gardeIndex;
				}
			}
			else displayEvent(eventIndex);
		}
		else flashForbidden();
	});
//..............................................................
//................................................................
//...........................................................
	$("#event-num").on("blur", function() {
		if ((isNaN($(this).val()) ||
				 $(this).val() < 1 ||
				 $(this).val() > sessions.length - 1)) {
			$(this).val(eventIndex);
			flashForbidden();
		}
/*		else if (typeFilter || urlFilter) {
			var gardeIndex = eventIndex;
			eventIndex = $(this).val();
			var sens;
			if (eventIndex > gardeIndex) sens = 1;
			else sens = -1;
			if (findEventWithType(eventIndex, gardeIndex, sens)) {
				newImage = true;
				displayEvent(eventIndex);
			}
			else {
				flashForbidden();
				eventIndex = gardeIndex;
			}
		}*/
		else {
			typeFilter = "";
			urlFilter = "";
			$("#event-url").val("");
			eventIndex = $(this).val();
			newImage = true;
			displayEvent(eventIndex);
			dureeWidthDivUpdate();
		}
	});

/*	$("#speed").on("blur", function() {
		if (isNaN($(this).val())) $(this).val(speedFactor);
		else {
			speedFactor = $(this).val();
		}
	});*/
//.............................................................
	$("#backward, #foreward, #end, #begin, #foreward-multi, #timeline, #event-num").on("click", function() {
		clearInterval(clignoUrlId);
		clearInterval(clignoTypeId);
		$("#event-url").val(urlFilter);
		$("#event-type").val(typeFilter);

	});
//..............................................................
	$("#event-type").on("focus", function() {
		if (autoMode) $(this).blur();
		else inputOn = true;
		clearInterval(clignoTypeId);
		$("#event-type").val(typeFilter);
	});

	$("#event-type").on("blur", function() {
		inputOn = false;
		if (autoMode) return;
		var lastTypeFilter = typeFilter;
		typeFilter = $(this).val();
		if (typeFilter && (typeFilter != lastTypeFilter)) {
			clearInterval(clignoTypeId);
			clignoTypeId = setInterval(function() {
				if ($("#event-type").val() == "") $("#event-type").val(typeFilter);
				else $("#event-type").val("");
			}, 400);
		}
	});

	$("#event-target").on("click", function() {
		if (typeFilter) {
			typeFilter = "";
			$("#event-type").val("");
		}
		else {
			$("#event-type").val(sessions[eventIndex][TYPE]);
			typeFilter = sessions[eventIndex][TYPE];
		}
	});
//...............................................................
	$("#event-url").on("focus", function() {
		if (autoMode) $(this).blur();
		else inputOn = true;
		clearInterval(clignoUrlId);
		$("#event-url").val(urlFilter);
	});

	$("#event-url").on("blur", function() {
		inputOn = false;
		if (autoMode) return;
		var lastUrlFilter = urlFilter;
		urlFilter = $(this).val();
		if (urlFilter && (urlFilter != lastUrlFilter)) {
			clearInterval(clignoUrlId);
			clignoUrlId = setInterval(function() {
				if ($("#event-url").val() == "") $("#event-url").val(urlFilter);
				else $("#event-url").val("");
			}, 400);
		}
	});

	$("#top-board2").on("click", function() {
		if (urlFilter) {
			urlFilter = "";
			$("#event-url").val("");
		}
		else {
//			$("#event-url").val(sessions[eventIndex][DOC_URL]);
//			urlFilter = sessions[eventIndex][DOC_URL];
		}
	});


//	$("#foreward-multi:hover").css({"background-color":VERY_LIGHT_GRAY});

//......................................................................
//......................................................................
//											T I M E L I N E    C L I C K

//.............................  resize

	$(window).on("resize", function() {
		if (!zoomOn) {
			$("#timeline").width($("#top-board1").width() + (PADDING * 2));
			$("#timelineZoom").css("left",(window.innerWidth - TIMELINE_ZOOM_WIDTH) / 2);
			buildTimeline();
		}
		else {
			$("#timelineZoom").css("left",(window.innerWidth - TIMELINE_ZOOM_WIDTH) / 2).text(dureeWidth(window.innerWidth));
		}
		dureeWidthDivUpdate();
	});

//.............................  dblclick

	$(document).on("dblclick", function(event) {
		event.stopPropagation();
		event.preventDefault();
		return false;
	});

	//...............................  click

	$("#timeline00").on("click", function(event) {   //  zoom out
//		autoModeStop();
		if (scales.length <= 1) {
			$("#timeline").css({"left":timeLineLeft});
			$("#timeline").width($("#top-board1").width() + (PADDING * 2));
			if (scales.length == 1) scales.pop();
			zoomOn = false;
			buildTimeline();
		}
		else {
			$("#timeline").width($("#timeline").width() / scales[scales.length - 1]);
			buildTimeline();
			$("#timeline").css({'left': - $("#eventDiv" + eventIndex).position().left + event.clientX });
			verifTimelineBounds();
			scales.pop();
		}
		dureeWidthDivUpdate();
	});

//...............

	$("#timeline0").on("click", function(event) {
		if (timelineDrag) {
			timelineDrag = false;
			return;
		}
		if (zoomOn && !timelineDrag) {
			$("#timeline").animate({ 'left': - $("#eventDiv" + eventIndex).position().left + event.clientX }, 400, verifTimelineBounds);
		}
	});

//..............

	$("#timeline, #timelineZoom").on("click", function(event) {
		if (timelineDrag) {
			timelineDrag = false;
			return;
		}
		var x = event.clientX - $("#timeline").offset().left; // timeLineLeft;
		var time = x / timeLengthUnit;

		for (var i = 1;  i < sessions.length; i++) {
			if (sessions[i][TIME_STAMP] - sessions[1][TIME_STAMP] > time) {
				var gardeIndex = eventIndex;
				eventIndex = i;
				newImage = true;
				if (autoMode) {
					typeFilter = "";
					urlFilter = "";
					$("#event-url").val("");

					autoModeStart();
					displayMultiEvent(eventIndex)
				}
				else {
					if (typeFilter || urlFilter) {

						if (findEventWithType(eventIndex, gardeIndex, 1)) {
							displayEvent(eventIndex);
						}
						else {
							flashForbidden();
							eventIndex = gardeIndex;
						}
					}
					else {
						displayEvent(eventIndex);
					}
				}
				dureeWidthDivUpdate();
				break;
			}
		}
	});

//................................  mousedown

	$("*").on("mousedown", function(event) { mouseIsDown = true });

	$("#timeline0").on("mousedown touchstart", function(event) {
		timelineDown = lastTimeDrag = event.clientX;
		if (!zoomOn) {
			flagZoomOk = true;
			var offset = $("#dragDiv").offset();
			offset.left = event.clientX;
			$("#dragDiv").offset(offset);
			$("#dragDiv").css({"opacity":0.7, "width":0});
		}
		else flagZoomOk = false;
	});

	$("#timeline, #timelineZoom").on("mousedown touchstart", function(event) {
		timelineDown = lastTimeDrag = event.clientX;
		if (!event.altKey) {
			flagZoomOk = true;
			var offset = $("#dragDiv").offset();
			offset.left = event.clientX;
			$("#dragDiv").offset(offset);
			$("#dragDiv").css({"opacity":0.7, "width":0});
		}
		else flagZoomOk = false;
	});

//................................  mouseup

	$("*").on("mouseup touchend", function(event) { mouseIsDown = false });

	$("#timeline, #timelineZoom, #timeline0").on("mouseup touchend", function(event) {

		if ($("#dragDiv").width() == 0) {
			return;
		}
		var dragDivWidth = $("#dragDiv").width();
		$("#dragDiv").width(0);
		if (!flagZoomOk) return;

		if (event.clientX != timelineDown) {   // zoom
			timelineDrag = true;
			var dragWidth = event.clientX - timelineDown;
			if (dragWidth <= 2) return;

			var timeZoom = dureeWidth(dragDivWidth);
			if (timeZoom.split(' ')[0] <= MIN_TIME_ZOOM) return;
			var scale;
			if (zoomOn) scale = window.innerWidth / dragWidth;
			else scale = $("#timeline").width() / dragWidth;

			$("#timeline").width($("#timeline").width() * scale);

			var offset = $("#timeline").offset();
			if (zoomOn) offset.left = ((offset.left - timelineDown) * scale);
			else offset.left = ((offset.left - timelineDown) * scale) + offset.left;
			$("#timeline").offset(offset);
			dureeWidthDivUpdate();

			scales.push(scale);
			zoomOn = true;
			timelineDown = 0;
			moveBarreDiv = false;
			buildTimeline();
		}
		else timelineDrag = false;
	});

//...................................mousemove

	$(document).on("mousemove", function(event) {
		event.preventDefault();
		return(false);
	});

	$("#timeline0").on("mousemove touchmove", function(event) {

		//if (event.which != 1) return;
		if (!mouseIsDown) return;

		timelineDrag = true;
		var drag = event.clientX - lastTimeDrag;

		if (zoomOn) {
			var offset = $("#timeline").offset();
			offset.left = offset.left + drag;
			$("#timeline").offset(offset);
			dureeWidthDivUpdate();
			lastTimeDrag = event.clientX;
		}
	});

	$("#timeline, #timelineZoom").on("mousemove touchmove", function(event) {

		//if (event.which != 1) return;
		if (!mouseIsDown) return;

		timelineDrag = true;
		var drag = event.clientX - lastTimeDrag;

		if (zoomOn && event.altKey) {
			var offset = $("#timeline").offset();
			offset.left = offset.left + drag;
			$("#timeline").offset(offset);
			dureeWidthDivUpdate();
		}
		else {
			$("#dragDiv").width($("#dragDiv").width() + drag);

		}
		lastTimeDrag = event.clientX;
	});

	$("#new-session").on("click", function() {
		if (autoMode) return;
		createSession();
	});


});		// fin   R E A D Y  ***************************

//******************************************************************************************
//******************************************************************************************
//******************************************************** 	F U N C T I O N S   ************
//******************************************************************************************
//******************************************************************************

//******************************************************************************************

function createSession() {
	var i;
	var newSession = [];
	for ( i = 0; i < currentSession.length; i++) newSession[i] = currentSession[i];
    newSession[SESSION_ID] = (new Date()).getTime()
            + Math.random().toString().substring(2,9)
            + Math.random().toString().substring(2,9);
	newSession[4] = sessions[eventIndex][EVENT_DATE];
	newSession[5] = sessions[eventIndex][EVENT_TIME];
	newSession[9] = 'newSession';

	var eventIds = '';
	for ( i = eventIndex; i < sessions.length; i++) {
		eventIds += String(sessions[i][EVENT_ID]);
		if (i < sessions.length - 1) eventIds += ',';
	}

	var blobId;
	if (pngs[eventIndex][0] == '<') blobId = 0;
	else blobId = Number(sessions[pngs[eventIndex]][BLOB_ID]);

	var firstEventId = Number(sessions[eventIndex][EVENT_ID]);

	$.ajax({
		url: 'createSession.php',
		type: 'POST',
		data: {newSession:newSession,
				eventIds:eventIds,
				firstEventId:firstEventId,
				blobId:blobId},
		complete: function(xhr, result) {
			if (result == 'success') {
				if (xhr.responseText == 'ERREUR') {
					alert('Session non créée!');
				}
				else if (xhr.responseText == 'bad username') return;
				else {
					var sessionIds = [];
					for (var sess in sessionsInfo) {
						sessionIds.push(sess);
					}
					$.ajax({
						url: 'doDeleteSessionsVides.php',
						type: 'POST',
						data: {sessionIds:sessionIds},
						complete: function(xhr, result) {
							if (result == 'success') {
								alert('Session créée! (nombre de sessions vides supprimées: ' + xhr.responseText + ')');
								localStorage.reloadSessions = 'true';
							}
							else {
								alert('Erreur réseau!');
							}
						}
					});
				}
			}
			else {
				alert('Erreur réseau!');
			}
		}
	});
}
//******************************************************************************************

function loadSessionsInfo() {
	var sessionIds = [];
	var sessionId;
	for (var i = 0; i < sessions.length - 1; i++) {
		sessionId = sessions[i+1][1];
		var nouveau = true;
		for (var j = 0; j < sessionIds.length; j++) {
			if (sessionIds[j] == sessionId) {
				nouveau = false;
				break;
			}
		}
		if (nouveau) sessionIds.push(sessionId);
	}
	$.ajax({
		url: 'loadSessionsInfo.php',
		type: 'POST',
		data: {sessionIds : sessionIds},
		complete: function(xhr, result) {
			if (result == 'success') {
				if (xhr.responseText == 'ERREUR') {
					alert('Sessions non trouvées');
				}
				else {
					var sess = JSON.parse(xhr.responseText);
					for (var i = 0; i < sess.length; i++) {
						sessionsInfo[sess[i][1]] = sess[i];
					}
					/*if (!isMobile())*/ $("#miniDocWin0").css({"overflow":"hidden"});
					if (!isMobile())
						$("#billePng").html("<img src='Images/billeJauneMedium.png' width='"
									+ billeSize
									+ "px' height='"
									+ billeSize
									+ "px'>").css("position","absolute");
					else {
						$("#billePng").html("<img src='Images/empreinte.png' height='"
									+ billeSize
									+ "px'>").css("position","absolute");
						$("#billePng2").html("<img src='Images/empreinte2.png' height='"
									+ billeSize
									+ "px'>").css("position","absolute");
						$("#billePngClick").html("<img src='Images/empreinteClick.png' height='"
									+ billeSize
									+ "px'>").css("position","absolute");
					}
				}
			}
			else {
				alert('Erreur réseau!');
			}
		}
	});
}
//*****************************************************************************************

function initReplay() {
	$("#global-replay").css({"opacity":1});

	$("#h1-replay").text("S i o u X p l a y");		// text("R e j o u e r");
	$("title").text("SiouXplay");
	$("#requestText").css("display","none");

	$("#global-replay").css("position","relative");
	$("#screen, #screenshot, #screenshot-back, #top-board0, #top-board1, #top-board2, #left-board, #top-board3, #top-board4, #top-board5, #top-board6, #top-board7, #timeline00, #timeline0, #timelineZoom, #timeline").css("position","absolute");

//----------------------------------------------------------------
	$(".top-board").css({
						"right":BOARD_MARGIN * 2,
						"min-width":BOARD_MIN_WIDTH
						});

	timeLineLeft = /*LEFT_BOARD_WIDTH + */ (BOARD_MARGIN * 2) - 4;
	$(".board").css({ "left":timeLineLeft,
					 					"padding":PADDING,
					 					"overflow":"hidden"
									});
//----------------------------------------------------------------

//  USER_ID
	$("#top-board0").css({"top": - 16,
						"padding-left":5,
						"height":TOP_BOARD_HEIGHT,
//						"border":"3px solid " + DARK_GREEN_TRANS,
						"background-color":"white",
						"color":"black",
						"font-size":20
//						"font-weight":"bold"
						});		// "border":"2px solid gray"

//	EVENEMENTS/IMAGE/ECHELLE
	$("#top-board1").css({"top":BOARD_MARGIN + 6,
						"height":TOP_BOARD_HEIGHT,
						"border":"3px solid " + DARK_GREEN_TRANS,
						"border-bottom":0,
						"background-color":"white",
						"color": "black", // DARK_RED,
						"font-size":18,
						"font-weight":"bold"
						});		// "border":"2px solid gray"

	if (sessions.length == 1) {
		$("#top-board1").text("Aucun évènement!");
		return;
	}

// 	DATE	TIME
	$("#top-board4").css({"top":BOARD_MARGIN + (BOARD_MARGIN * 3),
						"height":TOP_BOARD_HEIGHT,
						"width":USER_ID_WIDTH,
						"background-color":"#333", // "black",
						"border":"3px solid black",
						"color":"red",
						"font-size":18,
						"font-weight":"bold"
						});		// "border":"2px solid gray"

//  TYPE 	TARGET
	$("#top-board5").css({"top":BOARD_MARGIN + (BOARD_MARGIN * 3),
						"white-space": "nowrap",
						"left":timeLineLeft + USER_ID_WIDTH + 18,
						"height":TOP_BOARD_HEIGHT,
						"min-width":BOARD_MIN_WIDTH - USER_ID_WIDTH - 18 -76,
						"right":BOARD_MARGIN * 2,
						"background-color":VERY_LIGHT_GRAY,
						"border":"3px solid black"
						});		// "border":"2px solid gray"

//  DOC_URL
	$("#top-board2").css({"top":TOP_BOARD_HEIGHT + (BOARD_MARGIN * 6),
						"padding":5,
						"padding-bottom":11,
						"height":(TOP_BOARD_HEIGHT * 2) + PADDING + 3,
						"font-size":"medium",  // "small",
						"background-color":DARK_GRAY,
						"color":"white"
						});

//  DOC_TITLE
	$("#top-board6").css({"top":TOP_BOARD_HEIGHT + (BOARD_MARGIN * 11) + 12,
						"height":(TOP_BOARD_HEIGHT) + PADDING - 5,
						"font-size":"large",
						"text-align":"center",
						"padding":"2px",
						"background-color":VERY_LIGHT_GRAY,
						"font-weight":"bold",
						"color":"black"
						});
//----------------------------------------------------------------
//  SCREEN
	$("#screen").css({"top":TOP_BOARD_HEIGHT + (BOARD_MARGIN * 20) + (TIMELINE_ADJUST) + 28 - 5,
						"left":LEFT_BOARD_WIDTH + BOARD_MARGIN *3 - 5,
						"overflow":"hidden",
						"z-index":50,
						"border":"5px solid" + VERY_LIGHT_GRAY
						});
	$("#screenshot-back").css({"overflow":"hidden"});
	$("#screenshot").css({"overflow":"hidden"});


//----------------------------------------------------------------

//	TIMELINE
	$("#timeline").css({"top":(TOP_BOARD_HEIGHT * 3) + (BOARD_MARGIN * 12),
						"margin-top":16,
						"margin-bottom":10,
						"min-width":BOARD_MIN_WIDTH + PADDING * 2,
						"padding":0,
//						"padding-right":PADDING,
//						"padding-left":PADDING,
//						"border-top":"1px solid gray",
//						"border-bottom":"1px solid gray",
						"border":"1px solid " +  VERY_LIGHT_GRAY,
						"height":(TOP_BOARD_HEIGHT * 2) + TIMELINE_ADJUST,
						"background-color":"#F8F8F8", //VERY_LIGHT_GRAY,
						"font-size":"medium",
						"overflow-y":"visible",
						"overflow-x":"visible"
						});

	$("#timeline00").css({"top":(TOP_BOARD_HEIGHT * 3) + (BOARD_MARGIN * 12) - 10,
						"height":(TOP_BOARD_HEIGHT * 1) + TIMELINE_ADJUST,
						"left":0,
						"right":0,
						"margin-top":0,
						"margin-bottom":0,
//						"min-width":window.innerWidth,
						"padding":0,
						"padding-top":10,
//						"padding-right":30,
						"font-size":"medium",
						"text-align":"center"
						});

	$("#timeline0").css({"top":(TOP_BOARD_HEIGHT * 4) + (BOARD_MARGIN * 12),
						"height":(TOP_BOARD_HEIGHT * 3) + TIMELINE_ADJUST +4,
						"left":0,
						"right":0,
						"margin-top":0,
						"border-bottom":"1px solid black",
//						"min-width":window.innerWidth,
						"padding":0
						});

	$("#timelineZoom").css({"top":(TOP_BOARD_HEIGHT * 3) + (BOARD_MARGIN * 12) + (TIMELINE_ADJUST * 2) - 2,
						"height":18,
						"left":(window.innerWidth - TIMELINE_ZOOM_WIDTH) / 2,
						"width":TIMELINE_ZOOM_WIDTH,
						"margin-top":0,
						"margin-bottom":0,
						"background-color":"white",
						"min-width":100,
						"padding":0,
						"padding-right":5,
						"padding-left":5,
						"border":"1px solid #F0F0F0",
						"border-radius":7,
						"font-size":"medium",
						"text-align":"center",
						"z-index":100
						});

	$("#dureeWidthDiv").css({"position":"relative",
						"background-color":"black",
						"width":$("#timeline0").width(),
						"height":10,
						"top":80
						});

//	TARGET_VALUE
	$("#top-board3").css({
						"left":LEFT_BOARD_WIDTH + (BOARD_MARGIN * 3) - 5,
//						"margin-top":20,
						"min-width":BOARD_MIN_WIDTH - 130,
						"height":BOTTOM_BOARD_HEIGHT,
						"background-color":VERY_LIGHT_GRAY,
						"font-size":20 //"medium"
						});
//-----------------------------------------------------------------
//  	LEFT-BOARD
	$("#left-board").css({"top":TOP_BOARD_HEIGHT + (BOARD_MARGIN * 10) + 9,
						"left":BOARD_MARGIN,
						"right":BOARD_MARGIN,
						"height":sessions[1][SCREEN_HEIGHT],
						"width":LEFT_BOARD_WIDTH,
						"z-index":-1
					//	"background-color":VERY_LIGHT_GRAY
						});

//-----------------------------------------------------------------
	$("#event-num, #count-down").css({
						"max-width":LEFT_BOARD_WIDTH,
						"padding-bottom":3,
						"padding-top":1,
						"padding-right":0,
						"padding-left":0,
						"margin-top":4,
						"margin-bottom":4,
						"text-align":"center",
						"font-weight":"bold",
						"font-size":20
						});

	$("#count-down").css({
						"height":INPUT_HEIGHT - 1,
						"width":104,
						"border":"3px solid black",
						"background-color":"#333",  // DARK_GRAY,
						"color":"yellow"
						}).text(0);

	$("#event-num").css({
						"height":INPUT_HEIGHT,
						"width":110,
						"background-color":"yellow",
						"color":"black"
						}).addClass("body").val(0);

	$("#new-session").css({
						"position":"relative",
						"padding":0,
						"padding-bottom":2,
						"margin":0,
						"border":"0px solid #CCC",
						"border-radius":13,
						"color":"red",
						"font-weight":"bold",
						"font-size":16,
						"left":-19,
						"top":0
						});
//-------------------------------------------------------------
	$("#event-type, #event-target, #event-url").css({
						"position":"absolute",
						"color":"black",
						"font-size":18,
						"font-weight":"bold",
						"overflow":"hidden"
						});
//................................................
	$("#event-type").css({
						"width":240,
						"top":2,
						"padding":4,
						"color":"red",
						"text-align":"center",
						"font-size":20,
						"background-color":VERY_LIGHT_GRAY
						}).addClass("body");

	$("#event-target").css({
						"left":264,
//						"right":PADDING,
						"text-align":"left",
						"font-size":20,
						"top":0,
						"padding":8,
						"padding-left":10,
						"padding-right":10});

//	URL REGEXP
	$("#event-url").css({
						"z-index":50,
					//	"width": $("#top-board2").width() - BOARD_MARGIN * 2,
						"width": 600,
						"right":BOARD_MARGIN * 2,
					//	"left":(LEFT_BOARD_WIDTH * 6) + (BOARD_MARGIN * 2) - 4,
						"padding":PADDING - 4,
						"overflow":"hidden",
						"top":TOP_BOARD_HEIGHT + (BOARD_MARGIN * 7) + (PADDING * 2) + 11,
						"height":(TOP_BOARD_HEIGHT) - PADDING + 5,  // - 7
						"background-color":"#DDD",
						"color":"red",
						"text-align":"left",
						"vertical-align":"top"}).addClass("body");
//----------------------------------------------------------------
	$("#begin, #end").css({
						"padding-top":12,
						"padding-bottom":12
	})
//-----------------------------------------------------------------
	$("#bille, #billeFloat").css({"position":"absolute","z-index":"100", "opacity":"0"});
	$("#clicPoint").css({
						"position":"absolute",
						"background-color":"red",
						"top":(billeSize / 8 * 3) + "px",
						"left":((billeSize / 8 * 3) + 1) + "px",
						"width":((billeSize / 4) - 1) + "px",
						"height":((billeSize / 4) - 1) + "px",
						"transform": "rotate(45deg)",
						"transform-origin": "48% 48%"
						});
//-----------------------------------------------------------------
	$("#miniDocWin0").css({"position":"absolute",
						"top":TOP_BOARD_HEIGHT  + (TIMELINE_ADJUST) + 18 + (BOARD_MARGIN * 20),
						"width":500,
						"overflow":"hidden",
						"z-index":10
						});

	$("#miniDocWin").css({"position":"relative",
						"left":80,
						"top":TOP_BOARD_HEIGHT + (BOARD_MARGIN * 20),
						"width":400,
						"z-index":6,
						"border":"4px solid #444"
						});

	$("#miniWin").css({"position":"relative",
						"z-index":4,
						"background-color":"#FAA" // FBB
//						"border":"1px solid red"
						});

	$("#miniDoc").css({"position":"relative",
						"z-index":12,
						"border":"1px solid #666"
//						"background-color":"black",
//						"opacity":0.05
						});
}
//******************************************************************************************
function findEventWithType(eventId,gardeIndex, sens) {  // filtre type et url
	var id = Number(eventId);
	while (((id < sessions.length - 1) && (sens == 1)) || ((id > 0) && (sens == (-1)))) {
//		id = id + sens;

		var typeRegExp, urlRegExp;
		if (typeFilter) typeRegExp = new RegExp(typeFilter, 'i');
		else typeRegExp = '.*';
		if (urlFilter) urlRegExp =  new RegExp(urlFilter, 'i');
		else urlRegExp = '.*';

		if (sessions[id][TYPE].match(RegExp(typeRegExp)) &&
				(sessions[id][DOC_TITLE].match(urlRegExp)
					|| sessions[id][DOC_URL].match(urlRegExp)
					|| sessions[id][TARGET_VALUE].match(urlRegExp))) {
			if (gardeIndex == id) return false;
			eventIndex = id;
			return true;
		}
		id = id + sens;
	}
	return false;
}

//*****************************************************************************************
function displayMultiEvent(startIndex) {  // startIndex à virer
	if (eventIndex > sessions.length - 2) return;
//	patchGeraldine();
	autoModeStart();
	displayEvent(eventIndex);
	var now;

		now = sessions[eventIndex][TIME_STAMP];
		if (timeOutId) clearTimeout(timeOutId);
		timeOutId = setTimeout(function() {
			if (eventIndex == sessions.length - 2) {
				displayEvent(++eventIndex);
				autoModeStop();
				flashForbidden();
				return;
			}
			eventIndex = Number(eventIndex) + 1;
			if (autoMode) {
				displayMultiEvent(eventIndex);
			}
			else return;
		}, (sessions[Number(eventIndex) + 1][TIME_STAMP] - now) / speedFactor);
	}

//******************************************************************************************
function startCountDown() {
	if (!autoMode) return;
	if (countDownId) clearInterval(countDownId);
	countDownId = setInterval(function() {
//		if (eventCountDown <= 0) eventCountDown = 0;
//		else eventCountDown -= 1;
		if(eventCountDown > 60) eventCountDownString = secondstotime(eventCountDown);
		else eventCountDownString = eventCountDown.toFixed(0);
		$("#event-count-down").text(eventCountDownString);

//		$("#count-down").text(eventCountDown.toFixed(0));

		var dureePast;
		if (eventIndex > sessions.length - 2) dureePast = dureeProto;
		else dureePast = (((sessions[eventIndex + 1][TIME_STAMP] - sessions[1][TIME_STAMP]) / 1000) - eventCountDown).toFixed();
		dureePast = secondstotime(dureePast);
		 $("#durPast").text(dureePast);
	}, 1000);
}
//******************************************************************************************

function startDeciCountDown() {
		if (!autoMode) return;
		if (deciCountDownId) clearInterval(deciCountDownId);
		deciCountDownId = setInterval(function() {
			var offset = $("#barreDiv").offset();

			eventCountDown = Math.abs(eventCountDown - 0.1); // 0.05);	// DECI_COUNTDOWN = 50 millis
			$("#count-down").text(eventCountDown.toFixed(1));
			if ($("#timeline").offset().left != -$("#timeline").width() + window.innerWidth - TIMELINE_RIGHT_MARGIN)	{
				if (zoomOn && (offset.left + window.CLIENT_X > window.innerWidth - 40)
							&& (offset.left < window.innerWidth)) {
					var leftLine = $('#timeline').offset().left;
					$('#timeline').animate({"left":leftLine - window.innerWidth + window.CLIENT_X + 100}, 600,/* dureeWidthDivUpdate */ verifTimelineBounds);

//    animation avec css vs jquery
// 	$('#timeline')[0].addEventListener("transitionend", updateTransition, true);
//  $('#timeline')[0].style.transition = 'all 3s ease-out';
//  $('#timeline')[0].style.transform = 'translateX(600px)';

				}
				else if (zoomOn && (offset.left + window.CLIENT_X > window.innerWidth)) {
					$("#timeline").css({'left': - $('#eventDiv' + eventIndex).position().left + window.innerWidth / 6});
					dureeWidthDivUpdate();
				}
			}
			offset.left += timeLengthUnit * DECI_COUNTDOWN;
			$("#barreDiv").offset(offset);
//			$("#barreDiv").animate({"left":offset.left},100);
		}, DECI_COUNTDOWN );
}
//******************************************************************************************
function flashForbidden() {
	$("#screen").css({"opacity":0.2});
	setTimeout(function() {
		$("#screen").css({"opacity":1});
	}, 300);
}

//******************************************************************************************
function autoModeStart() {
	if (eventIndex > sessions.length - 1) return;
	autoMode = true;
	startCountDown();
	startDeciCountDown();
	$("#count-down").css({"opacity":1});
	$("#foreward-multi").find("span").css({"color":"white"}).text("||");
	$("#foreward-multi").css({"background-color":"red"});
//	typeFilter = "";
//	urlFilter = "";
	$("#event-type").attr("disable","disable").css("color","white");
	$("#event-url").attr("disable","disable").css("color","#CCC");
}
//******************************************************************************************
function autoModeStop() {
	autoMode = false;
	clearTimeout(animTimeOutId);
	clearTimeout(timeOutId);
	clearInterval(countDownId);
	clearInterval(deciCountDownId);

	clearInterval(inter1); // resize anim
	clearTimeout(waitResize1);
	$("#resize-canvas").remove();
	$("#screenshot, #screenshot-back").css({"opacity":1});

	$("#bille").finish();
	lastImg.finish();
	backImg.finish();
//	$("#count-down").css({"opacity":0});
	$("#foreward-multi").find("span").css({"color":"black"}).text(">>");
	$("#foreward-multi").css("background-color",VERY_LIGHT_GRAY);

	$("#event-type").attr("disable","").css("color","red");
	$("#event-url").attr("disable","").css("color","red");
}
//******************************************************************************************
	// patch click Géraldine   inutilisé
function patchGeraldine() {
	return;
	if ((sessions[eventIndex][USER_ID] == 'Géraldine') || (sessions[eventIndex][USER_ID] == 'Geraldine')) {
		while  ((sessions[eventIndex][TYPE] == 'activate')
			|| (sessions[eventIndex][TYPE] == 'deactivate')
			|| (sessions[eventIndex][TYPE] == 'close')
			|| (sessions[eventIndex][TYPE] == 'navigate')) {
					if (eventIndex > sessions.length - 2) break;
					eventIndex++;
			}
	}
}
//******************************************************************************************
//******************************************************************************************
function displayEvent(eventIdParam) {          				//  D I S P L A Y    E V E N T
																											// Ci-dessous fonctions inclues

//******************************************************************************************
//******************************************************************************************
//********************** D I S P L A Y    E V E N T   D E S K T O P ***********************
//******************************************************************************************
//******************************************************************************************

function displayEventDesktop() {

//	if (((event[TYPE] == 'mousewheel') && ((sessions[eventId - 1][TYPE] != 'mousewheel'))) || ((event[TYPE] == 'scroll') && ((sessions[eventId - 1][TYPE] != 'scroll'))) || ((event[TYPE] == 'resize') && ((sessions[eventId - 1][TYPE] != 'resize')))) {

		$("#screenshot-back").html(pngs[pngsIndex[pngIndex]]);  	// affiche background-color

		backImg = $("#screenshot-back").find("img");
		backImg.css({"position":"relative", /* "top":0, "left":0, */ "z-index":-1});
		if (reducFactor && pngIndex < pngsIndex.length - 1) backImg.css({"width":pngIndirect[WIN_INNER_WIDTH] * reducFactor, "height":pngIndirect[WIN_INNER_HEIGHT] * reducFactor});
//	}


//	if ((event[WIN_INNER_HEIGHT] * event[WIN_INNER_WIDTH]) > (pngIndirect[WIN_INNER_HEIGHT] * pngIndirect[WIN_INNER_WIDTH]) || newImage)
		$("#screenshot").html(pngs[eventPng]);  				// affichage image

	lastImg = $("#screenshot").find("img");
	lastImg.css("position","relative");


	if (pngIndex <= pngsIndex.length - 1) {
		if (event[TYPE] == 'resize') {
			lastImg.height(lastImg.height() * reducShowPng);  		// RESIZE
		}
		else {
//			lastImg.height(event[WIN_INNER_HEIGHT] * reducFactor);
			lastImg.width(event[WIN_INNER_WIDTH] * reducFactor);
			//lastImg.css({"width":event[WIN_INNER_WIDTH] * reducFactor, "height":event[WIN_INNER_HEIGHT] * reducFactor});
		}
	}

	var currentOffsetX = event[WIN_PAGE_X_OFFSET] * reducFactor;
	var currentOffsetY = event[WIN_PAGE_Y_OFFSET] * reducFactor;
	var backOffsetX = pngIndirect[WIN_PAGE_X_OFFSET] * reducFactor;
	var backOffsetY = pngIndirect[WIN_PAGE_Y_OFFSET] * reducFactor;
	if ( newImage ||  (pngs[eventId][0] == '<')) {  // eventId  eventPng
		newImage = false;
		$("#clicPoint").css("opacity","0");
		offsetX = currentOffsetX;
		offsetY = currentOffsetY;
	}
	var difFrontBackX = backOffsetX - offsetX;
	var difFrontBackY = backOffsetY - offsetY;
	backImg.css({"left": difFrontBackX, "top":difFrontBackY});

//	A N I M A T I O N 		S C R O L L

	var difOffsetX = offsetX - currentOffsetX;
	var difOffsetY = offsetY - currentOffsetY;
	if (difOffsetX || difOffsetY) {
		if (startEventCountDown <  40000 ||  !autoMode /* || (sessions[Number(eventId) + 1][TYPE] != 'mousewheel') && (sessions[Number(eventId) + 1][TYPE] != 'scroll')*/) {
			lastImg.css({"left":difOffsetX, "top":difOffsetY});
			backImg.css({"left":difOffsetX + difFrontBackX, "top":difOffsetY + difFrontBackY});
		}
		else {
			backImg.animate({"left":difOffsetX + difFrontBackX, "top":difOffsetY + difFrontBackY}, startEventCountDown, 'linear');
			lastImg.animate({"left":difOffsetX, "top":difOffsetY}, startEventCountDown, 'linear');
		}
	}


//...  MISE À L'ÉCHELLE

	var eventIdOrPng;
	if (event[WIN_INNER_WIDTH] == "0") eventIdOrPng = eventPng;
	else eventIdOrPng = eventId;

if (event[TYPE].match(/resize/) || initFrame) {
		$("#screenshot, #screenshot-back, #screen").css({"width":sessions[eventIdOrPng][WIN_INNER_WIDTH] * reducFactor, "height":sessions[eventIdOrPng][WIN_INNER_HEIGHT] * reducFactor});
		initFrame = false;
}

//  A N I M A T I O N 		B I L L E

	displayMouse(event);
	if (autoMode) displayNextMouse(sessions[Number(eventId) + 1]);

// A F F I C H A G E    B O A R D 	et   	MINI DOC  			**************************
	displayBoardMiniDoc();



}
//*************************************************************  FIN  displayEvent DESKTOP
//****************************************************************************************

	function displayMouse(event) {							//		DISPLAY MOUSE  DESKTOP
		var coorMouse = calCoorMouse(event);
		if (!coorMouse) return;

		if (!autoMode) $("#bille").css(coorMouse);
		if ((event[TYPE] == 'click') || (event[TYPE] == 'dblclick') || (event[TYPE] == 'clickDif1') ||	(event[TYPE] == 'mousedown') ||  (event[TYPE] == 'mouseup')	) {
			$("#clicPoint").css("opacity","1")
		}
		else $("#clicPoint").css("opacity","0");
	}
	//*************************************************************************************************

	function displayNextMouse(event) {   //displayMouse() animation en mode auto;
		var coorMouse = calCoorMouse(event);
		if (!coorMouse) return;

		var ease, preAnimTime, animTime;
		preAnimTime = startEventCountDown - MAX_ANIM_TIME;
		if (preAnimTime < 0) {
			animTime = startEventCountDown;
			preAnimTime = 1;
			ease = 'linear';
		}
		else {
			animTime = MAX_ANIM_TIME;
			ease = 'swing';
		}
		if (animTimeOutId) clearTimeout(animTimeOutId);
		animTimeOutId = setTimeout(function () {
			if (animTime > 1000) $("#clicPoint").css("opacity","0");
			$("#bille").animate(coorMouse, animTime, ease);
		}, preAnimTime);

	}
	//*************************************************************************************************
	function calCoorMouse(event) {

		if (reducFactor) {
			 billeSize = reducFactor * BILLE_SIZE;
			$("#billePng").width(billeSize);
		}

		if (!startEventCountDown) return false;

		var x = event[CLIENT_X] * reducFactor;
		var y = event[CLIENT_Y] * reducFactor;
		var animTime;

		if (!x && !y) {
			if (event[TYPE] == 'resize') {
				x = event[WIN_INNER_WIDTH] * reducFactor;
				y = event[WIN_INNER_HEIGHT] * reducFactor;
			}
			else {
				return false;
			}
		}

		var billeDecal = billeSize / origReducFactor;
		return { "top":( y - billeDecal /2 ) + "px",
						 "left":( x - billeDecal /2 ) + "px",
						 "opacity":"0.8" };

	}


//*****************************************************************************************
//*****************************************************************************************
//************************ D I S P L A Y    E V E N T   M O B I L E ***********************
//*****************************************************************************************
//*****************************************************************************************

function displayEventMobile() {

	console.log('zoom :' , event[74]);

	$("#screenshot, #screenshot-back, #screen").css({"opacity":1}); // pour fin resize

	$("#screenshot-back").html(pngs[pngsIndex[pngIndex]]);  	// affiche background-color

	backImg = $("#screenshot-back").find("img");
	backImg.css({"position":"relative", "opacity":0, "z-index":-1});
//		if (reducFactor && pngIndex < pngsIndex.length - 1) backImg.css({"width":pngIndirect[WIN_INNER_WIDTH] * reducFactor, "height":pngIndirect[WIN_INNER_HEIGHT] * reducFactor});


	$("#screenshot").html(pngs[eventPng]);  				// affichage image

	lastImg = $("#screenshot").find("img");
	lastImg.css("position","relative");

	var currentOffsetX = event[WIN_PAGE_X_OFFSET] * reducFactor;
	var currentOffsetY = event[WIN_PAGE_Y_OFFSET] * reducFactor;
	var backOffsetX = pngIndirect[WIN_PAGE_X_OFFSET] * reducFactor;
	var backOffsetY = pngIndirect[WIN_PAGE_Y_OFFSET] * reducFactor;
	if (newImage || (pngs[eventId][0] == '<')) {  // eventId  eventPng
		newImage = false;
		$("#clicPoint").css("opacity","0");
		offsetX = currentOffsetX;
		offsetY = currentOffsetY;
	}
	var difFrontBackX = backOffsetX - offsetX;
	var difFrontBackY = backOffsetY - offsetY;
	backImg.css({"left": difFrontBackX, "top":difFrontBackY});

//												S C R O L L

	var difOffsetX = offsetX - currentOffsetX;
	var difOffsetY = offsetY - currentOffsetY;


	if (difOffsetX || difOffsetY) {
		var startOffsetBilleX, startOffsetBilleY;
		if (sessions[eventId - 1][TYPE] != 'scroll') {
			startOffsetBilleX = $("#bille").position().left;
			startOffsetBilleY = $("#bille").position().top;
		}
		else startOffsetBilleX = startOffsetBilleY = 0;

		if (backImg.css("width") == lastImg.css("width")) backImg.css({"opacity":1});

		lastImg.css({ "left":difOffsetX
					, "top":difOffsetY });
		backImg.css({ "left":difOffsetX + difFrontBackX
					, "top":difOffsetY + difFrontBackY });

		$("#bille").css({"left":startOffsetBilleX + difOffsetX
						, "top":startOffsetBilleY + difOffsetY });
	}


//...  MISE À L'ÉCHELLE

	$("#screen").css({"width":$("#screenshot").width(), "height":$("#screenshot").height()});



//  A N I M A T I O N 		B I L L E   et   R E S I Z E

	if (autoMode && event[TYPE] == 'MozMagnifyGestureStart') zoomGesture(eventId);
	displayMouseMobile(eventId);
	if (autoMode) animResize();

// A F F I C H A G E    B O A R D 	et   	MINI DOC  			**************************
	displayBoardMiniDoc();

}
//***************************************************************  FIN  displayEvent MOBILE
//*****************************************************************************************
//*****************************************************************************************

	function zoomGesture(eventId) {
		var zoomMul = sessions[eventId + 1][ZOOM] / event[ZOOM];
		var zoomDecal;
		if (zoomMul > 1) zoomDecal = -zoomMul *20;
		else zoomDecal = zoomMul *20;


		lastImg.animate({ "width":lastImg.width() * zoomMul
						, "left":lastImg.position().left + zoomDecal
						, "top":lastImg.position().top + zoomDecal }, startEventCountDown, 'linear');

		$("#billeFloat").find("img").height(100);
		$("#billeF1, #billeF2").css({"position":"absolute"});

		$("#billeFloat").css({"opacity":1});

		var w1, h1, w2, h2;
		if (zoomMul > 1) w1 = 0.4; h1 = 0.6, w2 = 0.2, h2 = 0.8;

		$("#billeF1").css({ "left":$("#screenshot").width() * w1
							, "top":$("#screenshot").height() * h1 });
		$("#billeF2").css({ "left":$("#screenshot").width() * h1
							, "top":$("#screenshot").height() * w1 });

		$("#billeF1").animate({ "left":$("#screenshot").width() * w2
								, "top":$("#screenshot").height() * h2 }
								, startEventCountDown, 'linear');
		$("#billeF2").animate({ "left":$("#screenshot").width() * h2
								, "top":$("#screenshot").height() * w2 }
								, startEventCountDown, 'linear', function() {
									$("#billeFloat").css({ "opacity":0 });});
	}
//*****************************************************************************************

	function displayMouseMobile(eventId) {					//			DISPLAY MOUSE MOBILE

		var event = sessions[eventId];
		var coorMouse = calCoorMouseMobile(eventId);
		if (!coorMouse) return;

		$("#bille").css(coorMouse);
		if (coorMouse.opacity) {
			if (event[TYPE].match(/click/)) {
				$("#billePng").css("opacity","0");
				$("#billePngClick").css("opacity","1");
			}
			else {
				$("#billePng").css("opacity","1");
				$("#billePngClick").css("opacity","0");
			}
		}
	}
	//*************************************************************************************************

	function calCoorMouseMobile(eventId) {

		var event = sessions[eventId];

		if (reducFactor) {
			billeSize = reducFactor * BILLE_SIZE;
			$("#billePng").width(billeSize);
		}

		if (!startEventCountDown) return false;

		var x = event[SCREEN_X] * reducFactor;
		var y = event[SCREEN_Y] * reducFactor;

//		if (!x && !y) return false;

		var opacity;
		if (event[TYPE].match(/touch|click|mouse|scroll/)) opacity = 0.9;
		else opacity = 0;

		// ad hoc origReducFactor = 0.5
		if (!x && !y) return {"opacity":opacity};
		else return {"top":(y - (billeSize)) + "px",
				"left":(x - (billeSize)) + "px",
				"opacity":opacity};

	}
//*************************************************************************************************


	function displayBoardMiniDoc() {

	// A F F I C H A G E    B O A R D 				*******************************************

		if(eventCountDown > 60) eventCountDownString = secondstotime(eventCountDown);
		else eventCountDownString = Number(eventCountDown).toFixed(0);

		$("#top-board0").text(event[USER_ID] + ' [' + currentSession[32] + '] [' + currentSession[33] + '] [' + currentSession[34] + ']');  // freeFields
		$("#top-board2").text(event[DOC_URL]);
	//	$("#timeline").css({"top":(TOP_BOARD_HEIGHT * 3) + (BOARD_MARGIN * 14) + 4 + $("#screenshot").height()});

	//    T E X T E
		$("#top-board3").css({"top":(TOP_BOARD_HEIGHT * 4) + TIMELINE_ADJUST + (BOARD_MARGIN * 16) + PADDING + $("#screenshot").height() + 40});

		if ( !event[TYPE].match(/clickDif/) ) {
			if (event[TARGET_VALUE] || eventId == 1)
				if (event[TARGET] != 'Html' &&
					 !event[TARGET_VALUE].match(/function\(.*\)\s*{/) &&
					 !event[TARGET_VALUE].match(/<.+>.*<\//) &&
					 event[TYPE] != 'keypress' && event[TYPE] != 'input')
								$("#top-board3").text(event[TARGET_VALUE]);

			if ((event[TARGET] == 'TextArea') || // black pour entrée texte clavier
					(event[TARGET] == 'Input') ||
					(event[TYPE] == 'input') ||
					event[TYPE].match(/key/))
								$("#top-board3").css({"color":"white", "background-color":"black", "font-size":20});
			else $("#top-board3").css({"color":"black", "background-color":VERY_LIGHT_GRAY, "font-size":20});
		}

		$("#top-board4").html(event[EVENT_DATE] + '    ' +
							event[EVENT_TIME] + '<span style="color:white;font-size:130%;"> | ' + '</span>' +
							'<span id="event-count-down" style="color:yellow;font-size:130%;">' + eventCountDownString + '</span>/' + eventCountDownString);
		$("#event-type").val(typeFilter);

		let eventDivColor;
		let eventDivBackColor = $("#eventDiv" + eventIndex).css("background-color");
		if ( !eventDivBackColor ) eventDivBackColor = "rgb(187, 187, 187)";
		if ( isDarkColor( eventDivBackColor ) ) eventDivColor = "rgb(255, 255, 255)";
		else eventDivColor = "rgb(0, 0, 0)";
		$("#event-target").css("background-color", eventDivBackColor); // event name with color
		$("#event-target").css("color", eventDivColor);

		$("#event-target").text(event[TYPE] + '  ' + filterEventLocalTarget(event[TARGET_LOCAL_NAME], event[TARGET]));
		$("#top-board6").text(event[DOC_TITLE]);
		$("#count-down").text(eventCountDown);
		displaySummary();

	//	A F F I C H A G E 	MINI DOC      			*******************************************

		var zoomFactor, zoomIndirectFactor;

		if (!miniReducFactor) {
			if (isMobile()) {
				zoomOrgFactor = 1 * event[ZOOM];
				miniReducFactor = MINI_REDUC / reducFactor / 2;
				$("#miniWin").css({"background-color":"HSLa(0, 0%, 0%, 0)", "z-index":-100});
			}
			else {
				miniReducFactor = MINI_REDUC / reducFactor;
				zoomFactor = 1;
				zoomIndirectFactor = 1;
			}
		}

		if (isMobile()) {
			zoomFactor = event[ZOOM] / zoomOrgFactor;
			zoomIndirectFactor = pngIndirect[ZOOM] / zoomOrgFactor;
		}
		if (!zoomFactor) {
			zoomFactor = 1;
			zoomIndirectFactor = 1;
		}

		$("#miniDocWin0").css({
						"left":$("#screenshot").width() + LEFT_BOARD_WIDTH + (BOARD_MARGIN * 2) + 60,
						"height":$("#screenshot").height()
						});

		$("#miniDocWin").css({
						"top":($("#screenshot").height() / 2) - (event[SCREEN_HEIGHT] / 2 / miniReducFactor),
						"height":event[SCREEN_HEIGHT] / miniReducFactor,
						"width":(event[SCREEN_WIDTH] / miniReducFactor) + 4
						});

		$("#miniWin").css({
					"top":event[WIN_SCREEN_Y] / miniReducFactor,
					"left":event[WIN_SCREEN_X] / miniReducFactor,
					"height":event[WIN_OUTER_HEIGHT] / miniReducFactor,
					"width":(event[WIN_OUTER_WIDTH] / miniReducFactor)
					});


		if (((event[TYPE] != 'resize') && (event[DOCRECT_W])) || newImage) {
			$("#miniDoc").css({
						"top":(event[DOCRECT_T] / miniReducFactor * zoomFactor) / 2,
						"left":(event[DOCRECT_L] / miniReducFactor * zoomFactor) / 2,
						"height":event[DOCRECT_H] / miniReducFactor  * zoomFactor,
						"width":(event[DOCRECT_W] / miniReducFactor * zoomFactor) - 1
						});
		}
		else if (pngIndirect[DOCRECT_W]) {
			$("#miniDoc").css({
						"top":(pngIndirect[DOCRECT_T] / miniReducFactor * zoomIndirectFactor) / 2,
						"left":(pngIndirect[DOCRECT_L] / miniReducFactor * zoomIndirectFactor) / 2,
						"height":pngIndirect[DOCRECT_H] / miniReducFactor * zoomIndirectFactor,
						"width":(pngIndirect[DOCRECT_W] / miniReducFactor * zoomIndirectFactor) - 1
						});
		}
	}
//*****************************************************************************************



	function animResize() {

		if (eventId >= sessions.length - 1) return;
		var actualEvent = sessions[eventId];
		var nextEvent = sessions[eventId + 1];
		if (nextEvent[TYPE] != "resize") return;

		var animTime;
		var maxAnimTime = MAX_ANIM_TIME * 0.6;
		var preAnimTime = startEventCountDown - maxAnimTime;
/*		if (preAnimTime < 0) {
			animTime = startEventCountDown;
			preAnimTime = 1;
		}*/
		if (preAnimTime < maxAnimTime) return;
		else {
			animTime = maxAnimTime;
		}
		animCount = 40;
		animTime = animTime / animCount;
		animAngle = Math.PI /2 / animCount;
		totalAnimAngle = 0;



		waitResize1 = setTimeout(function () {
			var img = $("#screenshot").find("img").clone().get(0);
			var w = $("#screenshot").find("img").width() << 1;
			var h = $("#screenshot").find("img").height() << 1;
			var resizeCanvas = $("<canvas width=" + w + " height=" + h + ">coucou</canvas>").get(0);
			$(resizeCanvas)
					.css({ "position":"absolute", "z-index":1000 })
					.attr("id", "resize-canvas");
			var ctx = resizeCanvas.getContext('2d');
			$("#screen").prepend($(resizeCanvas));

			var transImg = w /2 / animCount;
			var totalTransImgX = 0;
			var totalTransImgY = 0;

			var i = 3;
			$("#screenshot, #screenshot-back").css({"opacity":0});
			if (inter1) clearInterval(inter1);
			inter1 = setInterval(function() {
				ctx.save();
				ctx.clearRect(0, 0, resizeCanvas.width, resizeCanvas.height);
				if (i == Math.round(animCount * 0.9)) {
					i+= 2;
					totalAnimAngle -= Math.PI /2;
					img = $(pngs[eventIndex + 1]).get(0);
					totalTransImgY = 0;
					transImg = 0;
				}
				totalAnimAngle += animAngle;
				totalTransImgY += transImg;
				ctx.translate(totalTransImgX, totalTransImgY);
				ctx.rotate(-totalAnimAngle);
				ctx.drawImage(img, 0, 0);
				ctx.restore();
				i++;
				if (i >= animCount) {
					clearInterval(inter1);
					$("#resize-canvas").remove();
					//$("#screenshot, #screenshot-back, #screen").css({"opacity":1});
				}
			}, animTime);
		}, preAnimTime);


	}
//*****************************************************************  TOP LEVEL displayEvent

	var eventId = Number(eventIdParam);

	updateBarreDiv(eventId);

	var event = sessions[eventId];
	var pngIndirect = sessions[pngsIndex[pngIndex]];
	currentSession = sessionsInfo[event[SESSION_ID]];
	origReducFactor = Number(currentSession[ORG_REDUC_FACTOR]);
	reducFactor = origReducFactor * reducShowPng;

	if (!(eventId > 0 && eventId < sessions.length)) return;

	if (eventId < sessions.length - 1) {
		startEventCountDown =
				(sessions[Number(eventId) + 1][TIME_STAMP] - event[TIME_STAMP]) / speedFactor;
		eventCountDown = (startEventCountDown / 1000).toFixed(1);
	}
	else eventCountDown = startEventCountDown = 0;
//	if (eventCountDown > 99999) eventCountDown = 99999;
	startEventCountDown = Number(startEventCountDown);

	$("#event-num").val(eventId);


	var eventPng;

	if (pngs[eventId][0] == '<') eventPng = eventId;
	else eventPng = pngs[eventId];

//  index du png courant (pour affichage displaySummary)
	pngIndex = 0;
	while (pngsIndex[pngIndex++] != eventPng);
	if (pngIndex > pngsIndex.length - 1) pngIndex = pngsIndex.length - 1;

	if (currentSession[37].match(/mff-/)) displayEventMobile();
	else displayEventDesktop();
}


//********************************************************************  FIN  displayEvent
//****************************************************************************************
//****************************************************************************************
//****************************************************************************************

function displaySummary() {  // display  top-board1
	var eventInfo = 'Position: <span style="color:rgb(208, 28, 0);font-size:130%;">' + eventIndex + '</span>/' + (sessions.length - 1);
	var pngInfo;
	var barColorString = '<span style="color:black;font-size:130%;">'
	if (pngsNumber) pngInfo = 'Image: <span style="color:rgb(208, 28, 0);font-size:130%;">' + pngIndex + '</span>' + '/' + pngsNumber;
	else pngInfo = "Pas d'image!";
	var reducInfo = '';
	// if (reducFactor) reducInfo = ' ' + barColorString + reducFactor.toFixed(1) + '</span>' + ' (' + origReducFactor.toFixed(1) + '*' + reducShowPng + ')';
	if (reducFactor) reducInfo = ' ' + reducFactor.toFixed(1)  + ' (' + origReducFactor.toFixed(1) + '*' + reducShowPng + ')';

	var dureePast = ((sessions[eventIndex][TIME_STAMP] - sessions[1][TIME_STAMP]) / 1000).toFixed();
	if (dureePast == "NaN") dureePast = 0;
	dureePast = secondstotime(dureePast);

	$("#top-board1").html(eventInfo  + barColorString + '  |  </span>' + pngInfo + barColorString + '  |  </span>Zoom: ' + reducInfo  + '  </span><span style="color:black;font-size:130%;">  |  </span>Temps: <span id="durPast" style="color:rgb(208, 28, 0);font-size:130%;">' + dureePast + '</span>/' + dureeProto);

//¨¨¨¨¨¨¨¨¨¨
/*	$("#top-board2").text(sessions[eventIndex][DOC_URL]);
	$("#top-board3").text(sessions[eventIndex][TARGET_VALUE]);
	$("#top-board4").html(sessions[eventIndex][USER_ID] + ' | '
						+ sessions[eventIndex][EVENT_DATE] + '    '
						+ sessions[eventIndex][EVENT_TIME] + ' | '
						+ sessions[eventIndex][TYPE] + '  '
						+ filterEventTarget(sessions[eventIndex][TARGET]));
*/
}
//*************************************************************************************************
function filterEventLocalTarget(localT, T) {
	var loc = localT.toLowerCase();
	var t = T.toLowerCase();
	if (t.indexOf('function') != -1) return 'Window';
	if (loc == "") return 'Window';
	return T;
//	if (loc == t) return T;
//	else return T + '(' + localT + ')';
}
//*************************************************************************************************
function secondstotime(secs)
{
    var t = new Date(1970,0,1);
    t.setSeconds(secs);
    var s = t.toTimeString().substr(0,8);
    if(secs > 86399)
    	s = Math.floor((t - Date.parse("1/1/70")) / 3600000) + s.substr(2);
    return s;
}
//*************************************************************************************************
function findPngs() {
	var done = 0;
	var maxServerCalls = sessions.length - 1;

	function findPng(i,id) {
		$.ajax({
			url: 'findPng.php',
			data: { 'id': id },
			complete: function(xhr, result) {
				if (result == 'success') {
					if (xhr.responseText != "no") {
						pngs[i] = xhr.responseText;
						pngsIndex.push(i);
						pngsNumber++;
						displaySummary();
					}
				}
				else {
					$("#top-board1").val("Erreur réseau!").css("color","red");
					return;
				}
				done++;
				if (done == maxServerCalls) {
					if (!pngsNumber) {
						alert("Pas d'images!");
						window.close();
						return;
					}

					//initReplay();   //  affichage interface

					var imgPtr;
					var j = 1;
					while (!pngs[j]) pngs[j++] = "";
					var k = 1;
					while (pngs[k] == '') pngs[k++] = j;
					for (; j < sessions.length; j++) {
						if (pngs[j]) imgPtr = j;
						else pngs[j] = imgPtr;
					}
					pngsIndex.sort(function(a, b) {return a - b});
					if (eventIndex == 0) {
						if (isMobile()) {
							displayEvent(++eventIndex);
						}
						else {
							displayEvent(++eventIndex + 1);
							displayEvent(eventIndex);
						}
						buildTimeline();
						$("#bottom-boards").css("opacity",1);
					}
				}
			}
		});
	}


	for (var i = 1; i < sessions.length; i++) {
		id = sessions[i][BLOB_ID];
		if (!id) maxServerCalls--;
		else findPng(i, id);
	}
	displaySummary();
//	if (sessions[1][USER_ID] == 'Anonyme') $("#new-session").css("display","none");

	$.ajax({
		url: 'verifSuperu.php',
		complete: function(xhr, result) {
			if (result == 'success') {
				if (xhr.responseText == "OK") {
					return;
				}
				else if (sessions[1][USER_ID] == 'Anonyme') {
							$("#new-session").css("display","none");
				}
			}
			else alert('Pas de réseau!');
		}
	});

}
//*************************************************************************************************

function buildTimeline() {

	var type;
	timeLengthUnit = $("#timeline").width() / dureeProtoMilli;
	var time, timeLength, timeDiv;

	$("#timeline").empty();


	$("#timeline").html('<div id="barreDiv" ></div><div id="dragDiv" ></div>');

	$("#dragDiv").css({
									"position":"absolute",
									"background-color":"yellow",
									"height":40 + TIMELINE_ADJUST,
									"z-index":100,
									"opacity":0});


	$("#barreDiv").css({
									"position":"absolute",
									"background-color":"black",
									"border":"0px solid black",
									"margin-top":-14,
									"margin-left":-6 ,
									"height":68 + TIMELINE_ADJUST,
									"width":11,
//									"border-radius":7,
									"z-index":-5});

	for (var i = 1; i < sessions.length; i++) {

		var typeColor = findColorType(i).color;
		var index = findColorType(i).z;
		var width = findColorType(i).width;
		var style = 'solid';
// 		if (zoomOn && width == 1) style = 'dashed';

		time = sessions[i][TIME_STAMP] - sessions[1][TIME_STAMP];
		timeLength = (time * timeLengthUnit);

		timeDiv = '<div id="eventDiv' + i + '" style="position:absolute; height:' + Number(TIMELINE_ADJUST + (TOP_BOARD_HEIGHT * 2)) + 'px; left:' + timeLength + 'px;  background-color:' + typeColor + '; z-index:' + index + '; width:' + width + 'px; border-style:' + style + ';"></div>';
		$("#timeline").append(timeDiv);
	}
	updateBarreDiv(eventIndex);
	updateZoomText();
}
//*************************************************************************************************
function updateZoomText() {
	var zoomNivText;
	if (zoomOn) {
		var zoom = 1;
		for (var i = 0; i < scales.length; i++) zoom *= scales[i];
		if (zoom > 9) zoom = zoom.toFixed(0);
		else zoom = zoom.toFixed(1);
		zoomNivText = '    (zoom x' + zoom + ')';
	}
	else zoomNivText = '';
	if (zoomOn) $("#timelineZoom").text(dureeWidth(window.innerWidth) + zoomNivText);
	else $("#timelineZoom").text(secondstotime(dureeProtoSec) + zoomNivText);
}
//......................
function dureeWidthDivUpdate() {
//	if (!zoomOn) return;
	var scale = window.innerWidth / $("#timeline").width();
//	var scale = scales[scales.length - 1];
	var width = $("#timeline0").width() * scale;
	var left = -$("#timeline").offset().left * scale;
	$("#dureeWidthDiv").width(width);
	$("#dureeWidthDiv").css("left", left);
	updateZoomText();
}
//........................
function dureeWidth(width) {
	var scale = width / $("#timeline").width();
	var dur = (dureeProtoSec * scale).toFixed();
	if (dur > 60)
		return secondstotime(dur);
	else return dur + ' sec.';
}

//*************************************************************************************************

function updateBarreDiv(id) {

		try {
			var color = $("#eventDiv" + id).css("background-color");
			$("#barreDiv").css({"left":$("#eventDiv" + id).offset().left - $("#timeline").offset().left, "background-color":color});
			if (!moveBarreDiv || autoMode) {
				moveBarreDiv = true;
				return;
			}
			if ($("#barreDiv").offset().left > window.innerWidth - 20 || $("#barreDiv").offset().left < 5) {
				$("#timeline").animate({ 'left':- $("#eventDiv" + eventIndex).position().left + (window.innerWidth / 4)}, 800, verifTimelineBounds);
			}
			else verifTimelineBounds();
		}
		catch(e) {}

}
//................................
function verifTimelineBounds() {
	if (!zoomOn) return;
	var left = 0;
	if ($("#timeline").offset().left > 25) left = 25;
	else if ($("#timeline").width() - window.innerWidth < (-$("#timeline").offset().left) + TIMELINE_RIGHT_MARGIN) left = -$("#timeline").width() + window.innerWidth - TIMELINE_RIGHT_MARGIN;

	if (left) $("#timeline").animate({ 'left':left }, 400, dureeWidthDivUpdate);
	else dureeWidthDivUpdate();
}
//*************************************************************************************************

function findColorType(id) {

	if ((sessions[id][TYPE] == 'focus') && (sessions[id][TARGET].indexOf('function') != -1 ))
				return({color:'#4F4', z:13, width:3});
	switch(sessions[id][TYPE]) {
		case 'click': return({color:'red', z:15, width:3});

		case 'clickDif1': return({color:'green', z:15, width:1});
		case 'clickDif2': return({color:'green', z:15, width:1});
		case 'appEvent': return({color:'blue', z:15, width:2});

		case 'touchstart': return({color:'#F82', z:14, width:2});
		case 'touchend': return({color:'#4AA', z:14, width:2});

		case 'pageshow': return({color:'#4F4', z:13, width:3});
		case 'resize': return({color:'#730', z:16, width:3});  // #9DF
		case 'mousewheel': return({color:'#FD0', z:9, width:1});
		case 'scroll': return({color:'#FD0', z:9, width:2});
		case 'keydown': return({color:'black', z:9, width:2});
		case 'keyup': return({color:'black', z:9, width:2});
		case 'input': return({color:'black', z:14, width:3});
		case 'keypress': return({color:'black', z:9, width:2});
	}
	switch(sessions[id][TARGET]) {
		case 'Input': return({color:'black', z:9, width:2});
		default: return({color:'#BBB', z:0, width:1});
	}
}
////////////////////////////

function isDarkColor(rgb) {
	var r = Number((rgb.split('(')[1]).split(',')[0]);
	var g = Number((rgb.split('(')[1]).split(',')[1]);
	var b = Number(((rgb.split('(')[1]).split(',')[2]).split(')')[0]);

	if ( r + g + b < 383 ) return true;
	else return false;
}
//*************************************************************************************************
function isMobile() {
	var session = sessions[1][1];
	if (sessionsInfo[session][37].match(/mff-/)) return true;
	else return false;
}
