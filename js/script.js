var downloading = false;

$(function() {

  $(".headerOptions").click(function(e) {
    switch (e.currentTarget.id) {

      case "headerOptionsCS":
        choosingSurvey();
        break;

      case "headerOptionsC":
        contactSurvey();
        break;
    }
  });

  $("#headerIcon").click(function() {
    choosingSurvey();
  });

  $("#surveyDownloadSettings").click(function() {
    if(downloading == false){
      downloadGrade(false);
    }
  });

  $("#tallyDownloadSettings").click(function() {
    if(downloading == false){
      downloadGrade(true);
    }
  });

  $("#linkShare").click(function() {
    copyLink();
  });

  $("#publishButton").click(function() {
    saveSettings();
  });

  $("#dueDateAdd").click(function() {
    addDueDate();
  });

  $("#classesAdd").click(function() {
    addClass();
  });

  $("#deleteButton").click(function() {
    removeClasses();
  });

  $(".dates").on("click", function(e) {
    var char = e.target.id
    var lastChar = char[char.length - 1];
    currentSelectedPage = parseInt(lastChar);

    setCalender(date);

    activeDateToggle($(this), parseInt(lastChar));
  });

  $("#calendarPicker").datepicker({
    onSelect: function(d, i) {
      $(this).change();
    }
  });

  $("#calendarPicker").on("change", function() {
    var date = $(this).datepicker('getDate')
    setDate(date)
  });

  initScreen();

});

var currentTeacher = "";
var currentClass = "";
var currentSelectedPage = -1;

function choosingSurvey() {
  closeAll();
  $(".choosing").css("display", "inline-block");
  $("#headerOptionsCS").addClass('activeHeader');
}

function contactSurvey() {
  window.location.href = "https://stonybrook.digication.com/peter_khost1/Home/";
}

function closeAll() {
  $(".choosing").css("display", "none");
  $(".contact").css("display", "none");

  $("#headerOptionsC").removeClass('activeHeader');
  $("#headerOptionsCS").removeClass('activeHeader');
}

function initScreen() {
  closeAll();
  $("#content").css("width", "100%");
  $(".choosing").css("display", "inline-block");
  $.ajax({
    url: "api/addTeacher"
  }).done(function() {

    $.ajax({
      url: "api/getTeachers"
    }).done(function(keydata) {
      data = JSON.parse(keydata);
      populateTeachers(data);
      $("#classList").addClass("hidden");
      $("#settingsList").addClass("hidden");
    });

  });
}

function addClass() {
  $.ajax({
    url: "api/addClass"
  }).done(function(keydata) {
    populateClasses(currentTeacher)
  });
}

function populateTeachers(keydata) {
  $("#teachers").html("");
  $("#classList").addClass("hidden");
  $("#settingsList").addClass("hidden");

  currentTeacher = "";
  currentClass = "";

  for (var i = 0; i < keydata.length; i++) {
    if (keydata[i] != "EmptyProject" && keydata[i] != "SourceFiles") {

      var button = createButton("teacherButton" + i, "teacherButton", keydata[i]);
      var teacher = keydata[i];
      linkTeacherButton(button, $("#teachers"), teacher);
      $("#teachers").append(button);

      // $("#teacherButton" + i).css({
      //   "margin-top": "2%",
      //   "margin-left": "5%",
      //   "margin-right": "5%",
      //   "width": "90%",
      //   "cursor":"pointer"
      // });

    }
  }
}

function downloadGrade(gradeOnly) {

  var teacher = currentTeacher;
  var classes = currentClass;
  downloading = true;
  if (gradeOnly) {
    $.ajax({
      url: "api/getGrades/" + teacher + "/" + classes
    }).done(function(keydata) {
      var args = {};
      $.when(organizeGrades(JSON.parse(keydata))).then(function(grades) {
        downloadCSV(args, grades, false)
      });
    });
  } else {
    $.ajax({
      url: "api/getAllAnswers/" + teacher + "/" + classes
    }).done(function(keydata) {
      organizeResponses(JSON.parse(keydata));
    });

  }
}

function organizeResponses(responses) {
  var args = {};
  var students = [];

  for (var i = 0; i < responses.length; i++) {
    var surveyData = responses[i];
    // var student = {};
    // student["NetID"] = responses[i][0];
    // student["Email"] = responses[i][1];

    for (var x = 2; x < surveyData.length; x++) {
      var surveyDataSpecific = surveyData[x];

      for (var y = 1; y < surveyDataSpecific.length; y++) {

        var survey = {};
        var currSurvey = surveyDataSpecific[y];
        if (currSurvey != null && currSurvey != undefined) {
          survey["NetID"] = responses[i][0];
          survey["Survey"] = surveyDataSpecific[0];
          survey["questionId"] = currSurvey.questionId;
          var text = currSurvey.text;
          text = text.replace(/\n/g, " ");
          survey["text"] = text;
          survey["answer"] = currSurvey.answer;
          students.push(survey);
        }
      }

    }

    // students.push(student);
  }

  downloadCSV(args, students,true);
}

function organizeGrades(grades) {
  var dfd = jQuery.Deferred();
  $.ajax({
    url: "api/getSettings/" + currentTeacher + "/" + currentClass
  }).done(function(keydata) {


    var students = [];
    var dates = JSON.parse(keydata).dates;

    var surveyNames = dates.map(function(date, index) {
      return "Survey 2-" + index
    });
    surveyNames[0] = "Survey 1";
    surveyNames[1] = "Survey 2";
    surveyNames[dates.length - 1] = "Survey 3";

    for (var x = 0; x < grades.length; x++) {
      var tempstudent = grades[x];
      var student = {};

      student["NetID"] = grades[x].name;
      for (var y = 0; y < surveyNames.length; y++) {
        if (tempstudent[surveyNames[y]] == undefined) {
          student[surveyNames[y]] = 0;
        } else {
          student[surveyNames[y]] = tempstudent[surveyNames[y]];
        }
      }

      students.push(student);
    }
    console.log(grades, students)
    dfd.resolve(students);

  });
  return dfd.promise();
}

function downloadCSV(args, keydata, responses) {
  var data, filename, link;
  var csv = $.csv.fromObjects(keydata);
  if (csv == null) return;

  if (responses == true) {
    filename = args.filename || 'WATTAnswers(' + timeStamp() + ').csv';
  } else {
    filename = args.filename || 'WATTGradingInfo(' + timeStamp() + ').csv';
  }

  link= $("<a/>",{"id":'downloadME'})
  $("body").append(link);
  downloadFile(filename, csv,$('#downloadME'))
}

function downloadFile(filename, data,$el) {

    var blob = new Blob([data], {type: "data:text/csv;charset=utf-8;"});
    var url = window.URL.createObjectURL(blob);
    $el[ 0 ].href = url;
    $el[ 0 ].download = filename;
    $el[0].click();
    //$el.remove();
    window.URL.revokeObjectURL(url);
    downloading = false;
}



function timeStamp() {
  // Create a date object with the current time
  var now = new Date();

  // Create an array with the current month, day and time
  var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];

  // Create an array with the current hour, minute and second
  var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

  // Determine AM or PM suffix based on the hour
  var suffix = (time[0] < 12) ? "AM" : "PM";

  // Convert hour from military time
  time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

  // If hour is 0, set it to 12
  time[0] = time[0] || 12;

  // If seconds and minutes are less than 10, add a zero
  for (var i = 1; i < 3; i++) {
    if (time[i] < 10) {
      time[i] = "0" + time[i];
    }
  }

  // Return the formatted string
  return date.join("-") + " " + time[0] + suffix;
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
  button.on("click", function() {
    populateClasses(teacher);
    $("#classList").removeClass("hidden");
  });
}

function linkClassButton(button, parentEl, classes, teacher) {
  parentEl.append(button);
  button.on("click", function() {
    resetSettings(classes, teacher);
    populateSettings(teacher, classes);
    $("#settingsList").removeClass("hidden");
  });
}

function populateClasses(teacher) {
  $.ajax({
    url: "api/getClasses/" + teacher
  }).done(function(keydata) {
    data = JSON.parse(keydata)
    setClassesButton(data, teacher);
  });
}

function populateSettings(teacher, classes) {
  $.ajax({
    url: "api/getSettings/" + teacher + "/" + classes
  }).done(function(keydata) {

    if (keydata == "NOPE") {
      resetSettings(classes, teacher)
    } else {
      data = JSON.parse(keydata);
      setSettings(data, classes, teacher);
      $("#settingsList").removeClass("hidden");
    }

  });
}

function populateAll(teacher, classes) {
  $.ajax({
    url: "api/getClasses/" + teacher
  }).done(function(keydata) {
    data = JSON.parse(keydata)
    setClassesButton(data, teacher);
    console.log("populating!");
    $.ajax({
      url: "api/getSettings/" + teacher + "/" + classes
    }).done(function(keydata) {

      if (keydata == "NOPE") {
        resetSettings(classes, teacher)
      } else {
        data = JSON.parse(keydata);
        setSettings(data, classes, teacher);
        $("#settingsList").removeClass("hidden");
      }

    });
  });
}

function setSettings(settings, classes, teacher) {
  currentTeacher = teacher;
  currentClass = classes;

  var classInfo = classes.split("-");

  if (classInfo[0] != "Temporary") {
    $("#courseOutput").val(classInfo[0]);
    $("#courseNumberOutput").val(classInfo[1]);
    $("#courseSectionOutput").val(classInfo[2].substring(3));
    linkUrl = "<a href='" + window.location.href + "surveys/" + currentTeacher + "/" + currentClass + "/'>.../surveys/" + currentTeacher + "/" + currentClass + "/</a>";
    $("#linkUrl").html(linkUrl);
  }

  loadSettings(settings);
}

function copyLink() {
  var $temp = $("<input>");
  $("body").append($temp);
  linkUrl = window.location.href + "surveys/" + currentTeacher + "/" + currentClass + "/";
  $temp.val(linkUrl).select();
  document.execCommand("copy");
  $temp.remove();
}

function resetSettings(classes, teacher) {
  currentTeacher = teacher;
  currentClass = classes;

  $("#courseOutput").val("");
  $("#courseNumberOutput").val("");
  $("#courseSectionOutput").val("");

  $('.datesHolder').each(function() {
    $(this).remove();
  });

  for (var i = 0; i < 3; i++) {
    currentSelectedPage = -1;

    var length = ($("#dueDate").children().length - 2);
    var dateLabel = $("<div></div>");
    dateLabel.attr("class", "datesLabel");
    dateLabel.attr("id", "datesLabel" + length);
    dateLabel.html("XX/XX/XXXX");

    var dateSurvey = $("<div></div>");
    dateSurvey.attr("class", "datesSurvey");
    dateSurvey.attr("id", "datesSurvey" + length);
    dateSurvey.html(i + 1);

    var dueDate = $("<div></div>");
    dueDate.attr("id", "dueDate" + length);
    dueDate.attr("class", "dates inactiveDueDate");
    dueDate.append(dateLabel);
    dueDate.append(dateSurvey);
    dueDate.on("click", function(e) {
      $(".setDateButton").css("visibility", "visible");
      var char = e.target.id
      var lastChar = char[char.length - 1];
      currentSelectedPage = parseInt(lastChar);

      var date = $("#datesLabel" + currentSelectedPage).html();

      setCalender(date);

      activeDateToggle($(this), parseInt(lastChar));
    });

    var dueDateHolder = $("<div></div>");
    dueDateHolder.attr("class", "datesHolder");
    dueDateHolder.attr("id", "datesHolder" + length);
    dueDateHolder.append(dueDate);

    $("#dueDate").append(dueDateHolder);
  }
  $("#courseOutput").removeClass("wrong");
  $("#courseNumberOutput").removeClass("wrong");
  $("#courseSectionOutput").removeClass("wrong");
  $("#dueDateSettings").removeClass("wrongDates");
  $("#linkUrl").html("");
  $("#dueDate0").click();
}

function saveSettings() {
  var classes = currentClass;
  var teacher = currentTeacher;
  var wrong = "";
  var savable = true;

  const settings = new Object();

  settings.teacher = teacher;
  settings.course = $("#courseOutput").val();
  settings.courseNumber = $("#courseNumberOutput").val();
  settings.courseSection = $("#courseSectionOutput").val();
  settings.dates = [];



  $('.dates').each(function() {
    if ($(this).children(".datesLabel").html() == "XX/XX/XXXX") {
      savable = false;
      wrong = "dates,";
    } else {
      settings.dates.push($(this).children(".datesLabel").html());
    }
  });

  for (var i = 1; i < settings.dates.length; i++) {
    if (Date.parse(settings.dates[i]) < Date.parse(settings.dates[i - 1])) {
      savable = false;
      wrong = "dates,";
    }
  }

  if (myTrim(settings.course) == "") {
    savable = false;
    wrong += ("course,");
  }

  if (isNaN(settings.courseNumber)) {
    savable = false;
    wrong += ("courseNum,");
  } else if (myTrim(settings.courseNumber) == "") {
    savable = false;
    wrong += ("courseNum,");
  }

  if (isNaN(settings.courseSection)) {
    savable = false;
    wrong += ("courseSec,");
  } else if (myTrim(settings.courseSection) == "") {
    savable = false;
    wrong += ("courseSec,");
  }


  console.log(savable, wrong);
  if (savable) {
    $("#courseOutput").removeClass("wrong");
    $("#courseNumberOutput").removeClass("wrong");
    $("#courseSectionOutput").removeClass("wrong");
    $("#dueDateSettings").removeClass("wrongDates");
    var getUrl = "api/setSettings/" + teacher + "/" + classes;

    $.ajax({
      type: "post",
      url: getUrl,
      cache: false,
      data: JSON.stringify(settings),
      dataType: "json"
    }).done(function(questionData) {
      console.log(teacher, classes);
      populateAll(teacher, classes)
    });
  } else {
    markWrong(wrong);
  }
}

function markWrong(wrong) {
  $("#courseOutput").removeClass("wrong");
  $("#courseNumberOutput").removeClass("wrong");
  $("#courseSectionOutput").removeClass("wrong");
  $("#dueDateSettings").removeClass("wrongDates");
  var toFix = wrong.split(",");
  console.log(toFix);

  for (var i = 0; i < toFix.length; i++) {
    switch (toFix[i]) {
      case "dates":
        $("#dueDateSettings").addClass("wrongDates");
        break;
      case "course":
        $("#courseOutput").addClass("wrong");
        break;
      case "courseNum":
        $("#courseNumberOutput").addClass("wrong");
        break;
      case "courseSec":
        $("#courseSectionOutput").addClass("wrong");
        break;
      case "":
        break;
    }
  }
}

function myTrim(x) {
  return x.replace(/^\s+|\s+$/gm, '');
}

function loadSettings(settings) {
  var classes = currentClass;
  var teacher = currentTeacher;

  $("#courseOutput").val(settings.course);
  $("#courseNumberOutput").val(settings.courseNumber);
  $("#courseSectionOutput").val(settings.courseSection);

  for (var i = 0; i < (settings.dates.length - 3); i++) {
    addDueDate();
  }

  var i = 0;
  $('.dates').each(function() {
    $(this).children(".datesLabel").html(settings.dates[i]);
    i++;
  });

  $("#dueDate0").click();
}

function removeClasses() {
  console.log("NO NO NO! NO DELETE FOR YOU!");
}

function setClassesButton(data, teacher) {
  $("#classes").html("");
  $("#settingsList").addClass("hidden");

  currentTeacher = teacher;
  currentClass = "";
  currentSelectedPage = -1;
  for (var i = 0; i < data.length; i++) {

    var classes = data[i];

    if (classes == "Temporary") {
      var button = createButton("classButton" + i, "classButton tempClassButton", data[i]);
    } else {
      var button = createButton("classButton" + i, "classButton", data[i]);
    }

    linkClassButton(button, $("#classes"), classes, teacher);
  }
}

// calendar & Due Dates

function setCalender(date) {
  if (date == "XX/XX/XXXX") {
    $("#calendarPicker").datepicker()
      .datepicker('setDate', 'today');
  } else {
    var dateSeperated = date.split("/");
    $("#calendarPicker").datepicker()
      .datepicker('setDate', new Date(dateSeperated[2], parseInt(dateSeperated[0]) - 1, dateSeperated[1]));
  }
}

function setDate(date) {
  /* var day = $(".ui-state-active").html();
  var month = $(".ui-datepicker-month").html();
  var year = $(".ui-datepicker-year").html();
*/
  day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear();


  if (day.length == 1) {
    day = "0" + day;
  }

  switch (month) {
    case "December":
      month = 12;
      break;

    case "November":
      month = 11;
      break;

    case "October":
      month = 10;
      break;

    case "September":
      month = 09;
      break;

    case "August":
      month = 08;
      break;

    case "July":
      month = 07;
      break;

    case "June":
      month = 06;
      break;

    case "May":
      month = 05;
      break;

    case "April":
      month = 04;
      break;

    case "March":
      month = 03;
      break;

    case "February":
      month = 02;
      break;

    case "January":
      month = 01;
      break;
  }

  $("#datesLabel" + currentSelectedPage).html(month + "/" + day + "/" + year);
}

function addDueDate() {
  $("#dueDate").children().last().remove();
  currentSelectedPage = -1;

  var length = ($("#dueDate").children().length - 2);
  var dateLabel = $("<div></div>");
  dateLabel.attr("class", "datesLabel");
  dateLabel.attr("id", "datesLabel" + length);
  dateLabel.html("XX/XX/XXXX");

  var dateSurvey = $("<div></div>");
  dateSurvey.attr("class", "datesSurvey");
  dateSurvey.attr("id", "datesSurvey" + length);
  dateSurvey.html(2);

  var dueDate = $("<div></div>");
  dueDate.attr("id", "dueDate" + length);
  dueDate.attr("class", "dates inactiveDueDate");
  dueDate.append(dateLabel);
  dueDate.append(dateSurvey);
  dueDate.on("click", function(e) {
    $(".setDateButton").css("visibility", "visible");
    var char = e.target.id
    var lastChar = char[char.length - 1];
    currentSelectedPage = parseInt(lastChar);

    var date = $("#datesLabel" + currentSelectedPage).html();

    setCalender(date);

    activeDateToggle($(this), parseInt(lastChar));
  });

  var dueDateDelete = $("<div></div>");
  dueDateDelete.attr("class", "datesDelete");
  dueDateDelete.attr("id", "datesDelete" + length);
  dueDateDelete.html("-");
  dueDateDelete.on("click", function(e) {
    e.target.parentNode.remove()
  });

  var dueDateHolder = $("<div></div>");
  dueDateHolder.attr("class", "datesHolder");
  dueDateHolder.attr("id", "datesHolder" + length);
  dueDateHolder.append(dueDate);
  dueDateHolder.append(dueDateDelete);

  $("#dueDate").append(dueDateHolder);

  var length3 = ($("#dueDate").children().length - 2);
  var dateLabel3 = $("<div></div>");
  dateLabel3.attr("class", "datesLabel");
  dateLabel3.attr("id", "datesLabel" + length3);
  dateLabel3.html("XX/XX/XXXX");

  var dateSurvey3 = $("<div></div>");
  dateSurvey3.attr("class", "datesSurvey");
  dateSurvey3.attr("id", "datesSurvey" + length3);
  dateSurvey3.html(3);

  var dueDate3 = $("<div></div>");
  dueDate3.attr("id", "dueDate" + length3);
  dueDate3.attr("class", "dates inactiveDueDate");
  dueDate3.on("click", function(e) {
    $(".setDateButton").css("visibility", "visible");
    var char = e.target.id
    var lastChar = char[char.length - 1];
    currentSelectedPage = parseInt(lastChar);

    var date = $("#datesLabel" + currentSelectedPage).html();

    setCalender(date);

    activeDateToggle($(this), parseInt(lastChar));
  });
  dueDate3.append(dateLabel3);
  dueDate3.append(dateSurvey3);

  var dueDateHolder3 = $("<div></div>");
  dueDateHolder3.attr("class", "datesHolder");
  dueDateHolder3.attr("id", "datesHolder" + length3);
  dueDateHolder3.append(dueDate3);

  $("#dueDate").append(dueDateHolder3);
}

function activeDateToggle(date, length) {
  $('.activeDueDate').each(function() {
    $(this).removeClass("activeDueDate");
    $(this).addClass("inactiveDueDate");
  });
  date.removeClass("inactiveDueDate");
  date.addClass("activeDueDate");
}

function removeDueDate() {
  if (($("#dueDate").children().length - 2) > 3) {
    console.log("Remove");
  } else {
    console.log("No remove");
  }
}
