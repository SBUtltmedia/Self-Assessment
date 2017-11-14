<?php

$path = explode("/api", dirname($_SERVER['SCRIPT_FILENAME']));
$path = $path[0];
global $path;

require "$path/api/vendor/autoload.php";
require "$path/api/getQuestions.php";
require "$path/api/getUserInfo.php";
require "$path/api/setQuestions.php";
require "$path/api/wipeQuestions.php";
require "$path/api/isAdmin.php";
require "$path/api/list.php";

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

$app->get('/getTeachers', function (){

    getTeachers();
    exit;

});

$app->get('/getClasses/:teacher', function ($teacher){

    getClasses($teacher);
    exit;

});

$app->get('/getSettings/:teacher/:classes', function ($teacher,$classes){

    getSettings($teacher,$classes);
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
