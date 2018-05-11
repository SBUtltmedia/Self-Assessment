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
$app->post('/getQuestion/:netId/:survey/:questionId', function ($netId,$survey,$questionId){
      global $body;

      getQuestion($body,$netId,$survey,$questionId);
      exit;

});

$app->post('/setQuestion/:netId/:survey/:questionId', function ($netId,$survey,$questionId){
            global $body;

           setQuestion($body,$netId,$survey,$questionId);
           exit;
});

$app->get('/setCompleted/:netId/:survey', function ($netId,$survey){

            setCompleted($netId,$survey);
            exit;
});

$app->get('/getCurrentSurvey/:netId', function ($netId){

    getCurrentSurvey($netId);
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

$app->get('/addTeacher', function (){

    addTeacher();
    exit;

});

$app->get('/addClass', function (){

    addClass();
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

$app->post('/setSettings/:teacher/:classes', function ($teacher,$classes){
    global $body;

    setSettings($body,$teacher,$classes);
    exit;

});

$app->post('/deleteSurvey/:teacher/:classes', function ($teacher,$classes){
    global $body;

    deleteSurvey($body,$teacher,$classes);
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

$app->get('/getGrades/:teacher/:classes', function ($teacher,$classes){

    getGrades($teacher,$classes);
    exit;

});

$app->get('/getAllAnswers/:teacher/:classes', function ($teacher,$classes){

    getAllAnswers($teacher,$classes);
    exit;

});

$app->run();
?>
