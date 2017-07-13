<?

function getUser(){

    $userInfo = array();
    $userInfo["firstName"] = $_SERVER['nickname'];
    $userInfo["sn"] = $_SERVER['sn'];
    $userInfo["cn"] = $_SERVER['cn'];
    $userInfo["mail"] = $_SERVER['mail'];
    $structure = "../data/".$_SERVER["cn"];

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

  if($_SERVER["cn"]==$netId || $permissions["admin"]){

    $userInfo = array();
    $userInfo["firstName"] = $_SERVER['nickname'];
    $userInfo["sn"] = $_SERVER['sn'];
    $userInfo["cn"] = $_SERVER['cn'];
    $userInfo["mail"] = $_SERVER['mail'];
    $structure = "../data/".$_SERVER["cn"];

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
  $structure = "../data/".$_SERVER["cn"]."/userSettings.json";

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
  $structure = "../data/".$_SERVER["cn"]."/userSettings.json";

  if($_SERVER["cn"]==$netId || $permissions["admin"]){

      file_put_contents($structure,$body);
      $preferences = file_get_contents($structure);
      print_r($preferences);

  }

}
?>
