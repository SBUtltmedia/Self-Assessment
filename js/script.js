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

$("#publishButton").click(function(){
  saveSettings();
});

$("#dueDateAdd").click(function(){
  addDueDate();
});

$("#deleteButton").click(function(){
  removeClasses();
});

$(".dates").on("click",function(e){
  $("#calendarPicker").datepicker();
  $(".setDateButton").css("visibility","visible");
  console.log(e.target);
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
  $("#dueDate").children().last().remove();

  var length = ($("#dueDate").children().length - 3);
  var dateLabel = $("<div></div>");
  dateLabel.attr("class", "datesLabel");
  dateLabel.attr("id", "datesLabel"+length);
  dateLabel.html("XX/XX/XX");

  var dateSurvey = $("<div></div>");
  dateSurvey.attr("class", "datesSurvey");
  dateSurvey.attr("id", "datesSurvey"+length);
  dateSurvey.html(2);

  var dueDate = $("<div></div>");
  dueDate.attr("id", "dueDate"+length);
  dueDate.attr("class", "dates");
  dueDate.append(dateLabel);
  dueDate.append(dateSurvey);
  dueDate.on("click",function(e){
    e.target.datepicker("show");
    console.log(e.target);
  });

  var dueDateDelete = $("<div></div>");
  dueDateDelete.attr("class", "datesDelete");
  dueDateDelete.attr("id", "datesDelete"+length);
  dueDateDelete.html("-");
  dueDateDelete.on("click", function(e){
    e.target.parentNode.remove()
  });

  var dueDateHolder = $("<div></div>");
  dueDateHolder.attr("class", "datesHolder");
  dueDateHolder.attr("id", "datesHolder"+length);
  dueDateHolder.append(dueDate);
  dueDateHolder.append(dueDateDelete);

  $("#dueDate").append(dueDateHolder);

  var length3 = ($("#dueDate").children().length - 4);
  var dateLabel3 = $("<div></div>");
  dateLabel3.attr("class", "datesLabel");
  dateLabel3.attr("id", "datesLabel"+length3);
  dateLabel3.html("XX/XX/XX");

  var dateSurvey3 = $("<div></div>");
  dateSurvey3.attr("class", "datesSurvey");
  dateSurvey3.attr("id", "datesSurvey"+length3);
  dateSurvey3.html(3);

  var dueDate3 = $("<div></div>");
  dueDate3.attr("id", "dueDate"+length3);
  dueDate3.attr("class", "dates");
  dueDate3.append(dateLabel3);
  dueDate3.append(dateSurvey3);

  var dueDateHolder3 = $("<div></div>");
  dueDateHolder3.attr("class", "datesHolder");
  dueDateHolder3.append(dueDate3);

  $("#dueDate").append(dueDateHolder3);
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
