<?
$id = $_POST["id"];
$recievedData = $_POST["data"];
$structure = "../data/".$_SERVER["cn"]."/".$id.".json";

  file_put_contents($structure,$recievedData);
  $question = file_get_contents($structure);
  print_r($question);
?>
