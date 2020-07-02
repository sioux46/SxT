<?php
$nom = $_POST['nom'];
$mdp = $_POST['mdp'];

if((!isset($nom)) || (!isset($mdp))) {
?>

    <form method="post" action="./verifGlobalPathTest.php">
        <p>Nom: <input type="text" name="nom"></p>
        <p>Mot de passe: <input type="password" name="mdp"></p>
        <p><input type="submit" name="submit" value="Connection"></p>
    </form>

<?php
}
else if (($nom == 'lution2012') && ($mdp == 'lutin2012')) {
    echo 'YES';
}
else echo 'NO';
?>
