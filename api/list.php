<?

	function getTeachers(){
		global $path;
		global $permissions;

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

		if($permissions["superUser"]){
			print_r(json_encode($surveys));
		}else{
			$surveysSingle = array();
			$surveysSingle[] = $_SERVER["cn"];
			print_r(json_encode($surveysSingle));
		}

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

	function getGrades($teacher,$classes){
		global $path;

		$structure = $path."/surveys"."/".$teacher."/".$classes."/data";

		if(file_exists($structure)){

			$surveys = array();
			$files = glob($structure."/*", GLOB_ONLYDIR);

			foreach ($files as $file) {
				$user = array();
				$user["name"] = basename($file);
				$filesUser = glob("$structure/".basename($file)."/*", GLOB_ONLYDIR);
				foreach ($filesUser as $fileTwo) {
					$surveyName="Survey ".basename($fileTwo);
					$filesQuiz = $structure."/".basename($file)."/".basename($fileTwo)."/complete.json";
					if(file_exists($filesQuiz)){
						$grade = 1;
					}else{
						$grade = 0;
					}
					$user[$surveyName] = $grade;
				}
				$surveys[] = $user;
			}

			print_r(json_encode($surveys));
		}else{
			print_r("NOPE");
		}

	}

	function getAllAnswers($teacher,$classes){
		global $path;

		$structure = $path."/surveys"."/".$teacher."/".$classes."/data";

		if(file_exists($structure)){

			$surveys = array();
			$files = glob($structure."/*", GLOB_ONLYDIR);

			foreach ($files as $file) {
				$user = array();
				$user[] = basename($file);
				$fileSettings = $structure."/".basename($file)."/userSettings.json";
				if(file_exists($fileSettings)){
					$settingsDoc = file_get_contents($fileSettings);
					$usableSettings = json_decode($settingsDoc);
					$user[] = $usableSettings->emailAddress;
					if($usableSettings->consentOption == 1){
						$filesUser = glob($structure."/".basename($file)."/*", GLOB_ONLYDIR);
						foreach ($filesUser as $fileTwo) {
							$grade = array();
							$grade[] = "Survey ".basename($fileTwo);
							$filesQuiz = glob($structure."/".basename($file)."/".basename($fileTwo)."/*");
							foreach ($filesQuiz as $fileThree) {
								$quizGrade = file_get_contents($fileThree);
								$grade[] = json_decode($quizGrade);
							}
							$user[] = $grade;
						}
						$surveys[] = $user;
					}
				}
			}

			print_r(json_encode($surveys));
		}else{
			print_r("NOPE");
		}

	}



?>
