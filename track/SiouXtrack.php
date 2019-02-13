<?php
include_once("inc/logbug.php");
include_once("inc/mySqlParam.php");
error_reporting(E_ERROR);

logbug("COUCOU! ".$_SERVER["HTTP_HOST"]. "********* ".gmdate('r', time()));
$stb = new mysqli(MYHOST,MYUSER,MYPASS,MYBASE);
if ($stb->connect_errno) {
    logbug("ERREUR OUVERTURE BASE: $stb->connect_error");
    header("SebStatus: 500");
    header("SebError: ERREUR OUVERTURE BASE:  $stb->connect_error");
    exit(1);
}
logbug("Methode: ".$_SERVER["REQUEST_METHOD"]);
if ($_SERVER["REQUEST_METHOD"] == "OPTION") {
    header("Access-Control-Allow-Origin: safari-extension://org.playmorph.siouxtrack-ps35583y5s\n");
    header("Access-Control-Allow-Headers: Content-Type\n\n");
    exit(1);
}
else {
    logbug("Taille POST: ".$_SERVER["CONTENT_LENGTH"]);
}

$eventCount = 0;
$docSuiteCount = 0;
$docBlobCount = 0;
$docSuiteMax = 0;

$trace = file_get_contents('php://input');  // $HTTP_RAW_POST_DATA
$events = json_decode($trace);

$stb->autocommit(FALSE);
$stb->query("SET NAMES 'utf8'");
$stb->query("SET GLOBAL max_allowed_packet=16*1024*1024");

for ($i=0; $i < count($events); $i++) {
    for ($j=0; $j < count($events[$i]); $j++) {
        if (isset($events[$i][$j])) $events[$i][$j] = $stb->escape_string($events[$i][$j]);
        else $events[$i][$j] = "";
    }
///////////////////////////////////////////////////////////////////////////    
    $props = $events[$i];   
    if ($props[1] == "newSession") {

        $query = "INSERT INTO Session VALUES ("     
        . "NULL,'"
        . $props[0] . "','"      # sessionId
        . $_SERVER["REMOTE_ADDR"] . "','"     # clientIP
        . $props[2] . "','"             # userId
        . $props[3] . "','"             # date
        . $props[4] . "','"             # time
        . $props[5] . "','"             # serverURL
        . $props[6] . "','"             # recButton
        
        . $props[36] . "','"             # autoRecord
        
        . $props[7] . "','"             # stateBar
        . $props[8] . "','"             # maxEvents
        . $props[9] . "','"             # minStation
        . $props[10] . "','"             # mouseMove
        . $props[11] . "','"             # mouseOver
        . $props[12] . "','"             # mouseOut
        . $props[13] . "','"             # mouseWheel
        . $props[14] . "','"             # scroll
        
        . $props[16] . "','"             # html
        . $props[15] . "','"             # png
        
        . $props[33] . "','"             # pngPlus        
        . $props[34] . "','"             # pngReduc
        . $props[35] . "','"             # noHTTPS
        
        . $props[17] . "','"             # regExp1
        . $props[18] . "','"             # regExp2
        . $props[19] . "','"             # regExp3
        . $props[20] . "','"             # regExp4
        . $props[21] . "','"             # regExp5
        . $props[22] . "','"             # regExp6
        . $props[23] . "','"             # regExp7
        . $props[24] . "','"             # regExp8
        . $props[25] . "','"             # regExp9
        . $props[26] . "','"             # regExp10
        . $props[27] . "','"             # freeField1
        . $props[28] . "','"             # freeField2
        . $props[29] . "','"             # freeField3
        . $props[30] . "','"             # freeField4
        . $props[31] . "','"             # freeField5
        . $props[32] . "')";             # version
        
        $result = $stb->query($query);                        // Ecriture Session *****            
        if (!$result) {
            $err = $stb->error;
            $stb->rollback();
            logbug("--------------------------[Session erreur] $err");
            logbug('query: ' . $query);
            header("SebStatus: 500");
            header("SebError: [Session erreur] $err");
            exit(1);
        }
        else {
            logbug("Insert Session. Id: " . $_SERVER["REMOTE_ADDR"] . " " . $props[0]);
        }
        continue;
    }
/////////////////////////////////////////////////////////////////////////
//    $png = ($props[21] != "") ? $props[46] : $props[21];

    $query = "INSERT INTO Event (sessionId, clientIP, userId, eventIndex, timeStamp, date, time, type, target, docURL, docTitle, targetTitle, station, winDoc, winTabCard, winIndex, tabIndex, winInnerHeight, winInnerWidth, winOuterHeight, winOuterWidth, winPageXOffset, winPageYOffset, winScreenX, winScreenY, screenHeight, screenWidth) VALUES (" . "'"         
    . $props[55] . "','"        # sessionId
    
    . $_SERVER["REMOTE_ADDR"] . "','"    # clientIP  
    . $props[0] . "','"        # userId
    
    . $props[54] . "','"        # eventIndex
    
    . $props[1] . "','"        # timeStamp
    . $props[2] . "','"        # date
    . $props[3] . "','"        # time
    . $props[4] . "','"        # type
    . $props[5] . "','"        # target
    
    . $props[11] . "','"       # docURL
    
    . $props[13] . "','"       # docTitle
    
    . $props[20] . "','"       # targetTitle
    
    . $props[23] . "','"       # station 
    
    . $props[24] . "','"       # winDoc
    
    . $props[9] . "','"       # winTabCard
    . $props[7] . "','"       # winIndex
    . $props[8] . "','"       # tabIndex
    . $props[64] . "','"       # winInnerHeight
    . $props[65] . "','"       # winInnerWidth
    . $props[66] . "','"       # winOuterHeight
    . $props[67] . "','"       # winOuterWidth
    . $props[68] . "','"       # winPageXOffset
    . $props[69] . "','"       # winPageYOffset
    . $props[70] . "','"       # winScreenX
    . $props[71] . "','"       # winScreenY
    . $props[72] . "','"       # screenHeight
    . $props[73] . "')";       # screenWidth
    
    $currentUser = $props[0];
    
    $result = $stb->query($query);                               # Ecriture Event *****
    if (!$result) {
        $stb->rollback();
        $err = $stb->error;
        logbug("--------------------------[Event erreur] $err");
        logbug("query: " . $query);
        header("SebStatus: 500");
        header("SebError: [Event erreur] $err");
        exit(1);
    }
    else {
        $eventCount += $stb->affected_rows;
    }

//..........................................................................
    $query = "SELECT @last := LAST_INSERT_ID()";
    $stb->query($query);             # Ecriture variable foreign key @last
                
//...........................................................................   
    if ($props[24] == "doc") {
        $docSuiteMax++;
        
        if ($props[60] == '\0') $props[60] = "";
        
        $query = "INSERT INTO DocSuite VALUES ("    
        . "NULL, @last,'"
        . $props[10] . "','"            # docDomain
        
        . $props[12] . "','"            # docReferrer
        
        . $props[14] . "','"            # targerClassName
        . $props[15] . "','"            # targetLocalName
        . $props[16] . "','"            # targetType
        . $props[17] . "','"            # targetNameSpaceURI
        . $props[18] . "','"            # targetDefaultValue
        . $props[19] . "','"            # targetValue
        
        . $props[25] . "','"            # relatedTarget
        . $props[26] . "','"            # targetRectB
        . $props[27] . "','"            # targetRectH
        . $props[28] . "','"            # targetRectL
        . $props[29] . "','"            # targetRectR
        . $props[30] . "','"            # targetRectT
        . $props[31] . "','"            # targetRectW
        . $props[32] . "','"            # docRectB
        . $props[33] . "','"            # docRectH
        . $props[34] . "','"            # docRectL
        . $props[35] . "','"            # docRectR
        . $props[36] . "','"            # docRectT
        . $props[37] . "','"            # docRectW
        . $props[38] . "','"            # clientX
        . $props[39] . "','"            # clientY
        . $props[40] . "','"            # pageX
        . $props[41] . "','"            # pageY
        . $props[42] . "','"            # screenX
        . $props[43] . "','"            # screenY
        . $props[44] . "','"            # src
        . $props[45] . "','"            # checked
        
        . $props[47] . "','"            # href
        . $props[48] . "','"            # name
        . $props[49] . "','"            # autoPlay
        . $props[50] . "','"            # currentSrc
        . $props[51] . "','"            # muted
        . $props[52] . "','"            # paused
        . $props[53] . "','"            # poster

        . $props[56] . "','"            # altKey
        . $props[57] . "','"            # ctrlKey
        . $props[58] . "','"            # metaKey
        . $props[59] . "','"            # shiftKey
        . $props[60] . "','"            # char
        . $props[61] . "','"            # charCode
        . $props[62] . "','"            # keyCode
        . $props[63]                    # button
        . "')";
        
        $result = $stb->query($query);                       # Ecriture DocSuite *****    
        if (!$result) {
            $stb->rollback();
            $err = $stb->error;
            logbug("--------------------[DocSuite erreur] $err");
            logbug("query: " . $query);
            header("SebStatus: 500");
            header("SebError: [DocSuite erreur] $err");
            exit(1);
        }
        else {
            $docSuiteCount += $stb->affected_rows;
        }
//..................................................................
        if (!($props[21] == "") || !($props[22] == "") || !($props[46] == "")) {
            $query = "INSERT INTO DocBlob VALUES ("     
            . "NULL, @last,'"
            . $props[22] . "','"            # outerHTML 
            . $props[21] . "','"            # htmlTag
        
            . $props[46] . "')";            # png
        
            $result = $stb->query($query);                        # Ecriture DocBlob *****
            if (!$result) {
                $stb->rollback();
                $err = $stb->error;
                logbug("-------------------[DocBlob erreur] $err");
                logbug($props[21]);
                logbug($props[22]);
                header("SebStatus: 500");
                header("SebError: [DocBlob erreur] $err");
                exit(1);
            }
            else {
                $docBlobCount += $stb->affected_rows;
            }
//............................................................ Ecriture blobId dans Event
            $query = "SELECT @lastBlobId := LAST_INSERT_ID()";
            $stb->query($query);             # Ecriture variable foreign key @lastBlobId 
            
            $query = "UPDATE Event SET blobId = @lastBlobId WHERE id = @last";
            $stb->query($query);             # Ecriture blobId dans Event
        }
    }
}

$stb->commit();
$stb->close();     #  fermeture base
header("SebStatus: 200");

logbug("UserId: " . $_SERVER["REMOTE_HOST"] . $currentUser);
logbug("Insert Event: " . $eventCount . " sur " . count($events));
logbug("Insert DocSuite: " . $docSuiteCount . " sur " . $docSuiteMax);
logbug("Insert DocBlob: " . $docBlobCount . " sur " . $docSuiteMax);

//"Access-Control-Allow-Origin: *\n";
//"Access-Control-Allow-Origin: safari-extension://org.playmorph.siouxtrack-ps35583y5s\n";
//"Content-Type: text/plain; charset=utf8\n\n";

logbug("ADIOS!   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
// logbug(print_r($events, true));
?>

