<?php
//$mdp = file_get_contents('php://input');
$mdp = $HTTP_RAW_POST_DATA;
if(isset($mdp)) {
    if ($mdp == 'lutin2012') echo 'YES';
    else echo 'NO';
}
else echo 'NOT SET';
?>