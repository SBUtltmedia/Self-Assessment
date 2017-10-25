<?
function wipeQuestion($netId){
global $permissions;
global $path;

if($_SERVER["cn"]==$netId || $permissions["admin"]){


$structure = $path."/data/".$netId."/*";

$files = glob($structure); // get all file names

foreach($files as $file){ // iterate files
  if(is_file($file) && strpos(basename($file), 'sec_') !== false){
    unlink($file); // delete file
      }
    }
  }
}
?>
