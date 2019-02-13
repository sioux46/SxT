
$(document).ready(function() {

	$("#downloadCsv").on('click', function(event) {
		event.preventDefault();
		this.blur();
		var requestText = $("#requestText").text();
		if (requestText) {
			if (requestText.match(/SELECT\s*FROM/)) return;
			requestText = requestText.replace(/EventTable/, 'Event_L_DocSuite');
			$.ajax({
				url: 'downloadSxTQueryFromQuery.php',
				type: 'POST',
				data: { request: requestText},
				complete: function(xhr, result) {
					if (result == 'success') {
						window.location = 'downloadSxTQuery.php';
					}
					else {
						alert('Pas de réseau!');
					}
				}
			});
		}
	});

});
// ***********************************************************************

function displayPng(divIndex, winInnerHeight,clientX, clientY, targetRectL, targetRectT, targetRectW, targetRectH, type, reducShowPng) {

	if (divIndex == 1) $("body").css({"background-color":"hsl(0,0%,94%"});

    var divPng = document.getElementById('divpng' + divIndex);
    var innerDivPng = document.getElementById('innerdivpng' + divIndex);
    var imgPng = divPng.firstChild.firstChild;

	$(imgPng).css({"border":"1px solid hsl(0,0%,85%"});

    var reducFactor = imgPng.height / winInnerHeight;
    reducFactor = reducFactor * reducShowPng;

    var x = clientX * reducFactor;
    var y = clientY * reducFactor;
    var l = targetRectL * reducFactor;
    var t = targetRectT * reducFactor;
    var w = targetRectW * reducFactor;
    var h = targetRectH * reducFactor;

	imgPng.width = imgPng.width * reducShowPng;
//	var decal = (window.outerWidth - imgPng.width) / 2;

	var decal = 40;
	innerDivPng.setAttribute('style', 'margin-left:' + decal + 'px;');

	if ( !((targetRectW == 0) && (targetRectH == 0))) {
		var target = document.createElement('div');      //  TARGET
		target.setAttribute('class', 'png-target');
		target.style.borderWidth = '11px';

		if (t < 0) {
			t = 0;
			target.style.borderTopWidth = '0px';
		}
		if (l < 0) {
			l = 0;
			target.style.borderLeftWidth = '0px';
		}
		if ((h + t) > imgPng.height) {
			h = imgPng.height - t;
			target.style.borderBottomWidth = '0px';
		}
		if ((w + l) > imgPng.width) {
			w = imgPng.width - l;
			target.style.borderRightWidth = '0px';
		}

		t -= 11;
		l -= 11;

		l += decal;
		x += decal;

		target.style.top = t + 'px';
		target.style.left = l + 'px';
		target.style.width = w + 'px';
		target.style.height = h + 'px';



//		divPng.appendChild(target);  //  rect vert désactivé
	}
//
	if (!((clientX == 0) && (clientY == 0))) {
		var bille = document.createElement('div');        //  BILLE
		if ((type == 'click') || (type == 'dblclick')) {
			var rouge = document.createElement('div');
			rouge.setAttribute('style', 'position:absolute; top:' +
				 	(y -10) +'px; left:' + (x - 10) + 'px; width:20px; height:20px');
			rouge.setAttribute('class', 'png-bille-rouge');
			bille.setAttribute('class', 'png-bille');
			divPng.appendChild(rouge);
		}
		else bille.setAttribute('class', 'png-bille');
		bille.innerHTML = '<img src="Images/billeJauneMedium.png" width=\"100\">';
		bille.setAttribute('style', 'position:absolute; top:' + (y - 50) +'px; left:' + (x - 50) + 'px;');

		divPng.appendChild(bille);
	}

	var typeElem = document.createElement('h1');        //  TYPE
	if ((type == 'click') || (type == 'dblclick'))
			typeElem.setAttribute('class', 'event-type-red');
	else typeElem.setAttribute('class', 'event-type');
	typeElem.innerHTML = type;
	typeElem.setAttribute('style', 'position:absolute; top:' + (y - 14) +'px; left:' + (x + 50) + 'px;');

	divPng.appendChild(typeElem);

}
