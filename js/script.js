$(function() {

$(".headerOptions").click(function(e){
  switch(e.currentTarget.id){

    case "headerOptionsCS":
      choosingSurvey();
      break;

    case "headerOptionsC":
      contactSurvey();
      break;
  }
});

$("#headerIcon").click(function(){
  choosingSurvey();
});

initScreen();

});

function choosingSurvey(){
  closeAll();
  $(".choosing").css("display","inline-block");
  $("#headerOptionsCS").addClass('activeHeader');
}

function contactSurvey(){
  closeAll();
  $(".contact").css("display","inline-block");
  $("#headerOptionsC").addClass('activeHeader');
}

function closeAll(){
  $(".choosing").css("display","none");
  $(".contact").css("display","none");

  $("#headerOptionsC").removeClass('activeHeader');
  $("#headerOptionsCS").removeClass('activeHeader');
}

function initScreen(){
  closeAll();
  $("#content").css("width","100%");
  $(".choosing").css("display","inline-block");

  $.ajax({
    url: "api/getTeachers"
  }).done(function(keydata) {
    data = JSON.parse(keydata)
    populateTeachers(data);
    $("#classList").addClass("hidden");
    $("#settingsList").addClass("hidden");
  });
}

function populateTeachers(keydata){
  $("#teachers").html("");
  $("#classList").addClass("hidden");
  $("#settingsList").addClass("hidden");
  for(var i = 0; i < keydata.length; i++){
    if(keydata[i] != "EmptyProject" && keydata[i] != "SourceFiles"){

        var button = createButton("teacherButton" + i, "teacherButton", keydata[i]);
        var teacher = keydata[i];
          linkTeacherButton(button, $("#teachers"), teacher);
          $("#teachers").append(button);

        $("#teacherButton" + i).css({
          "margin-top": "2%",
          "margin-left": "5%",
          "margin-right": "5%",
          "width": "90%"
        });


    }
  }
}

function createButton(id, classes, html) {
  var button = $("<div></div>");
  button.attr("id", id);
  button.attr("class", classes);
  button.html(html);
  return button;
}

function linkButton(button, parentEl, callback) {
  parentEl.append(button);
  button.on("click", callback);
}

function linkTeacherButton(button, parentEl, teacher) {
  parentEl.append(button);
  button.on("click", function(){
    populateClasses(teacher);
    $("#classList").removeClass("hidden");
  });
}

function linkClassButton(button, parentEl, classes,teacher) {
  parentEl.append(button);
  button.on("click", function(){
    populateSettings(teacher,classes);
    $("#settingsList").removeClass("hidden");
  });
}

function populateClasses(teacher){
  $.ajax({
    url: "api/getClasses/"+teacher
  }).done(function(keydata) {
    data = JSON.parse(keydata)
    setClassesButton(data,teacher);
  });
}

function populateSettings(teacher,classes){
  $.ajax({
    url: "api/getSettings/"+teacher+"/"+classes
  }).done(function(keydata) {
    data = keydata
    setSettings(data);
  });
}
function setSettings(settings){
  console.log(settings);
}

function setClassesButton(data,teacher){
  $("#classes").html("");
  $("#settingsList").addClass("hidden");
  for(var i = 0; i < data.length; i++){
        var button = createButton("classButton" + i, "classButton", data[i]);
        var classes = data[i];
          linkClassButton(button, $("#classes"), classes,teacher);

        $("#classButton" + i).css({
          "margin-top": "2%",
          "margin-left": "5%",
          "margin-right": "5%",
          "width": "90%"
        });

  }
}
