<?php
//error_reporting(E_ERROR);
session_start();
header('Content-Type: application/octet-stream;');
header("Content-Disposition: attachment; filename=sXtQuery" . date('y.m.d-H:i:s') . ".csv;");
header('Content-Length: '.filesize("sXtQuery.csv").';');
readfile("sXtQuery.csv");
?>