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
  animate("taking");
  $(".taking").css("display","inline-block");
  $("#headerOptionsTS").addClass('activeHeader');
}

function contactSurvey(){
  closeAll();
  animate("contact");
  $(".contact").css("display","inline-block");
  $("#headerOptionsC").addClass('activeHeader');
}

function settingsSurvey(){
  closeAll();
  animate("settings");
  $(".settings").css("display","inline-block");
  $("#headerOptionsS").addClass('activeHeader');
}

function homeSurvey(){
  closeAll();
  animate("home");
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

function animate(frame){
  var time = 750;
  switch(frame){
      case "home":
      $("#content").removeClass("quizMode");
        if($("#content").hasClass("needsToBeEnlarged")){
          $("#content").addClass("Animating");
          $("#content").addClass("animateHomeIn");
          $("#content").css("width","100%");
          setTimeout(function(){
            $("#content").removeClass("Animating");
            $("#content").removeClass("animateHomeIn");
            $("#content").removeClass("needsToBeEnlarged");
            $("#content").addClass("needsToBeShrunk");
          }, time);
        }
      break;

      case "taking":
        if($("#content").hasClass("needsToBeShrunk")){
          $("#content").addClass("Animating");
          $("#content").addClass("animateHomeOut");
          $("#content").css("width","85%");
          setTimeout(function(){
            $("#content").removeClass("Animating");
            $("#content").removeClass("animateHomeOut");
            $("#content").removeClass("needsToBeShrunk");
            $("#content").addClass("needsToBeEnlarged");
          }, time);
        }
        $("#content").addClass("quizMode");
      break;

      case "contact":

        if($("#content").hasClass("needsToBeEnlarged")){
        $("#content").addClass("Animating");
        $("#content").addClass("animateHomeIn");
        $("#content").css("width","100%");
        setTimeout(function(){
          $("#content").removeClass("Animating");
          $("#content").removeClass("animateHomeIn");
          $("#content").removeClass("needsToBeEnlarged");
          $("#content").addClass("needsToBeShrunk");
        }, time);
      }
      $("#content").removeClass("quizMode");
      break;

      case "settings":
        if($("#content").hasClass("needsToBeEnlarged")){
          $("#content").addClass("Animating");
          $("#content").addClass("animateHomeIn");
        $("#content").css("width","100%");
        setTimeout(function(){
          $("#content").removeClass("Animating");
          $("#content").removeClass("animateHomeIn");
          $("#content").removeClass("needsToBeEnlarged");
          $("#content").addClass("needsToBeShrunk");
        }, time);
      }
      $("#content").removeClass("quizMode");
      break;
  }
}

function initScreen(){
  closeAll();
  $("#content").css("width","100%");
  $(".home").css("display","inline-block");
  $("#content").addClass("needsToBeShrunk");
}
