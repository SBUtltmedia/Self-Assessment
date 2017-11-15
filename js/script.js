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

$("#surveyDownloadSettings").click(function(){
  console.log("Donwloading Function not applied yet");
});

$("#tallyDownloadSettings").click(function(){
  console.log("Donwloading Function not applied yet");
});

$("#deleteButton").click(function(){
  removeClasses();
});

$("#publishButton").click(function(){
  saveSettings();
});

$("#dueDateAdd").click(function(){
  addDueDate();
});

$("#dueDateRemove").click(function(){
  removeDueDate();
});

initScreen();

});

var currentTeacher = "";
var currentClass= "";

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

  currentTeacher = "";
  currentClass= "";

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
    setSettings(data,classes,teacher);
  });
}

function setSettings(settings,classes,teacher){
  currentTeacher = teacher;
  currentClass = classes;

  var classInfo = classes.split("-");

  $("#courseOutput").val(classInfo[1]);
  $("#courseNumberOutput").val(classInfo[2]);
  $("#courseSectionOutput").val(classInfo[3].substring(3));

  if(settings == "NOPE"){
    console.log(classInfo,currentTeacher, currentClass);
  }else{
    loadSettings(settings);
  }
}

function saveSettings(){
  var classes = currentClass;
  var teacher = currentTeacher;

  var settings = [];

  settings.teacher = teacher;
  settings.course = $("#courseOutput").val();
  settings.courseNumber = $("#courseNumberOutput").val();
  settings.courseSection = $("#courseSectionOutput").val();

  console.log(settings);
}

function loadSettings(settings){
  var classes = currentClass;
  var teacher = currentTeacher;

  console.log(settings,currentTeacher, currentClass);
}

function removeClasses(){
  console.log("NO NO NO! NO DELETE FOR YOU!");
}

function addDueDate(){
  var length = ($("#dueDate").children().length - 2);
  var dateLabel = $("<div></div>");
  dateLabel.attr("class", "datesLabel");
  dateLabel.attr("id", "datesLabel"+length);
  dateLabel.html("XX/XX/XX");

  var dateSurvey = $("<div></div>");
  dateSurvey.attr("class", "datesSurvey");
  dateSurvey.attr("id", "datesSurvey"+length);

  if(length == 0){
    dateSurvey.html(1);
  }else if(length == 1){
    dateSurvey.html(2);
  }else{
    $("#dueDate").children(length-1).children(1).html("2");
    dateSurvey.html(3);
  }

  var dueDate = $("<div></div>");
  dueDate.attr("id", "dueDate"+length);
  dueDate.attr("class", "dates");
  dueDate.append(dateLabel);
  dueDate.append(dateSurvey);

  $("#dueDate").append(dueDate);
  console.log(dueDate);
}

function removeDueDate(){
  if(($("#dueDate").children().length - 2)>3){
    console.log("Remove");
  }else{
    console.log("No remove");
  }
}

function setClassesButton(data,teacher){
  $("#classes").html("");
  $("#settingsList").addClass("hidden");

  currentTeacher = teacher;
  currentClass= "";

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
