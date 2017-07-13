<?
global $isAdmin;
global $permissions;
if (php_sapi_name() == "cli") {
	$isAdmin=true;
	$args=json_decode($argv[1]);
	chdir("../api");
	print locations($args);
}


function locations($args) {
	global $isAdmin;	
	//locations	
	if(count($args)==0){
		$allLocations=array();
		$locations=glob("../data/locations/*.json");
		foreach($locations as $location){
			array_push($allLocations,json_decode(file_get_contents($location)));
		}
		#return getcwd(); 
		return json_encode($allLocations);

	}


	if(count($args)==1){

	}
	//locations/:id (GET)
	if (count($args)==1){
		$json = file_get_contents("../data/locations/".$args[0].".json");
		return $json;
	}
	//locations/:id (POST)
	if (count($args)==2){
		if(in_array($args[0],$permissions->sitesManaged)){
		$isSiteManager=True; 
		}

		if($isAdmin || $isSiteManager) {
			file_put_contents("../data/locations/".$args[0].".json", $args[1]);
			return "";
		}
		else return "Not Admin"; 
	}
}
?>
