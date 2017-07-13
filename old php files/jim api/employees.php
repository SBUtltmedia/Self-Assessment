<?

//employees (get)

function employees($argv){
	global $isAdmin;
	if(count($argv)==0)
	{
		$dir = "../data/users";
		return getMultipleJSON($dir); 
	} 
	//employees/hour-preferences (GET)
	if(count($argv)==1)

	{       
		if($argv[0]=="hour-preferences"){
			$dir = "../data/preferredTimes";
		} 
		else if ($argv[0]=="status"){
			$dir = "../data/status";
		}
		if ($isAdmin){
			//  employess/status  (POST) hacky fallthough
			if(!isset($dir))
			{

				$json = json_decode($argv[0]);
				foreach($json as $person){
					$file="../data/status/".$person->netId.".json";
					if($person->netId!=""){
						file_put_contents($file,json_encode($person));
					}
				}
				return "../data stored";

			}




			//$dir = "../data/preferredTimes";
			return getMultipleJSON($dir); 	
		}
		else{
			return '{"status":"notAdmin"}';
		}
	}






	if(count($argv)==2)
	{

		if($isAdmin||$_SERVER['cn']==$argv[0])
		{

			//employees/:netid/hour-preferences (GET)
			if($argv[1]=="hour-preferences")
			{
				$file="../data/preferredTimes/".$argv[0].".json";
				if(file_exists($file))
				{
					$json=file_get_contents($file);
					return $json; 
				}
				else {
					$hourPref=new stdClass();
					$employee = new stdClass();
					$employee->netId=$_SERVER['cn'];
					$employee->firstName=$_SERVER['nickname'];
					$employee->lastName=$_SERVER['sn'];
					$employee->email=$_SERVER['mail'];
					$hourPref->items=array();
					$hourPref->employee=$employee;
					$hourPref->locationOrder=array();
					return json_encode($hourPref);
				}
			}

			//employees/:netid/status (GET)
			elseif($argv[1]=="status")
			{
				$file="../data/status/".$argv[0].".json";
				if(file_exists($file))
				{       
					$json=file_get_contents($file);
					return $json; 
				}
				else{
					$status=new stdClass();
					$status->group="";
					$status->probation="";
					$status->priority=1;
					return json_encode($status);

				}  
			}
		}	
		else return '{"status":"notAdmin"}';
	}

	if(count($argv)==3)
	{

		//employees/:netid/hour-preferences (POST)

		if($isAdmin||$_SERVER['cn']==$argv[0])
		{
			$json = json_decode($argv[2]);
			if($argv[1]=="hour-preferences"){	
				$locOrder=range(1,15);	
				shuffle($locOrder);
				if(!$isAdmin){
					$employee = new stdClass();
					$employee->netId=$_SERVER['cn'];
					$employee->firstName=$_SERVER['nickname'];
					$employee->lastName=$_SERVER['sn'];
					$employee->email=$_SERVER['mail'];
					$json->employee = $employee;
					$json->locationOrder = $locOrder;
					$json->sitesManaged = array();
				}
				file_put_contents("../data/preferredTimes/".$argv[0].".json",json_encode($json));
				return json_encode($json);
			}
			elseif($argv[1]=="status" && $isAdmin){

				file_put_contents("../data/status/".$argv[0].".json",json_encode($json));
			return $argv[0]." status saved";
			}
		}
		else return '{"status":"notAdmin"}';

	}


}

function getMultipleJSON($path){
	$students = array();
	$pushdir=getcwd();
	chdir($path);
	$dirs = glob("*");
	foreach($dirs as $dir) {
		$student = json_decode(file_get_contents($dir));
		$student->netId= str_replace(".json","",$dir);
		array_push($students, $student);
	}
	chdir($pushdir);
	return json_encode($students);
}

?>
