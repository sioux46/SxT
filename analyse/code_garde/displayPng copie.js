

function displayPng(divIndex, winInnerHeight,clientX, clientY, targetRectL, targetRectT, targetRectW, targetRectH, type) {
    

    var divPng = document.getElementById('divpng' + divIndex);
    var imgPng = divPng.firstChild;
    var reducFactor = imgPng.height / winInnerHeight;
    
    var x = clientX * reducFactor;
    var y = clientY * reducFactor;
    var l = targetRectL * reducFactor;
    var t = targetRectT * reducFactor;
    var w = targetRectW * reducFactor;
    var h = targetRectH * reducFactor;
    
    var canvasPng = document.createElement('canvas');
    canvasPng.height = imgPng.height;
    canvasPng.width = imgPng.width;
    var cpc = canvasPng.getContext('2d');
    cpc.drawImage(imgPng, 0, 0, imgPng.width, imgPng.height);
//                                                                          TARGET    
    cpc.fillStyle = 'rgba(127,127,127,0.2)';
    cpc.fillRect(l, t, w, h);
    cpc.strokeStyle = 'rgba(0,255,0,0.7)';
    cpc.lineWidth = 7;
    cpc.strokeRect(l, t, w, h);
//                                                                          TYPE    
    cpc.beginPath();
    cpc.arc(x, y, 20, 0, 2*Math.PI, true);
    cpc.fillStyle = 'rgba(255,255,0,0.3)';
    cpc.fill();
//                                                                          CLICK
    var strokeTextStyle;
    if ((type == 'click') || (type == 'dblclick')) {
        cpc.strokeStyle = 'rgba(255,0,0,0.7)';
        strokeTextStyle = 'rgba(255,0,0,1)';
    }
    else strokeTextStyle = 'rgba(0,255,0,1)';
    cpc.lineWidth = 7;
    cpc.stroke();

    cpc.strokeStyle = strokeTextStyle;
    cpc.lineWidth = 2;
    cpc.font = '32px lighter';
//    cpc.fontStyle = 'italic';
    var decalText = (type.length -1) * 9;
    cpc.strokeText(type, x - decalText, y + 46);
    
        
    imgPng.parentNode.replaceChild(canvasPng, imgPng);
}