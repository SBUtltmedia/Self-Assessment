<?
function setQuestion($body,$netId,$questionId){
global $permissions;
global $path;
if($_SERVER["cn"]==$netId || $permissions["superUser"]){

  $structure = $path."/data/".$netId."/".$questionId.".json";

    file_put_contents($structure,$body);
    $question = file_get_contents($structure);
    print_r($question);

}
}
?>
