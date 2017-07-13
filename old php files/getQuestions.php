<?
$id = $_POST["id"];
$recievedData = $_POST["data"];
$structure = "../data/".$_SERVER["cn"]."/".$id.".json";

if(file_exists($structure)){

  $question = file_get_contents($structure);
  print_r($question);

}else{

  file_put_contents($structure,$recievedData);
  $question = file_get_contents($structure);
  print_r($question);

}
?>
