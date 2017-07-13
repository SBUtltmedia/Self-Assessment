<?php
$path =dirname($_SERVER['SCRIPT_FILENAME']);
require "$path/vendor/autoload.php";
require "$path/getQuestions.php";
require "$path/getUserInfo.php";
require "$path/setQuestions.php";
require "$path/wipeQuestions.php";
require "$path/isAdmin.php";

$permissions = getStatus();
$app = new \Slim\Slim();
$body= $app->request()->getBody();


$app->get('/wipeQuestions/:netId', function ($netId){

        wipeQuestion($netId);
        exit;

});
$app->post('/getQuestion/:netId/:questionId', function ($netId,$questionId){
      global $body;

      getQuestion($body,$netId,$questionId);
      exit;

});

$app->post('/setQuestion/:netId/:questionId', function ($netId,$questionId){
            global $body;

           setQuestion($body,$netId,$questionId);
           exit;
});

$app->get('/getUserInfo/:netId', function ($netId){

    getUserInfo($netId);
    exit;

});

$app->get('/getUser', function (){

    getUser();
    exit;

});

$app->get('/getUserPreferences/:netId', function ($netId){

    getUserPreferences($netId);
    exit;

});

$app->post('/setUserPreferences/:netId', function ($netId){
    global $body;

    setUserPreferences($body,$netId);
    exit;

});


$app->run();
?>
