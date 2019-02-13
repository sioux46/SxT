
//  REPLAY.JS

const TIME_STAMP = 2;
const EVENT_DATE = 3;
const EVENT_TIME = 4;
const USER_ID = 6;
const TYPE = 8;
const TARGET = 9;
const DOC_URL = 11;
const DOC_TITLE = 13;
const WIN_INNER_HEIGHT = 18;
const WIN_INNER_WIDTH = 19;
const WIN_PAGE_X_OFFSET = 22;
const WIN_PAGE_Y_OFFSET = 23;
const SCREEN_HEIGHT = 26;
const SCREEN_WIDTH = 27;
const BLOB_ID = 28;
const TARGET_LOCAL_NAME = 34;
const TARGET_VALUE = 38;
const CLIENT_X = 52;
const CLIENT_Y = 53;
const TARGET_RECT_B = 40;
const TARGET_RECT_H = 41;
const TARGET_RECT_L = 42;
const TARGET_RECT_R = 43;
const TARGET_RECT_T = 44;
const TARGET_RECT_W = 45;
//.............................
const LEFT_BOARD_WIDTH = 120;
const LEFT_BOARD_HEIGHT = 800;
const TOP_BOARD_HEIGHT = 20;
const BOTTOM_BOARD_HEIGHT = 80;
const BOARD_MARGIN = 15;
const GLOBAL_HEIGHT = 500;
const BOARD_MIN_WIDTH = 1000;
const INPUT_HEIGHT = 30;
const PADDING = 8;
const USER_ID_WIDTH = 390;
//.............................
const BILLE_SIZE = 60;
const MAX_ANIM_TIME = 800;

const VERY_LIGHT_GRAY = '#EEE';
const DARK_BLUE = '#00B';
const DARK_GREEN = '#0A0';
const DARK_GREEN_TRANS = 'rgba(0,192,0,0.5)'
const DARK_GRAY = '#666';

// créé par displayRequest.php: sessions, reducShowPng

var eventIndex = 0;
var pngIndex = 0;
var pngsIndex = [];
var pngs = {};
var pngsNumber = 0;
var reducFactor, origReducFactor;
var billeSize;
var autoMode = false;
var prevMouse = false;
var speedFactor = 1;
var eventCountDown = startEventCountDown= 0;
var timeOutId;
var countDownId;
var animTimeOutId;
var offsetX, offsetY;
var newImage = true;
var lastCommand;
var eventCountDownString;
var dureeProto, dureeProtoSec;
var lastImg, backImg;
var typeFilter = "";
var urlFilter = "";
var clignoUrlId, clignoTypeId;




//*************************************************************************************************
//******************************************************************	R E A D Y   ***************
//*************************************************************************************************
$(document).ready(function() {
	var noSession = 'Aucun événement!\nSélectionnez une ou plusieurs sessions contenant des énénements';
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

	$(document).on('dblclick', function() {
		event.stopPropagation();
		event.preventDefault();
		return false;
	});
	
	dureeProto = sessions[sessions.length -1][TIME_STAMP] - sessions[1][TIME_STAMP];
	dureeProtoSec = (dureeProto / 1000).toFixed();
	dureeProto = secondstotime(dureeProtoSec);
	
	billeSize = reducShowPng * BILLE_SIZE;
	initReplay();
	findPngs();
//..........................................................	
	
	$(document).keydown(function (event) {
		if (event.which == 9) {   // TAB
			$("*").blur();
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
			while ((sessions[nextIndex][TYPE] == 'mousewheel')
					|| (sessions[nextIndex][TYPE] == 'scroll')) {
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
		if ((isNaN($(this).val())
				|| $(this).val() < 1
				|| $(this).val() > sessions.length - 1)) $(this).val(eventIndex);
		else {
			eventIndex = $(this).val();
			newImage = true;
			displayEvent(eventIndex);
		}
	});
	
/*	$("#speed").on("blur", function() {
		if (isNaN($(this).val())) $(this).val(speedFactor);
		else {
			speedFactor = $(this).val();
		}
	});*/
//.............................................................
	$("#backward, #foreward, #end, #begin, #foreward-multi").on("click", function() {
		clearInterval(clignoUrlId);
		clearInterval(clignoTypeId);
		$("#event-url").val(urlFilter);
		$("#event-type").val(typeFilter);

	});
//..............................................................
		$("#event-type").on("focus", function() {
		if (autoMode) $(this).blur();
		clearInterval(clignoTypeId);
		$("#event-type").val(typeFilter);
	});
	
	$("#event-type").on("blur", function() {
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
		clearInterval(clignoUrlId);
		$("#event-url").val(urlFilter);
	});
	
	$("#event-url").on("blur", function() {
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
	


//	$("#foreward-multi:hover").css({"background":VERY_LIGHT_GRAY});
	
//............................................................
	
});		// fin   R E A D Y

//*************************************************************************************************
//************************************************************** 	F U N C T I O N S   ***********
//*************************************************************************************************

function initReplay() {
	$("#global-replay").css({"opacity":1});

	$("#h1-replay").text("S i o u X p l a y");		// text("R e j o u e r");
	$("title").text("SiouXplay");
	$("#requestText").css("display","none");
	
	$("#global-replay").css("position","relative");
	$("#screen, #screenshot, #screenshot-back, #screenshot-frame, #top-board0, #top-board1, #top-board2, #left-board, #top-board3, #top-board4, #top-board5, #top-board6, #top-board7, #timeline").css("position","absolute");
	
	$(".top-board").css({
						"right":BOARD_MARGIN * 2,
						"min-width":BOARD_MIN_WIDTH
						});
	
	$(".board").css({
						"left":LEFT_BOARD_WIDTH + (BOARD_MARGIN * 2) - 4,
						"padding":PADDING,
						"overflow":"hidden"})
//----------------------------------------------------------------

//  USER_ID
	$("#top-board0").css({"top": - 20,
						"padding-left":0,
						"height":TOP_BOARD_HEIGHT,
//						"border":"3px solid " + DARK_GREEN_TRANS,
						"background":"white",
						"color":"black",
						"font-size":24
//						"font-weight":"bold"
						});		// "border":"2px solid gray"

//	EVENEMENTS/IMAGE/ECHELLE	
	$("#top-board1").css({"top":BOARD_MARGIN + 6,						
						"height":TOP_BOARD_HEIGHT,
						"border":"3px solid " + DARK_GREEN_TRANS,
						"border-bottom":0,
						"background":"white",
						"color":DARK_GREEN,
						"font-size":18,
						"font-weight":"bold"
						});		// "border":"2px solid gray"

	if (sessions.length == 1) {
		$("#top-board1").text("Aucun événement!");
		return;
	}
	
// 	DATE	TIME
	$("#top-board4").css({"top":BOARD_MARGIN + (BOARD_MARGIN * 3),						
						"height":TOP_BOARD_HEIGHT,
						"width":USER_ID_WIDTH,
						"background":"black",
						"border":"3px solid black",
						"color":"red",
						"font-size":"medium",
						"font-weight":"bold"
						});		// "border":"2px solid gray"
	
//  TYPE 	TARGET	
	$("#top-board5").css({"top":BOARD_MARGIN + (BOARD_MARGIN * 3),
						"left":LEFT_BOARD_WIDTH + (BOARD_MARGIN * 3) + USER_ID_WIDTH,
						"height":TOP_BOARD_HEIGHT,
						"min-width":BOARD_MIN_WIDTH - USER_ID_WIDTH - 20,
						"right":BOARD_MARGIN * 2,
						"background":VERY_LIGHT_GRAY,
						"border":"3px solid black"
						});		// "border":"2px solid gray"

//  DOC_URL
	$("#top-board2").css({"top":TOP_BOARD_HEIGHT + (BOARD_MARGIN * 6),
						
						"height":(TOP_BOARD_HEIGHT * 2) + PADDING + 3,
						"font-size":"medium",
						"background":DARK_GRAY,
						"color":"white"
						});

//  DOC_TITLE
	$("#top-board6").css({"top":TOP_BOARD_HEIGHT + (BOARD_MARGIN * 11),
						
						"height":(TOP_BOARD_HEIGHT) + PADDING + 4,
						"font-size":"medium",
						"background":VERY_LIGHT_GRAY,
//						"border":"2px solid black",
						"font-weight":"bold",
						"color":"black"
						});
//----------------------------------------------------------------
//  SCREEN
	$("#screen").css({"top":TOP_BOARD_HEIGHT + (BOARD_MARGIN * 16),
						"left":LEFT_BOARD_WIDTH + (BOARD_MARGIN * 2)
					//	"border":"4px solid" + VERY_LIGHT_GRAY
						});
	$("#screenshot-back").css({"overflow":"hidden"});
	$("#screenshot").css({"overflow":"hidden"});

	$("#screenshot-frame").css({"top":-5,
						"left":-5,
						"z-index":50,
						"border":"5px solid" + VERY_LIGHT_GRAY
						});	

//----------------------------------------------------------------
//	TIMELINE
	$("#timeline").css({"z-index":-5,
						"height":TOP_BOARD_HEIGHT,
						"background":VERY_LIGHT_GRAY,
						"font-size":"medium"
						});

//	TARGET_VALUE 
	$("#top-board3").css({"z-index":-5,					
						"height":BOTTOM_BOARD_HEIGHT,
						"background":VERY_LIGHT_GRAY,
						"font-size":"medium"
						});
//-----------------------------------------------------------------	
	$("#left-board").css({"top":TOP_BOARD_HEIGHT + (BOARD_MARGIN * 4),
						"left":BOARD_MARGIN,
						"right":BOARD_MARGIN,
						"height":sessions[1][SCREEN_HEIGHT],
						"width":LEFT_BOARD_WIDTH
					//	"background":VERY_LIGHT_GRAY
						});
	
//-----------------------------------------------------------------	
	$("#event-num, #count-down").css({
						"max-width":LEFT_BOARD_WIDTH,
						"height":INPUT_HEIGHT,
						"width":70,
						"text-align":"center",
						"font-weight":"bold",
						"font-size":20
						});
	
	$("#count-down").css({
						"background":DARK_GRAY,
//						"opacity":0,
						"color":"yellow",
						"margin-top":4,
						"margin-bottom":4,
						"margin-left":20}).text(0);
						
	$("#event-num").css({
						"background":"yellow",
						"color":"black",
						"margin-left":-6,
						"margin-top":5,
						"margin-bottom":5}).addClass("body").val(0);
//-------------------------------------------------------------	
	$("#event-type, #event-target, #event-url").css({
						"position":"absolute",
						"color":"black",
						"font-size":18,
						"font-weight":"bold",
						"overflow":"hidden"
						});
	
	$("#event-type").css({"text-align":"right",
						"width":300,
						"top":0,
						"padding":4,
						"color":"red",
						"text-align":"center",
						"background":VERY_LIGHT_GRAY
						}).addClass("body");
	
	$("#event-target").css({"text-align":"right",
						"left":340,
						"right":PADDING,
						"text-align":"left",
						"vertical-align":"top"});
	
//	URL REGEXP
	$("#event-url").css({"text-align":"left",
						"z-index":50,
						"width":$("#top-board2").width(),
						"right":BOARD_MARGIN,
						"left":(LEFT_BOARD_WIDTH * 6) + (BOARD_MARGIN * 2) - 4,
						"padding":PADDING,
						"overflow":"hidden",
						"top":TOP_BOARD_HEIGHT + (BOARD_MARGIN * 7) + (PADDING * 2) + 12,
						"height":(TOP_BOARD_HEIGHT) - PADDING - 7,
						"background":"white",
						"color":"red",
						"text-align":"left",
						"vertical-align":"top"}).addClass("body");
	
//-----------------------------------------------------------------	
	$("#test").css({
					"position":"relative",
					"width":1,
					"height":20,
					"left":100,
					"background":"black"
	});
	
	
	$("#billePng").html("<img src='Images/billeJauneMedium.png' width='"
					+ billeSize + "px' height='" + billeSize + "px'>").css("position","absolute");
	$("#bille").css({"position":"absolute","z-index":"100", "opacity":"0"});
	$("#clicPoint").css({"position":"absolute",
						"background-color":"red",
						"top":(billeSize / 8 * 3) + "px",
						"left":((billeSize / 8 * 3) + 1) + "px",
						"width":((billeSize / 4) - 1) + "px",
						"height":((billeSize / 4) - 1) + "px"});
	
		
		
}
//*************************************************************************************************
function findEventWithType(eventId,gardeIndex, sens) {  // filtre type et url
	var id = Number(eventId);
	while (((id < sessions.length - 1) && (sens == 1)) || ((id > 0) && (sens == (-1)))) {
//		id = id + sens;
		
		var typeRegExp, urlRegExp;
		if (typeFilter) typeRegExp = typeFilter;
		else typeRegExp = '.*';
		if (urlFilter) urlRegExp = urlFilter;
		else urlRegExp = '.*';
		
		if (sessions[id][TYPE].match(RegExp(typeRegExp)) && sessions[id][DOC_URL].match(RegExp(urlRegExp))) {
			if (gardeIndex == id) return false;
			eventIndex = id;
			return true;
		}
		id = id + sens;
	}
	return false;
}

//*************************************************************************************************
function displayMultiEvent(startIndex) {  // startIndex à virer
	if (eventIndex > sessions.length - 2) return;
	patchGeraldine();
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

//*************************************************************************************************
function startCountDown() {
	if (!autoMode) return;
	if (countDownId) clearInterval(countDownId);
	countDownId = setInterval(function() {
		if (eventCountDown <= 0) eventCountDown = 0;
		else eventCountDown -= 1;
		if (eventCountDown < 1) eventCountDown = 0;
		if(eventCountDown > 60) eventCountDownString = secondstotime(eventCountDown);
		else eventCountDownString = eventCountDown.toFixed(0);
		$("#event-count-down").text(eventCountDownString);
		$("#count-down").text(eventCountDown.toFixed(0));
		
		var dureePast;
		if (eventIndex > sessions.length - 2) dureePast = dureeProto;
		else dureePast = (((sessions[eventIndex + 1][TIME_STAMP] - sessions[1][TIME_STAMP]) / 1000) - eventCountDown).toFixed();
		dureePast = secondstotime(dureePast);
		 $("#durPast").text(dureePast);
	}, 1000);
}
//*************************************************************************************************
function flashForbidden() {
	$("#screen").css({"opacity":0.2});
	setTimeout(function() {
		$("#screen").css({"opacity":1});
	}, 300);
}

//*************************************************************************************************
function autoModeStart() {
	if (eventIndex > sessions.length - 1) return;
	autoMode = true;
	startCountDown();
	$("#count-down").css({"opacity":1});
	$("#foreward-multi").find("span").css({"color":"white"}).text("<>");
	$("#foreward-multi").css("background","red");
	typeFilter = "";
}
//*************************************************************************************************
function autoModeStop() {
	autoMode = false;
	clearTimeout(animTimeOutId);
	clearTimeout(timeOutId);
	clearInterval(countDownId);
	$("#bille").finish();
	lastImg.finish();
	backImg.finish();
//	$("#count-down").css({"opacity":0});
	$("#foreward-multi").find("span").css({"color":"#47A"}).text(">>");
	$("#foreward-multi").css("background",VERY_LIGHT_GRAY);
}
//*************************************************************************************************
	// patch click Géraldine
function patchGeraldine() {
	if ((sessions[eventIndex][USER_ID] == 'Géraldine') || (sessions[eventIndex][USER_ID] == 'Geraldine')) {
		while  (/*(sessions[eventIndex][TYPE] == 'click')
			|| */(sessions[eventIndex][TYPE] == 'activate')
			|| (sessions[eventIndex][TYPE] == 'deactivate')
			|| (sessions[eventIndex][TYPE] == 'close')
			|| (sessions[eventIndex][TYPE] == 'navigate')) {
					if (eventIndex > sessions.length - 2) break;
					eventIndex++;
			}
			
	}
}
//***************************************************************************************************

function displayEvent(eventIdParam) {
	var eventId = Number(eventIdParam);
	if (!(eventId > 0 && eventId < sessions.length)) return;

	if (eventId < sessions.length - 1) {
		startEventCountDown =
				(sessions[Number(eventId) + 1][TIME_STAMP] - sessions[eventId][TIME_STAMP]) / speedFactor;
		eventCountDown = (startEventCountDown / 1000).toFixed(0);
	}	
	else eventCountDown = startEventCountDown = 0;
	if (eventCountDown > 99999) eventCountDown = 99999;
	startEventCountDown = Number(startEventCountDown);
	
	$("#event-num").val(eventId);
	
	var eventPng;
	if (pngs[eventId][0] == '<') eventPng = eventId;
	else eventPng = pngs[eventId];
	
//  index du png courant (pour affichage displaySummary)
	pngIndex = 0;
	while (pngsIndex[pngIndex++] != eventPng);
	if (pngIndex > pngsIndex.length - 1) pngIndex = pngsIndex.length - 1;
	
//	if (((sessions[eventId][TYPE] == 'mousewheel') && ((sessions[eventId - 1][TYPE] != 'mousewheel'))) || ((sessions[eventId][TYPE] == 'scroll') && ((sessions[eventId - 1][TYPE] != 'scroll'))) || ((sessions[eventId][TYPE] == 'resize') && ((sessions[eventId - 1][TYPE] != 'resize')))) {
		
		$("#screenshot-back").html(pngs[pngsIndex[pngIndex]]);  	// affiche background
		
		backImg = $("#screenshot-back").find("img");
		backImg.css({"position":"relative", /* "top":0, "left":0, */ "z-index":-1});
		if (reducFactor && pngIndex < pngsIndex.length - 1) backImg.css({"width":sessions[pngsIndex[pngIndex]][WIN_INNER_WIDTH] * reducFactor, "height":sessions[pngsIndex[pngIndex]][WIN_INNER_HEIGHT] * reducFactor});
//	}
 	
	$("#screenshot").html(pngs[eventPng]);  				// affichage image
	
	lastImg = $("#screenshot").find("img");
	lastImg.css("position","relative");
 	
	
	if (reducFactor && pngIndex < pngsIndex.length - 1){
		if (sessions[eventId][TYPE] == 'resize')
			lastImg.height(lastImg.height() * reducShowPng);
		else
			lastImg.css({"width":sessions[eventId][WIN_INNER_WIDTH] * reducFactor, "height":sessions[eventId][WIN_INNER_HEIGHT] * reducFactor});
	}
	
	if (!reducFactor) {
		origReducFactor = $("#screenshot").height() / sessions[eventId][WIN_INNER_HEIGHT];
		if (origReducFactor == Infinity) origReducFactor = 1;
		reducFactor = origReducFactor * reducShowPng;
	}
	
	var currentOffsetX = sessions[eventId][WIN_PAGE_X_OFFSET] * reducFactor;
	var currentOffsetY = sessions[eventId][WIN_PAGE_Y_OFFSET] * reducFactor;
	var backOffsetX = sessions[pngsIndex[pngIndex]][WIN_PAGE_X_OFFSET] * reducFactor;
	var backOffsetY = sessions[pngsIndex[pngIndex]][WIN_PAGE_Y_OFFSET] * reducFactor;
	if (newImage || (pngs[eventId][0] == '<')) {  // eventId  eventPng
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
			lastImg.css({"left":difOffsetX, "top":difOffsetY});
			backImg.css({"left":difOffsetX + difFrontBackX, "top":difOffsetY + difFrontBackY});
	}		
// animation scrool désactivée
//			backImg.animate({"left":difOffsetX + difFrontBackX, "top":difOffsetY + difFrontBackY}, startEventCountDown, 'linear');
//			lastImg.animate({"left":difOffsetX, "top":difOffsetY}, startEventCountDown, 'linear');

	
	
//...  MISE À L'ÉCHELLE

	var eventIdOrPng;
	if (sessions[eventId][WIN_INNER_WIDTH] == "0") eventIdOrPng = eventPng;
	else eventIdOrPng = eventId;
	//$("#screenshot-frame, #screenshot, #screenshot-back")
	$("#screenshot-frame, #screenshot, #screenshot-back").css({"width":sessions[eventIdOrPng][WIN_INNER_WIDTH] * reducFactor
								,"height":sessions[eventIdOrPng][WIN_INNER_HEIGHT] * reducFactor});
//	lastImg.height(lastImg.height() * reducShowPng);
	
//  A N I M A T I O N 		B I L L E

	if (autoMode) displayNextMouse(sessions[Number(eventId) + 1]);
	displayMouse(sessions[eventId]);
	
// A F F I C H A G E    B O A R D S
	
	if(eventCountDown > 60) eventCountDownString = secondstotime(eventCountDown);
	else eventCountDownString = eventCountDown;
	
	$("#top-board0").text(sessions[eventId][USER_ID]);
	$("#top-board2").text(sessions[eventId][DOC_URL]);
	$("#timeline").css({"top":(TOP_BOARD_HEIGHT * 3) + (BOARD_MARGIN * 14) + 4 + $("#screenshot").height()});
	$("#top-board3").css({"top":(TOP_BOARD_HEIGHT * 4) + (BOARD_MARGIN * 16) + $("#screenshot").height()})
					.text(sessions[eventId][TARGET_VALUE]);
	if (sessions[eventId][TARGET] == 'Input') $("#top-board3").css({"color":"white", "background":"black", "font-size":24});
	else $("#top-board3").css({"color":"black", "background":VERY_LIGHT_GRAY, "font-size":18});
	$("#top-board4").html(sessions[eventId][EVENT_DATE] + '    '
						+ sessions[eventId][EVENT_TIME] + ' | '
						+ '<span id="event-count-down" style="color:yellow;">' + eventCountDownString + '</span>/' + eventCountDownString);
	$("#event-type").val(typeFilter);
	$("#event-target").text(sessions[eventId][TYPE] + '  ' + filterEventLocalTarget(sessions[eventId][TARGET_LOCAL_NAME], sessions[eventId][TARGET]));
	$("#top-board6").text(sessions[eventId][DOC_TITLE]);	
	$("#count-down").text(eventCountDown);
	displaySummary();
}
//*************************************************************************************************

function displaySummary() {  // display  top-board1
	var eventInfo = 'Position: <span style="color:black;">' + eventIndex + '</span>/' + (sessions.length - 1);
	var pngInfo = 'Image: ' + pngIndex + '/' + pngsNumber;
	var reducInfo = '';
	if (origReducFactor) reducInfo = 'Echelle: ' + reducFactor.toFixed(1) + '(' + origReducFactor.toFixed(1) + '*' + reducShowPng + ')';
	
	var dureePast = ((sessions[eventIndex][TIME_STAMP] - sessions[1][TIME_STAMP]) / 1000).toFixed();
	if (dureePast == "NaN") dureePast = 0;
	dureePast = secondstotime(dureePast);
	var barColor = "black";
	$("#top-board1").html(eventInfo + '<span style="color:' + barColor + '">  |  </span>' + pngInfo + '<span style="color:' + barColor + '">  |  </span>' + reducInfo + '<span style="color:' + barColor + '">  |  </span>Durée: <span id="durPast" style="color:red">' + dureePast + '</span>/' + dureeProto);
	
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
	if (loc == t) return T;
	else return T + '(' + localT + ')';
}
//*************************************************************************************************

function displayMouse(event) {

	if (reducFactor) {
		billeSize = reducFactor * BILLE_SIZE;
		$("#billePng").width(billeSize);
	}

    var x = event[CLIENT_X] * reducFactor;
    var y = event[CLIENT_Y] * reducFactor;
	
	if (!x && !y) {
		if (event[TYPE] == 'resize') {
			x = event[WIN_INNER_WIDTH] * reducFactor;
			y = event[WIN_INNER_HEIGHT] * reducFactor;
		}
		else {
			$("#bille").css("opacity","0");
			return;
		}
	}
		
	if (!autoMode) $("#bille").css({"top":(y - (billeSize / 2)) + "px", "left":(x - (billeSize / 2)) + "px", "opacity":"0.8"});
	if ((event[TYPE] == 'click') || (event[TYPE] == 'dblclick')) {
		$("#clicPoint").css("opacity","1")
	}
	else $("#clicPoint").css("opacity","0");
}
//*************************************************************************************************

function displayNextMouse(event) {   //displayMouse();

	if (reducFactor) {
		billeSize = reducFactor * BILLE_SIZE;
		$("#billePng").width(billeSize);
	}

	if (!startEventCountDown) return;
	
    var x = event[CLIENT_X] * reducFactor;
    var y = event[CLIENT_Y] * reducFactor;
	var animTime;
	
	if (!x && !y) {
		if (event[TYPE] == 'resize') {
			x = event[WIN_INNER_WIDTH] * reducFactor;
			y = event[WIN_INNER_HEIGHT] * reducFactor;
		}
		else {
			$("#bille").css("opacity","0");
			return;
		}
	}
	
	var ease;
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
		$("#bille").animate({"top":(y - (billeSize / 2)) + "px", "left":(x - (billeSize / 2)) + "px", "opacity":"0.8"}, animTime, ease);
	}, preAnimTime);
	
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
	for (i = 1; i < sessions.length; i++) {
		
		function findPng(i,id) {
			$.ajax({
				url: 'findPng.php',
				data: { 'id': id },
				complete: function(xhr, result) {
					if (result == 'success') {
						if ((xhr.responseText != "no") && (xhr.responseText != "zero")) {
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
					if (done == sessions.length - 1) {
						var imgPtr;
						var j = 1;
						while (!pngs[j]) pngs[j++] = "";
						var k = 1;
						while (pngs[k] == '') pngs[k++] = j;
						for (; j < sessions.length; j++) {
							if (pngs[j]) imgPtr = j;
							else pngs[j] = imgPtr;
						}
						if (!pngsNumber) {
							$("#top-board1").text("Aucune image!");
							return;
						}
						pngsIndex.sort(function(a, b) {return a - b});
						if (eventIndex == 0) {
							displayEvent(++eventIndex + 1);
							displayEvent(eventIndex);
						}
					}
				}		
			});
		}
		
		id = sessions[i][BLOB_ID];
		if (!id) id = 0;
		findPng(i, id);
	}
}
		
		


		
		
		
