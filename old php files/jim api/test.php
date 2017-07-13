<?
$locations= exec("php locations.php ''");
print getcwd() . " " . dirname($_SERVER['SCRIPT_FILENAME']);

?>
