<?

function user($argv) {	
	global $isAdmin;
	if(count($argv)==0){
		$userData = new stdClass();
		$userData -> firstName = $_SERVER['nickname'];
		$userData -> lastName = $_SERVER['sn'];
		$netid = $_SERVER['cn'];
		$userData -> netId = $netid;
		$userData -> email = $_SERVER['mail'];
		//$adminData = json_decode(file_get_contents("../data/admins.json"));
		$userJson=json_encode($userData); 
		file_put_contents("../data/users/" . $netid,$userJson );
		return $userJson;

	}
}
?>
