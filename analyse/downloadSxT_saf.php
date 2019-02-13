<?php
header('Content-Type: application/octet-stream;');
header('Content-Disposition: attachment; filename=../SiouXtrack.safariextz;');
header('Content-Length: '.filesize("../SiouXtrack.safariextz").';');
readfile("../SiouXtrack.safariextz");
?>