<?

$recievedData = $_POST["data"];
$structure = "../data/".$_SERVER["cn"]."/*";

$files = glob($structure); // get all file names

foreach($files as $file){ // iterate files
  if(is_file($file))
    unlink($file); // delete file
}

exit;
?>
