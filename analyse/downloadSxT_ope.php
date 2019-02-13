<?php
header('Content-Type: application/octet-stream;');
header('Content-Disposition: attachment; filename=SiouXtrack.oex;');
header('Content-Length: '.filesize("../opera/SiouXtrack.oex"));
readfile("../opera/SiouXtrack.oex");
?>