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


?>
