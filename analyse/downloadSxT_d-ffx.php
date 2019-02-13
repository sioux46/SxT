<?php
header('Content-Type: application/x-xpinstall;');
header('Content-Disposition: attachment; filename=siouxtrack.xpi;');
header('Content-Length: ' . filesize('../firefox/siouxtrack.xpi'));
readfile('../firefox/siouxtrack.xpi');
?>