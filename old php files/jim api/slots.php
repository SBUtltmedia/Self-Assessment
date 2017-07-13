<?
global $isAdmin;
if (php_sapi_name() == "cli") {
	$isAdmin=true;
	$args=json_decode($argv[1]);
	chdir("../api");
	print locations($args);
}



function slots($args) {


	global $isAdmin;
	 if(count($args)==0){
                $json = file_get_contents("../data/slots.json");
                return $json;
        }


	if(count($args)==1){
 file_put_contents("../data/slots.json", $args[0]);
	}
	
}

?>
