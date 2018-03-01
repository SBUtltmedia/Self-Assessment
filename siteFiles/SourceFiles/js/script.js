$(function() {

$(".headerOptions").click(function(e){
if(!($("#content").hasClass("Animating"))){
  switch(e.currentTarget.id){

    case "headerOptionsTS":
      takingSurvey();
      break;

    case "headerOptionsC":
      contactSurvey();
      break;

    case "headerOptionsS":
      settingsSurvey();
      break;
  }
}
});

$(".buttonHome").click(function(e){
if(!($("#content").hasClass("Animating"))){
  switch(e.currentTarget.id){

    case "buttonTaking":
      takingSurvey();
      break;

  }
}
});

$("#headerIcon").click(function(){
if(!($("#content").hasClass("Animating"))){
  homeSurvey();
}
});

initScreen();

});

function takingSurvey(){
  closeAll();
  $(".taking").css("display","inline-block");
  $("#content").css("width","85%");
  $("#headerOptionsTS").addClass('activeHeader');
  $("#content").addClass("quizMode");
}

function contactSurvey(){
  closeAll();
  $(".contact").css("display","inline-block");
  $("#content").css("width","100%");
  $("#headerOptionsC").addClass('activeHeader');
}

function settingsSurvey(){
  closeAll();
  $(".settings").css("display","inline-block");
  $("#content").css("width","100%");
  $("#headerOptionsS").addClass('activeHeader');
}

function homeSurvey(){
  closeAll();
  $("#content").css("width","100%");
  $(".home").css("display","inline-block");
}

function closeAll(){
  $(".home").css("display","none");
  $(".taking").css("display","none");
  $(".contact").css("display","none");
  $(".settings").css("display","none");

  $("#headerOptionsS").removeClass('activeHeader');
  $("#headerOptionsC").removeClass('activeHeader');
  $("#headerOptionsTS").removeClass('activeHeader');

  $("#content").removeClass("quizMode");
}

function initScreen(){
  closeAll();
  $("#content").css("width","100%");
  $(".home").css("display","inline-block");
  $("#content").addClass("needsToBeShrunk");
}
