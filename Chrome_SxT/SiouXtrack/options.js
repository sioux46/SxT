
    // options.js

    var ST_URL = document.getElementById( 'ST_URL' );
    var userId = document.getElementById( 'userId' );
    var freeField1 = document.getElementById( 'freeField1' );
    var freeField2 = document.getElementById( 'freeField2' );
    var freeField3 = document.getElementById( 'freeField3' );
    var STButton = document.getElementById( 'STButton' );
    var maxEvents = document.getElementById( 'maxEvents' );
    var minStation = document.getElementById( 'minStation' );
    var mousemove = document.getElementById( 'mousemove' );
    var mouseover = document.getElementById( 'mouseover' );
    var mouseout = document.getElementById( 'mouseout' );
    var mousewheel = document.getElementById( 'mousewheel' );
    var scroll = document.getElementById( 'scroll' );
    var html = document.getElementById( 'html' );
    var png = document.getElementById( 'png' );
    var pngPlus = document.getElementById( 'pngPlus' );
    var noHTTPS = document.getElementById( 'noHTTPS' );
    var regExp1 = document.getElementById( 'regExp1' );
    var regExp2 = document.getElementById( 'regExp2' );
    var regExp3 = document.getElementById( 'regExp3' );
    var regExp4 = document.getElementById( 'regExp4' );
    var regExp5 = document.getElementById( 'regExp5' );
	var pngReduc = document.getElementById( 'pngReduc' );
    var autoRecord = document.getElementById( 'autoRecord' );

    var password = document.getElementById('password');
    var overlay = document.getElementById('overlay');

	var authoUserId = document.getElementById( 'authoUserId' );

    var bgPage = chrome.extension.getBackgroundPage();

    var userIdFilter;

/////////////////////////////////////////////////////////  READY
     $(document).ready(function() {
//
     window.addEventListener('storage', function() {
          window.location.href = window.location.href;
     }, false);

//
    ST_URL.addEventListener( 'change', function() {
         localStorage['ST_URL'] = this.value;
		 bgPage.userChanged(this.id);
    }, false );


    userId.addEventListener( 'change', function() {
          blurId();
    }, false );
/*
    userId.addEventListener( 'blur', function() {
         blurId();
     }, false );
*/
     document.addEventListener( 'keyup', function(event) {
          if ((event.keyCode == 13) && (event.target.id == 'password')) {
//               if (password.value == '') blurId();
               /*else*/ verifGlobalPass(userId.value, password.value);
          }
     }, false );

    autoRecord.addEventListener( 'change', function() {
         localStorage['autoRecord'] = this.value;
         if (this.value == 'autoHidden') localStorage['STButton'] = 'false';
         else /*if (this.value == 'auto')*/ localStorage['STButton'] = 'true';
         window.location.href = window.location.href;
		 bgPage.userChanged(this.id);
    }, false );

    STButton.addEventListener( 'change', function() {
         localStorage['STButton'] = this.checked;
         bgPage.showHideButton();
		 bgPage.userChanged(this.id);
    }, false );

    freeField1.addEventListener( 'change', function() {
         localStorage['freeField1'] = this.value;
		 bgPage.userChanged(this.id);
    }, false );

    freeField2.addEventListener( 'change', function() {
         localStorage['freeField2'] = this.value;
		 bgPage.userChanged(this.id);
    }, false );

    freeField3.addEventListener( 'change', function() {
         localStorage['freeField3'] = this.value;
		 bgPage.userChanged(this.id);
    }, false );

    maxEvents.addEventListener( 'change', function() {
		if ((this.value > 1) && (this.value <= 100)) {
			localStorage['maxEvents'] = this.value;
			bgPage.userChanged(this.id);
		}
		else {
			localStorage['maxEvents'] = 16;
			bgPage.userChanged(this.id);
			window.location.href = window.location.href;
		}
    }, false );

    minStation.addEventListener( 'change', function() {
		if ((this.value >= 0) && (this.value <= 10000)) {
			localStorage['minStation'] = this.value;
			bgPage.userChanged(this.id);
		}
		else {
			localStorage['minStation'] = 2000;
			bgPage.userChanged(this.id);
			window.location.href = window.location.href;
		}
    }, false );

    mousemove.addEventListener( 'change', function() {
         localStorage['mousemove'] = this.checked;
		 bgPage.userChanged(this.id);
    }, false );

    mouseover.addEventListener( 'change', function() {
         localStorage['mouseover'] = this.checked;
		 bgPage.userChanged(this.id);
    }, false );

    mouseout.addEventListener( 'change', function() {
         localStorage['mouseout'] = this.checked;
		 bgPage.userChanged(this.id);
    }, false );

    mousewheel.addEventListener( 'change', function() {
         localStorage['mousewheel'] = this.checked;
		 bgPage.userChanged(this.id);
    }, false );

    scroll.addEventListener( 'change', function() {
         localStorage['scroll'] = this.checked;
		 bgPage.userChanged(this.id);
    }, false );

    html.addEventListener( 'change', function() {
         localStorage['html'] = this.checked;
		 bgPage.userChanged(this.id);
    }, false );

    png.addEventListener( 'change', function() {
         localStorage['png'] = this.checked;
		 bgPage.userChanged(this.id);
    }, false );

    pngPlus.addEventListener( 'change', function() {
         localStorage['pngPlus'] = this.checked;
		 bgPage.userChanged(this.id);
    }, false );

    noHTTPS.addEventListener( 'change', function() {
         localStorage['noHTTPS'] = this.checked;
		 bgPage.userChanged(this.id);
    }, false );

    regExp1.addEventListener( 'change', function() {
         localStorage['regExp1'] = this.value;
		 bgPage.userChanged(this.id);
    }, false );

    regExp2.addEventListener( 'change', function() {
         localStorage['regExp2'] = this.value;
		 bgPage.userChanged(this.id);
    }, false );

    regExp3.addEventListener( 'change', function() {
         localStorage['regExp3'] = this.value;
		 bgPage.userChanged(this.id);
    }, false );

    regExp4.addEventListener( 'change', function() {
         localStorage['regExp4'] = this.value;
		 bgPage.userChanged(this.id);
    }, false );

    regExp5.addEventListener( 'change', function() {
         localStorage['regExp5'] = this.value;
		 bgPage.userChanged(this.id);
    }, false );

    pngReduc.addEventListener( 'change', function() {
		if ((this.value >= 0.1) && (this.value <= 1)) {
			localStorage['pngReduc'] = this.value;
			bgPage.userChanged(this.id);
		}
		else {
			localStorage['pngReduc'] = 0.7;
			bgPage.userChanged(this.id);
			window.location.href = window.location.href;
		}
    }, false );


	 overlay.addEventListener('click', function() {
		  if (overlay.style.visibility == 'visible')
			   if (password.value.length > 0) verifGlobalPass(userId.value, password.value);
	 }, false);

    if (localStorage['ST_URL']) ST_URL.value = localStorage['ST_URL'];
    else localStorage['ST_URL'] = ST_URL.value = "http://sioux.univ-paris8.fr/sioux/track";
    if (localStorage['userId']) userId.value = localStorage['userId'];
    else localStorage['userId'] = userId.value = "Anonyme";
    if (localStorage['freeField1']) freeField1.value = localStorage['freeField1'];
    else localStorage['freeField1'] = "";
    if (localStorage['freeField2']) freeField2.value = localStorage['freeField2'];
    else localStorage['freeField2'] = "";
    if (localStorage['freeField3']) freeField3.value = localStorage['freeField3'];
    else localStorage['freeField3'] = "";

    if (localStorage['STButton']) STButton.checked = (localStorage['STButton'] == "true") ? true : false;
    else localStorage['STButton'] = STButton.checked = true;
    if (localStorage['maxEvents']) maxEvents.value = localStorage['maxEvents'];
    else localStorage['maxEvents'] = maxEvents.value = "16";
    if (localStorage['minStation']) minStation.value = localStorage['minStation'];
    else localStorage['minStation'] = minStation.value = "2000";
    if (localStorage['mousemove']) mousemove.checked = (localStorage['mousemove'] == "true") ? true : false
    else localStorage['mousemove'] = mousemove.checked = false;
    if (localStorage['mouseover']) mouseover.checked = (localStorage['mouseover'] == "true") ? true : false
    else localStorage['mouseover'] = mouseover.checked = true;
    if (localStorage['mouseout']) mouseout.checked = (localStorage['mouseout'] == "true") ? true : false
    else localStorage['mouseout'] = mouseout.checked = false;
    if (localStorage['mousewheel']) mousewheel.checked = (localStorage['mousewheel'] == "true") ? true : false
    else localStorage['mousewheel'] = mousewheel.checked = false;
    if (localStorage['scroll']) scroll.checked = (localStorage['scroll'] == "true") ? true : false
    else localStorage['scroll'] = scroll.checked = true;
    if (localStorage['html']) html.checked = (localStorage['html'] == "true") ? true : false
    else localStorage['html'] = html.checked = false;
    if (localStorage['png']) png.checked = (localStorage['png'] == "true") ? true : false
    else localStorage['png'] = png.checked = true;
    if (localStorage['pngPlus']) pngPlus.checked = (localStorage['pngPlus'] == "true") ? true : false
    else localStorage['pngPlus'] = pngPlus.checked = true;

    if (localStorage['autoRecord']) autoRecord.value = localStorage['autoRecord'];
    else localStorage['autoRecord'] = autoRecord.value = "manual";

    if (localStorage['noHTTPS']) noHTTPS.checked = (localStorage['noHTTPS'] == "true") ? true : false
    else localStorage['noHTTPS'] = noHTTPS.checked = false;

    if (localStorage['regExp1']) regExp1.value = localStorage['regExp1'];
    else localStorage['regExp1'] = regExp1.value = "";
    if (localStorage['regExp2']) regExp2.value = localStorage['regExp2'];
    else localStorage['regExp2'] = regExp2.value = "";
    if (localStorage['regExp3']) regExp3.value = localStorage['regExp3'];
    else localStorage['regExp3'] = regExp3.value = "";
    if (localStorage['regExp4']) regExp4.value = localStorage['regExp4'];
    else localStorage['regExp4'] = regExp4.value = "(?# mediapart|google|wikipedia";
    if (localStorage['regExp5']) regExp5.value = localStorage['regExp5'];
    else localStorage['regExp5'] = regExp5.value = "(?# ^http://www\.google\.(com|fr)(?!/shopping)";

	if (localStorage['pngReduc']) pngReduc.value = localStorage['pngReduc'];
    else localStorage['pngReduc'] = pngReduc.value = "1";

	if (localStorage['authoUserId']) authoUserId.value = localStorage['authoUserId'];
    else localStorage['authoUserId'] = authoUserId.value = "Anonyme";


});    // FIN .READY
																		// FIN .READY
//*****************************************************************************************

///////////////////////////////////////
function blurId() {
          userIdFilter = userId.value.replace(/(\s)/g,'');
          if (userIdFilter == '') {
               localStorage['userId'] = localStorage['authoUserId'] = 'Anonyme';
               window.location.href = window.location.href;
          }
          else if (userIdFilter == localStorage['authoUserId']) return;
          else showOverlay(true);
    }

/////////////////////////////////////
function showOverlay(show) {

     if (show) {
          overlay.style.visibility = 'visible';
          password.focus();
     }
     else {
          password.blur();
          overlay.style.visibility = 'hidden';
     }
}
/////////////////////////////////////
function verifGlobalPass(user, pass) {
     showOverlay(false);
     var passUrl = localStorage['ST_URL'] + '/SxT_Login.php';

     var username = $.trim(user);
     var password = $.trim(pass);
     if (!password || (password.match(/^.{8,15}$/) && !password.match(/\s/))) {
          $.ajax({
              url: passUrl,
              data: {'user': username, 'pass': password},
              complete: function(xhr, result) {
                  showOverlay(false);
                  if (result != 'success') {
                      alert('Pas de reseau!');
                      localStorage['userId'] = localStorage['authoUserId'] = 'Anonyme';
                      window.location.href = window.location.href;
                  }
                  else {
                      var reponse = xhr.responseText;
                      if (reponse != 'OK') {
                         alert('Identifiant ou mot de passe incorrect!');
                         localStorage['userId'] = localStorage['authoUserId'] = 'Anonyme';
                         window.location.href = window.location.href;
                         return;
                      }
                      else {
                         localStorage['userId'] = localStorage['authoUserId'] = username  //userIdFilter;
                         bgPage.userChanged('');
                         window.location.href = window.location.href;
                      }
                  }
               }
          });
     }
     else {
         alert('Mot de passe invalide!\n(minimum 8 car.');
         localStorage['userId'] = localStorage['authoUserId'] = 'Anonyme';
         window.location.href = window.location.href;
     }

}
