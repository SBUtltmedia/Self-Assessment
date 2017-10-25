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

  });
}

function populateTeachers(keydata){
  for(var i = 0; i < keydata.length; i++){
    if(keydata[i] != "EmptyProject" && keydata[i] != "SourceFiles"){

        var button = createButton("teacherButton" + i, "", keydata[i]);
        var teacher = keydata[i];
          linkButton(button, $("#teachers"), function() {
            populateClasses(teacher);
          });


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
  button.html("<span>" + html + "</span>");
  return button;
}

function linkButton(button, parentEl, callback) {
  parentEl.append(button);
  button.on("click", callback);
}

function populateClasses(teacher){
  $.ajax({
    url: "api/getClasses/"+teacher
  }).done(function(keydata) {
    data = JSON.parse(keydata)
    setClassesButton(data);
  });
}

function setClassesButton(data){
  for(var i = 0; i < data.length; i++){

        var button = createButton("classButton" + i, "", data[i]);
        var teacher = data[i];
          linkButton(button, $("#classList"), function() {
            console.log("hi")
          });


        $("#classButton" + i).css({
          "margin-top": "2%",
          "margin-left": "5%",
          "margin-right": "5%",
          "width": "90%"
        });

  }
}
