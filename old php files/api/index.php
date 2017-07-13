<?php
$path =dirname($_SERVER['SCRIPT_FILENAME']);
require "$path/vendor/autoload.php";
require "$path/getQuestions.php";
require "$path/getUserInfo.php";
require "$path/setQuestions.php";
require "$path/wipeQuestions.php";
$app = new \Slim\Slim();
$body= $app->request()->getBody();

$app->get('/permissions', function (){
        print json_encode(getStatus());
});


$app->get('/info', function (){
        print file_get_contents("../data/info.json");
});
$app->post('/info', function (){
                global $body;
                file_put_contents("../data/info.json",$body);
});

$app->get('/user', function (){
		$argv=array();
		print user($argv);
});

$app->get('/employees', function (){
		$argv=array();
		print employees($argv);
});

$app->get('/employees/hour-preferences', function (){
        $argv=array("hour-preferences"); //not used but brings args to 1
        print employees($argv);
});
$app->get('/employees/status', function (){
        $argv=array("status"); //not used but brings args to 1
        print employees($argv);
});




$app->get('/employees/:netid/:item', function ($netid,$item) use($app){


		$argv=array($netid,$item);
		if($item=="schedule")
		{

  		  print getSchedule($netid);

		}


		else{


            print employees($argv);
		}
		});


$app->post('/employees/:netid/:item', function ($netid,$item){
		global $body;
		$argv=array($netid,$item,$body);
		print employees($argv);
});

$app->post('/employees/status', function (){
                global $body;
                $argv=array($body);
                print employees($argv);
});

$app->get('/locations', function (){
		$argv=array();
		print locations($argv);
});

$app->get('/locations/:id', function ($id){
                $argv=array($id);
                print locations($argv);
});

$app->get('/locations/:id/:item', function ($id,$item){
		$argv=array($id,$item);
		print locations($argv);
});

$app->post('/locations/:id', function ($id){
		global $body;
		$argv=array($id,$body);
		print locations($argv);
});

$app->post('/slots', function (){
		global $body;
		$argv=array($body);
		print slots($argv);
});

$app->get('/slots', function (){
		global $body;
		$argv=array();
		print slots($argv);
});



$app->post('/schedules', function (){
        global $body;
        $argv=array($body);
        print schedules($argv);
});

$app->get('/schedules', function (){
        $argv=array();
        print schedules($argv);
});

$app->get('/schedules/:netid', function ($netid){
    print getSchedule($netid);
});
/*

   $app->get('/userdata/users/:users/', function ($name) {
   });
   $app->get('/userdata/users/:users/:userYear/', function ($name,$year) {
   });
   $app->get('/companydata/:year', function ($year) {
   });
 */

$app->run();
?>
