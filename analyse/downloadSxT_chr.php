<?php
header('Content-Type: application/octet-stream;');
//header('Content-Type: application/x-chrome-extension;');
header('Content-Disposition: attachment; filename=SiouXtrack.crx;');
header('Content-Length: '.filesize("../chrome/SiouXtrack.crx").';');
readfile("../chrome/SiouXtrack.crx");
?>