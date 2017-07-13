<?
global $isAdmin;
if (php_sapi_name() == "cli") {
	$isAdmin=true;
	$args=json_decode($argv[1]);
	chdir("../api");
	print locations($args);
}

function schedules($args) {
	global $isAdmin;
    if ($isAdmin) {
        if (count($args)==0){
            $json = array();
            $dirs = glob("../data/schedule/*.json");
            foreach ($dirs as $dir) {
                array_push($json, json_decode(file_get_contents($dir)));
            }
            return json_encode($json);
        }
        if (count($args) == 1) {
	    array_map('unlink',  glob("../data/schedule/*.json"));
            $json = json_decode($args[0]);
            $schedules = array();
            foreach ($json as $item) {
                $users = $item -> value;
                foreach ($users as $user) {
                    $id = $user -> netId;
                    if (!isset($schedules[$id])) {
                        $schedules[$id] = array();
                    }
                    array_push($schedules[$id], $item);
                }
            }
            foreach ($schedules as $netID => $schedule) {
                file_put_contents("../data/schedule/$netID.json", json_encode($schedule));
            }
        }
    }
}

function getSchedule($netid) {
    global $isAdmin;
    if ($isAdmin || $_SERVER['cn'] == $netid) {
        $path = "../data/schedule/$netid.json";
        if (file_exists($path)) {
            return file_get_contents($path);
        }
	else {
	//$shifts = new stdClass();
        $shifts=array();
	
	return json_encode($shifts);  
    }

}
}




?>
