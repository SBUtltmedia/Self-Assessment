$(function() {

$(".headerOptions").click(function(e){
  switch(e.currentTarget.id){

    case "headerOptionsTS":
      takingSurvey();
      break;

    case "headerOptionsCS":
      editingSurvey();
      break;

    case "headerOptionsC":
      contactSurvey();
      break;

    case "headerOptionsS":
      settingsSurvey();
      break;
  }
});

$(".buttonHome").click(function(e){
  switch(e.currentTarget.id){

    case "buttonTaking":
      takingSurvey();
      break;

    case "buttonEditing":
      editingSurvey();
      break;

  }
});

$("#headerIcon").click(function(){
  homeSurvey();
});

initScreen();

});

function takingSurvey(){
  closeAll();
  animate("taking");
  $(".taking").css("display","inline-block");
  $("#headerOptionsTS").addClass('activeHeader');
}

function editingSurvey(){
  closeAll();
  animate("editing");
  $(".editing").css("display","inline-block");
  $("#headerOptionsCS").addClass('activeHeader');
}

function contactSurvey(){
  closeAll();
  animate("contact");
  $(".contact").css("display","inline-block");
  $("#headerOptionsC").addClass('activeHeader');
}

function settingsSurvey(){
  closeAll();
  animate("setting");
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
  $(".editing").css("display","none");
  $(".contact").css("display","none");
  $(".settings").css("display","none");

  $("#headerOptionsS").removeClass('activeHeader');
  $("#headerOptionsC").removeClass('activeHeader');
  $("#headerOptionsCS").removeClass('activeHeader');
  $("#headerOptionsTS").removeClass('activeHeader');

  $("#content").removeClass("quizMode");
}

function animate(frame){
  switch(frame){

      case "home":
        if($("#content").hasClass("needsToBeEnlarged")){
          $("#content").addClass("animateHomeIn");
          $("#content").css("width","100%");
          setTimeout(function(){
            $("#content").removeClass("animateHomeIn");
            $("#content").removeClass("needsToBeEnlarged");
            $("#content").addClass("needsToBeShrunk");
          }, 2000);
        }
      break;

      case "taking":
        if($("#content").hasClass("needsToBeShrunk")){
          $("#content").addClass("animateHomeOut");
          $("#content").css("width","85%");
          $("#content").addClass("quizMode");
          setTimeout(function(){
            $("#content").removeClass("animateHomeOut");
            $("#content").removeClass("needsToBeShrunk");
            $("#content").addClass("needsToBeEnlarged");
          }, 2000);
        }
      break;

      case "editing":
        if($("#content").hasClass("needsToBeEnlarged")){
        $("#content").addClass("animateHomeIn");
        $("#content").css("width","100%");
        setTimeout(function(){
          $("#content").removeClass("animateHomeIn");
          $("#content").removeClass("needsToBeEnlarged");
          $("#content").addClass("needsToBeShrunk");
        }, 2000);
      }
      break;

      case "contact":
        if($("#content").hasClass("needsToBeEnlarged")){
        $("#content").addClass("animateHomeIn");
        $("#content").css("width","100%");
        setTimeout(function(){
          $("#content").removeClass("animateHomeIn");
          $("#content").removeClass("needsToBeEnlarged");
          $("#content").addClass("needsToBeShrunk");
        }, 2000);
      }
      break;

      case "settings":
        if($("#content").hasClass("needsToBeEnlarged")){
        $("#content").addClass("animateHomeIn");
        $("#content").css("width","100%");
        setTimeout(function(){
          $("#content").removeClass("animateHomeIn");
          $("#content").removeClass("needsToBeEnlarged");
          $("#content").addClass("needsToBeShrunk");
        }, 2000);
      }
      break;
  }
}

function initScreen(){
  closeAll();
  $("#content").css("width","100%");
  $(".home").css("display","inline-block");
  $("#content").addClass("needsToBeShrunk");
}
