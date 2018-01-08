<?

	function getTeachers(){
		global $path;

		$structure = $path."/surveys";
		$surveys = array();

		if(file_exists($structure)){

			$files = glob($structure."/*", GLOB_ONLYDIR);

			foreach ($files as $file) {
				$filePath = basename($file);
				$surveys[] = $filePath;
			}

		}else{

			if (!mkdir($structure, 0777, true)) {
				die('Failed to create folders...');
			}

		}

		file_put_contents($structure."/teachers.json",json_encode($surveys));

		print_r(json_encode($surveys));

	}

	function getClasses($teacher){
		global $path;

		$structure = $path."/surveys"."/".$teacher;
		$surveys = array();

		if(file_exists($structure)){

			$files = glob($structure."/*", GLOB_ONLYDIR);

			foreach ($files as $file) {
				$filePath = basename($file);
				$surveys[] = $filePath;
			}

		}else{

			if (!mkdir($structure, 0777, true)) {
				die('Failed to create folders...');
			}

		}

		file_put_contents($structure."/classes.json",json_encode($surveys));

		print_r(json_encode($surveys));

	}

	function getSettings($teacher,$classes){
		global $path;

		$structure = $path."/surveys"."/".$teacher."/".$classes."/"."settings.json";

		if(file_exists($structure)){
			$preferences = file_get_contents($structure);
			print_r($preferences);
		}else{
				print_r("NOPE");
		}

	}

	function setSettings($body,$teacher,$classes){
		global $path;

		$structure = $path."/surveys"."/".$teacher."/".$classes."/"."settings.json";

		if($classes == "Temporary"){
			$data = json_decode($body);
			$structure = $path."/surveys"."/".$teacher."/".$data->course."-".$data->courseNumber."-SEC".$data->courseSection;

			if(file_exists($structure)){

			}else{
				if (!mkdir($structure, 0777, true)) {
					die('Failed to create folders...');
				}else{
					removedir($path."/surveys"."/".$teacher."/".$classes);


					`cp -r ../siteFiles/EmptyProject/*  $structure`;


					$structure = "$structure/settings.json";
					file_put_contents($structure,$body);
					$preferences = file_get_contents($structure);
					print_r($preferences);
				}
			}

		}else{
			file_put_contents($structure,$body);
			$preferences = file_get_contents($structure);
			print_r($preferences);
		}

	}

function removedir($dirname)
	 {
			 if (is_dir($dirname))
			 $dir_handle = opendir($dirname);
			 if (!$dir_handle)
			 return false;
			 while($file = readdir($dir_handle)) {
					 if ($file != "." && $file != "..") {
							 if (!is_dir($dirname."/".$file))
							 unlink($dirname."/".$file);
							 else
							 {
									 $a=$dirname.'/'.$file;
									 removedir($a);
							 }
					 }
			 }
			 closedir($dir_handle);
			 rmdir($dirname);
			 return true;
	 }

	function deleteSurvey($body,$teacher,$classes){
		global $path;

		$structure = $path."/surveys"."/".$teacher."/".$classes;
		print($body);
		// if($body){
		// 	print("Poof");
		// }

	}

	function addTeacher(){
		global $path;
		$structure = $path."/surveys"."/".$_SERVER['cn'];

		if(file_exists($structure)){

		}else{

			if (!mkdir($structure, 0777, true)) {
				die('Failed to create folders...');
			}

		}

	}

	function addClass(){
		global $path;
		$structure = $path."/surveys"."/".$_SERVER['cn']."/Temporary";

		if(file_exists($structure)){

		}else{

			if (!mkdir($structure, 0777, true)) {
				die('Failed to create folders...');
			}else{

			}

		}

	}

?>
