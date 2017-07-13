<?
$user=array();
$userInfo = array();
$user["firstName"] = $_SERVER['nickname'];
$user["sn"] = $_SERVER['sn'];
$userInfo["firstName"] = $_SERVER['nickname'];
$userInfo["sn"] = $_SERVER['sn'];
$userInfo["cn"] = $_SERVER['cn'];
$userInfo["mail"] = $_SERVER['mail'];
$structure = "../data/".$_SERVER["cn"];

if(file_exists($structure)){

#read data here

$files = glob($structure."/*.json", GLOB_BRACE);

foreach ($files as $file) {
$filePath = basename($file);
$user[] = $filePath;
}

}else{

#make folders
if (!mkdir($structure, 0777, true)) {
    die('Failed to create folders...');
}

}

file_put_contents($structure."/userInfo.json",json_encode($userInfo));

print_r(json_encode($user));
?>
