<?
function setQuestion($body,$netId,$survey,$questionId){
global $permissions;
global $path;
if($_SERVER["cn"]==$netId || $permissions["superUser"]){

  $structure = $path."/data/".$netId."/".$survey."/".$questionId.".json";

    file_put_contents($structure,$body);
    $question = file_get_contents($structure);
    print_r($question);

}
}

function setCompleted($netId,$survey){
  global $path;

  if($_SERVER["cn"]==$netId || $permissions["superUser"]){

    $structure = $path."/data/".$netId."/".$survey."/complete.json";

    if(file_exists($structure)){

    }else{
      if (!mkdir($structure, 0777, true)) {
        die('Failed to create folders...');
      }else{}
    }

  }
}
?>
