<?
function getStatus()
{
	$user=$_SERVER['cn'];
        $adminData = json_decode(file_get_contents("../data/admins.json"));
        $permissions=array();
	$permissions["admin"] = in_array($user,$adminData -> admins);
	$permissions["superUser"]= in_array($user,$adminData -> superUsers);
}

	return $permissions;
}


print_r(json_encode(getStatus()));

?>
