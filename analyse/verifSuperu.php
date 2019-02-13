<?php
session_start();
header("content-type:text/plain");
if ($_SESSION['username'] == 'RedBird') echo 'OK';
else if (isset($_SESSION['username']) && ($_SESSION['username'] != ''))
		echo $_SESSION['username'];
else echo 'Bad username';
?>