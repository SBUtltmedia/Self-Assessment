<?

function getUser(){
global $path;

    $userInfo = array();
    $userInfo["firstName"] = $_SERVER['nickname'];
    $userInfo["sn"] = $_SERVER['sn'];
    $userInfo["cn"] = $_SERVER['cn'];
    $userInfo["mail"] = $_SERVER['mail'];
    $structure = $path."/data/".$_SERVER["cn"];

  if(file_exists($structure)){

    $files = glob($structure."/*.json", GLOB_BRACE);

    foreach ($files as $file) {
      $filePath = basename($file);
      $userInfo[] = $filePath;
    }

  }else{

    if (!mkdir($structure, 0777, true)) {
      die('Failed to create folders...');
    }

  }

  file_put_contents($structure."/userInfo.json",json_encode($userInfo));

  print_r(json_encode($userInfo));


}

function getUserInfo($netId){
  global $permissions;
  global $path;

  if($_SERVER["cn"]==$netId || $permissions["admin"]){

    $userInfo = array();
    $userInfo["firstName"] = $_SERVER['nickname'];
    $userInfo["sn"] = $_SERVER['sn'];
    $userInfo["cn"] = $_SERVER['cn'];
    $userInfo["mail"] = $_SERVER['mail'];
    $structure = $path."/data/".$_SERVER["cn"];

  if(file_exists($structure)){

    $files = glob($structure."/*.json", GLOB_BRACE);

    foreach ($files as $file) {
      $filePath = basename($file);
      $userInfo[] = $filePath;
    }

  }else{

    if (!mkdir($structure, 0777, true)) {
      die('Failed to create folders...');
    }

  }

  file_put_contents($structure."/userInfo.json",json_encode($userInfo));

  print_r(json_encode($userInfo));

  }

}

function getUserPreferences($netId){
  global $permissions;
  global $path;
  $structure = $path."/data/".$_SERVER["cn"]."/userSettings.json";

  if($_SERVER["cn"]==$netId || $permissions["admin"]){

    if(file_exists($structure)){
      $preferences = file_get_contents($structure);
      print_r($preferences);
    }else{
        print_r("NOPE");
    }
  }

}

function setUserPreferences($body,$netId){
  global $permissions;
  global $path;
  $structure = $path."/data/".$_SERVER["cn"]."/userSettings.json";

  if($_SERVER["cn"]==$netId || $permissions["admin"]){

      file_put_contents($structure,$body);
      $preferences = file_get_contents($structure);
      print_r($preferences);

  }

}

function getCurrentSurvey($netId){
  global $permissions;
  global $path;

  if($_SERVER["cn"]==$netId || $permissions["superUser"]){
    $structure = $path."/settings.json";
    $dates = file_get_contents($structure);
    $datesCheck = json_decode($dates);
    $datesCheckArray = $datesCheck->dates;

    date_default_timezone_set('America/New_York');
    $today = date('m/d/Y', time());

    $survey = 1;
    $surveyVersion = 0;
    $index = 3;

    foreach ($datesCheckArray as &$value) {

      if(date("Y-m-d", strtotime($value)) < date("Y-m-d")){
        if($index > count($datesCheckArray)){
          $survey++;
        }else{
          $survey = 2;
          $surveyVersion++;
          $index++;
        }
      }

    }

    if($survey < 4){
      if($survey == 2 && $surveyVersion > 1){
        $structure = $path."/data/".$netId."/".$survey."-".$surveyVersion;
      }else{
        $structure = $path."/data/".$netId."/".$survey;
      }
    }

    if(!file_exists($structure)){
      if (!mkdir($structure, 0777, true)) {
        die('Failed to create folders...');
      }
    }

    print_r($survey);
    print_r(",");
    print_r($surveyVersion);
  }

}
?>
