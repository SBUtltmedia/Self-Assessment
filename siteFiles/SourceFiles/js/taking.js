var quizQuestions = [];
var currentSurvey = 1;
var currentSurveyVersion = 0;
var currentConsentPage=1;
var studentInfo = [];
$(function() {

  var quizQuestionIndex = 0;
  var userInfo = [];
  var netId;

  if (location.hash) {
    quizQuestionIndex = location.hash.split("#")[1];
  }

  $.ajaxSetup({
    cache: false
  });

  $.ajax({
    url: "api/getUser"
  }).done(function(keydata) {

    studentInfo = organizeKey(keydata);
    console.log(keydata)
    netId = studentInfo[2];

    $.ajax({
      url: "api/getCurrentSurvey/" + netId
    }).done(function(data) {
      var kdata = data.split(",");
      var keydata = Number.parseInt(kdata[0]);
      console.log(kdata);
      var url = "json/survey" + keydata + ".json"
      currentSurvey = keydata;
      currentSurveyVersion = Number.parseInt(kdata[1]);
      if (keydata < 4) {
        $.getJSON(url, function(data) {
          testData = data;
          loadTestData(testData, studentInfo, quizQuestionIndex, netId);
        }).fail(function(jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          console.log("Request Failed: " + err);
        });;
      } else {

        $("#buttonTaking").removeClass("buttonHome");
        $("#buttonTaking").addClass("NoTaking");
        $("#buttonTaking").off();
        $("#headerOptionsTS").off();
        $("#buttonTaking").html("<p>Survey<br>Ended</p>")
      }
    });

  });


  $("#prevButton").click(function() {
    if(quizQuestionIndex > 0 && quizQuestionIndex < quizQuestions.length-1){
      closeNavigation();
      showRequiredCompleted(studentInfo, quizQuestionIndex);
      quizQuestionIndex = setQuestionIndex(-1, quizQuestionIndex);
      loadAnswer(quizQuestionIndex, studentInfo);
    }
  });

  $("#nextButton").click(function() {
    if(quizQuestionIndex < quizQuestions.length-1 && quizQuestions[quizQuestionIndex].complete == true){
      closeNavigation();
      showRequiredCompleted(studentInfo, quizQuestionIndex);
      quizQuestionIndex = setQuestionIndex(1, quizQuestionIndex);
      loadAnswer(quizQuestionIndex, studentInfo);
    }else if (quizQuestionIndex >= quizQuestions.length-1){
      closeNavigation();
      completedSurvey();
    }
  });

  $("#fillOutput").on("input", function() {
    updateTextBar(quizQuestionIndex);
  });

  $(".saveUserSettingsButton").click(function() {
    saveUserSettings(studentInfo, netId);
    $(".saveUserSettingsButton").html("Saved!");
    $(".saveUserSettingsButton").css("background-color","#51b848");
    setTimeout(function() {
      $(".saveUserSettingsButton").html("Save");
      $(".saveUserSettingsButton").css("background-color","#FF3B3F");
    }, (1000 * 15));
  });

  $("#wipeButton").click(function() {
    $("#cleardataModal").css("display", "block");
  });

  $("#exitButton").click(function() {
    $("#cleardataModal").css("display", "none");
  });

  $("#eraseButton").click(function() {
    WIPE(netId);
  });

  $("#sliderOutput").mousemove(function() {
    $("#valueShower").html(sliderOutput.value + "% ");
  });

  $("#settingsScreen").mouseleave(function() {
    $(".settingsCross").click();
  });

  $(".button").click(function() {
    submitAnswer(quizQuestionIndex, event.currentTarget.id, studentInfo);
  });

  $(".userbutton").click(function() {
    saveUserSettings(studentInfo, netId);
  });

  $("#consentTextAnswer, #consentText").on("click",function() {
if(currentConsentPage>3){
	currentConsentPage=1;
    window.open("/watt/siteFiles/SourceFiles/pdf/web/viewer.html?file=/watt/siteFiles/SourceFiles/media/consent.pdf")
}
else{
initPDF(currentConsentPage)
}
currentConsentPage++
});

 // $("#consentText").click(function() {
 //   window.open("/watt/siteFiles/SourceFiles/pdf/web/viewer.html?file=/watt/siteFiles/SourceFiles/media/consent.pdf")
 // });

  $("#questionsText").mouseover(function(e) {
    showHover(quizQuestionIndex, e);
  });

  $("#questionsText").mouseover(function(e) {
    showHover(quizQuestionIndex, e);
  });

  $("#questionsText").mousemove(function(e) {
    showHover(quizQuestionIndex, e);
  });

  $("#questionsText").mouseout(function() {
    $("#hoverText").css("display", "none");
  });

  $("#majorOptionInfo").on("change", function() {
    checkMajorSettings();
  });

  $("#minorOptionInfo").on("change", function() {
    checkMinorSettings();
  });

  $("#majorAnswer").on("change", function() {
    checkMajorAnswer();
  });

  $("#minorAnswer").on("change", function() {
    checkMinorAnswer();
  });

  $(document).keydown(function(e) {
    keyHandler(quizQuestionIndex, e);
  });

  // $(".pageContents").on('mousewheel', function(event) {
  //   if ($("#content").hasClass("quizMode")) {
  //     if (event.originalEvent.wheelDelta >= 0) {
  //       closeNavigation();
  //       showRequiredCompleted(studentInfo, quizQuestionIndex);
  //       quizQuestionIndex = setQuestionIndex(-1, quizQuestionIndex);
  //       loadAnswer(quizQuestionIndex, studentInfo);
  //     } else {
  //       closeNavigation();
  //       showRequiredCompleted(studentInfo, quizQuestionIndex);
  //       quizQuestionIndex = setQuestionIndex(1, quizQuestionIndex);
  //       loadAnswer(quizQuestionIndex, studentInfo);
  //     }
  //   }
  // });

});

function keyHandler(quizQuestionIndex, e) {
  switch (e.which) {

    case 37: //Left
      var currentQuestion = quizQuestions[quizQuestionIndex];

      switch (currentQuestion.type) {

        case "slider":
          var x = $("#sliderOutput").val();
          x -= 1;
          $("#sliderOutput").val(x * 1);
          $("#valueShower").html(sliderOutput.value + "% ");
          break;

        case "intfill":
          var x = $("#intfillOutput").val();
          if (x > 0) {
            x -= 1;
          }
          $("#intfillOutput").val(x * 1);
          break;
      }
      break;

    case 38: // up
      $("#prevButton").click();
      break;

    case 39: //Right

      var currentQuestion = quizQuestions[quizQuestionIndex];

      switch (currentQuestion.type) {

        case "slider":
          var x = $("#sliderOutput").val();
          x -= -1;
          $("#sliderOutput").val(x * 1);
          $("#valueShower").html(sliderOutput.value + "% ");
          break;

        case "intfill":
          var x = $("#intfillOutput").val();
          x -= -1;
          $("#intfillOutput").val(x * 1);
          break;
      }

      break;

    case 40: // down
      $("#nextButton").click();
      break;

    case 13: //enter

      var currentQuestion = quizQuestions[quizQuestionIndex];

      switch (currentQuestion.type) {
        case "ok":
          $("#answermc0").click();
          break;
        case "fill":
          $("#fillButton").click();
          break;
        case "intfill":
          $("#intfillButton").click();
          break;
        case "slider":
          $("#sliderButton").click();
          break;
      }
      break;

    default:
      return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
}

function checkMajorSettings() {

  var major = $("#majorOptionInfo").selectivity('data');

  if (major.length > 2) {

    $("#majorOptionInfo").selectivity('remove', major[major.length - 1].id);
    $("#majorOptionInfo").html($("#majorOptionInfo").html());

  }

}

function checkMinorSettings() {

  var minor = $("#minorOptionInfo").selectivity('data');

  if (minor.length > 3) {

    $("#minorOptionInfo").selectivity('remove', minor[minor.length - 1].id);
    $("#minorOptionInfo").html($("#minorOptionInfo").html());

  }

}

function checkMajorAnswer() {

  var major = $("#majorAnswer").selectivity('data');

  if (major.length > 2) {

    $("#majorAnswer").selectivity('remove', major[major.length - 1].id);
    $("#majorAnswer").html($("#majorAnswer").html());

  }

}

function checkMinorAnswer() {

  var minor = $("#minorAnswer").selectivity('data');

  if (minor.length > 3) {

    $("#minorAnswer").selectivity('remove', minor[minor.length - 1].id);
    $("#minorAnswer").html($("#minorAnswer").html());

  }

}

function clearFields() {
  $("#questionsHeaderText").html("Question");
  $("#questionsText").empty();

  $("#answermc").addClass("hide");
  $("#answermc").removeClass("flex");
  $("#answerslider").addClass("hide");
  $("#answerfill").addClass("hide");
  $("#answerintfill").addClass("hide");
  $("#answerlist").addClass("hide");
  $("#answerbirthday").addClass("hide");
  $("#answermajor").addClass("hide");
  $("#answerconsent").addClass("hide");
  $("#answername").addClass("hide");
  $("#answeremail").addClass("hide");

  $("#answermc").empty();
  $("#hoverText").empty();
  $("#listOutputOptions").empty();

  $("#fillOutput").val("");
  $("#intfillOutput").val("0");
  $("#sliderOutput").val("50");


  $(".completedQuestion").css("visibility", "hidden");

  $("#sliderButton").removeClass("completeButton");
  $("#intfillButton").removeClass("completeButton");
  $("#fillButton").removeClass("completeButton");
  $("#listButton").removeClass("completeButton");
  $("#birthdayButton").removeClass("completeButton");
  $("#majorButton").removeClass("completeButton");
  $("#consentButton").removeClass("completeButton");
  $("#nameButton").removeClass("completeButton");
  $("#emailButton").removeClass("completeButton");

  $("#answermc").removeClass("completeButton");
  $("#questionsHeaderText").removeClass("completeHeader");

}

function createButton(id, classes, html) {
  var button = $("<div></div>");
  button.attr("id", id);
  button.attr("class", classes);
  button.html("<span>" + html + "</span>");
  return button;
}

function clearFollowups(quizQuestionIndex) {

  var i = quizQuestionIndex + 1;

  do {

    if (quizQuestions[i]) {
      quizQuestions.splice(i, 1);
    }

  } while (quizQuestions[i].followupPart == true);
}

function closeNavigation() {
  $("#nextButton").css("pointer-events", "none");
  $("#prevButton").css("pointer-events", "none");
}

function enableNavigation() {
  $("#nextButton").css("pointer-events", "auto");
  $("#prevButton").css("pointer-events", "auto");
}

function initQuizQuestions(qd) {
  var question = new setQuizQuestions(qd);
  quizQuestions.push(question);
}

function organizeKey(keydata){
  var data = keydata.split(",");

  for(var i = 0; i < data.length; i++){
    var segment = data[i];

    segment = segment.split('"').join('');
    segment = segment.split('}').join('');
    var index = segment.indexOf(':');

    data[i] = segment.slice(index + 1,segment.length);
  }

  return data;
}

function initPDF(currentPage) {
  // URL of PDF document
  var url = "media/consent.pdf";

  // Asynchronous download PDF
  PDFJS.getDocument(url)
    .then(function(pdf) {
      return pdf.getPage(currentPage);
    })
    .then(function(page) {

      // Set scale (zoom) level
      var scale = 1;

      // Get div#the-svg
      var containerappend = document.getElementById('consentSVG');
      var container = $('#consentSVG');
      var containerappendSettings = document.getElementById('consentSVGSettings');
      var containerSettings = $('#consentSVGSettings');

      // Get viewport (dimensions)
      var viewport = page.getViewport(scale);

      // Set dimensions
      container.css("width", viewport.width);
      container.css("height", viewport.height);
      container.css("background-color", "white");
      containerSettings.css("width", viewport.width);
      containerSettings.css("height", viewport.height);

      // SVG rendering by PDF.js
      page.getOperatorList()
        .then(function(opList) {
          var svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
          return svgGfx.getSVG(opList, viewport);
        })
        .then(function(svg) {
          container.html("");
          containerappend.appendChild(svg);
        })
      page.getOperatorList()
        .then(function(opList) {
          var svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
          return svgGfx.getSVG(opList, viewport);
        })
        .then(function(svg) {
          containerSettings.html("");
          containerappendSettings.appendChild(svg);
        });

    });
}

function linkButton(button, parentEl, callback) {
  parentEl.append(button);
  button.on("click", callback);
}

function loadTestData(td, studentInfo, quizQuestionIndex, netId) {

  for (var i = 0; i < td.questions.length; i++) {
    initQuizQuestions(td.questions[i]);
  }

  loadUserSettings(studentInfo, quizQuestionIndex, netId);
  loadAnswer(quizQuestionIndex, studentInfo);

}

function loadAnswer(quizQuestionIndex, studentInfo) {

  var id = quizQuestions[quizQuestionIndex].questionId;
  var studentId = studentInfo[2];
  var getUrl = "api/getQuestion/" + studentId + "/" + currentSurvey + "/" + id;

  if(currentSurvey == 2 && currentSurveyVersion > 1){
    getUrl = "api/getQuestion/" + studentId + "/" + currentSurvey + "-" + currentSurveyVersion + "/" + id;
  }

  $.ajax({
    type: "post",
    url: getUrl,
    cache: false,
    data: JSON.stringify(quizQuestions[quizQuestionIndex]),
    dataType: "json"
  }).done(function(questionData) {

    quizQuestions[quizQuestionIndex].answer = questionData.answer;
    quizQuestions[quizQuestionIndex].complete = questionData.complete;
    setQuestion(quizQuestionIndex, studentInfo);
    enableNavigation();

  });

}

function mcFillTransition(quizQuestionIndex, id) {
  var id = id.slice(8);

  $("#answermc").addClass("hide");
  $("#answermc").empty();
  $("#answerfill").removeClass("hide");

  quizQuestions[quizQuestionIndex].mcMultiAnswer = id;
}

function setButtons(currentQuestion, quizQuestionIndex, studentInfo) {

  var choices = currentQuestion.choices;

  if (currentQuestion.type == "ok" || currentQuestion.choices.length == 1) {

    if (currentQuestion.type == "ok") {

      var button = createButton("mcButton0", "button answerButton", "OK");

      linkButton(button, $("#answermc"), function() {
        submitAnswer(quizQuestionIndex, event.currentTarget.id, studentInfo);
      });
      $("#mcButton" + 0).css("font-size", "2rem");

    } else if (currentQuestion.type == "mcfill") {

      var button = createButton("mcButton0", "button answerButton", choices[0]);

      linkButton(button, $("#answermc"), function() {
        mcFillTransition(quizQuestionIndex, event.currentTarget.id);
      });

    } else {

      var button = createButton("mcButton0", "button answerButton", choices[0]);

      linkButton(button, $("#answermc"), function() {
        submitAnswer(quizQuestionIndex, event.currentTarget.id, studentInfo);
      });
    }

    $("#mcButton" + 0).css({
      "margin-top": "2%",
      "margin-left": "25%",
      "margin-right": "25%",
      "width": "50%"
    });

  } else {
    var incrementForSizing = (1 / choices.length) * 100 * 0.7;
    var incrementForPlacing = (1 / choices.length) * 100 * 0.07;

    for (var i = 0; i < choices.length; i++) {
      var button = createButton("mcButton" + i, "button answerButton", choices[i]);

      if (currentQuestion.type == "mcfill") {
        linkButton(button, $("#answermc"), function() {
          mcFillTransition(quizQuestionIndex, event.currentTarget.id);
        });
      } else {
        linkButton(button, $("#answermc"), function() {
          submitAnswer(quizQuestionIndex, event.currentTarget.id, studentInfo);
        });
      }


      $("#mcButton" + i).css({
        "margin-top": "2%",
        "margin-left": incrementForPlacing + "%",
        "margin-right": incrementForPlacing + "%",
        "width": incrementForSizing + "%"
      });

    }
  }
}

function showCompleted(currentQuestion) {

  var answer = currentQuestion.answer;
  var buttonPressed = "#mcButton" + answer;

  if (currentQuestion.required == false) {
    $("#questionsHeaderText").html("Optional Question (Complete)");
  } else {
    $("#questionsHeaderText").html("Question (Complete)");
  }
  $(".completedQuestion").css("visibility", "visible");
  $("#questionsHeaderText").addClass("completeHeader");

  switch (currentQuestion.type) {
    case "ok":
      $(buttonPressed).addClass("completeButton");
      break;
    case "mc":
      $(buttonPressed).addClass("completeButton");
      break;
    case "mcfill":
      buttonPressed = "#mcButton" + currentQuestion.answer[0];
      $(buttonPressed).addClass("completeButton");
      $("#fillOutput").val(currentQuestion.answer[1]);
      $("#fillButton").addClass("completeButton");
      break;
    case "fill":
      $("#fillOutput").val(answer);
      $("#fillButton").addClass("completeButton");
      break;
    case "intfill":
      $("#intfillOutput").val(answer);
      $("#intfillButton").addClass("completeButton");
      break;
    case "slider":
      $("#sliderOutput").val(answer);
      $("#valueShower").html(sliderOutput.value + "%");
      $("#sliderButton").addClass("completeButton");
      break;
    case "list":
      $("#listAnswer").selectivity('data', answer);
      $("#listButton").addClass("completeButton");
      break;
    case "birthday":
      $("#birthdayAnswer").selectivity('data', $("#birthdayOptionInfo").selectivity('data'));
      $("#birthdayButton").addClass("completeButton");
      break;
    case "major":
      $("#majorAnswer").selectivity('data', $("#majorOptionInfo").selectivity('data'));
      $("#minorAnswer").selectivity('data', $("#minorOptionInfo").selectivity('data'));
      $("#majorButton").addClass("completeButton");
      break;
    case "consent":
      $("#consentOptionCheckboxAnswer").prop("checked", $("#consentOptionCheckbox").prop("checked"));
      $("#consentButton").addClass("completeButton");
      break;
    case "name":
      $("#firstNameAnswer").val($("#firstNameOutput").val());
      $("#lastNameAnswer").val($("#lastNameOutput").val());
      $("#nameButton").addClass("completeButton");
      break;
    case "email":
      $("#emailResponsesSwitchAnswer").prop("checked", $("#emailResponsesSwitch").prop("checked"));
      $("#emailRemindersSwitchAnswer").prop("checked", $("#emailRemindersSwitch").prop("checked"));
      $("#emailButton").addClass("completeButton");
      break;

  }

}

function setCompleted(quizQuestionIndex, answer, studentInfo) {
  var selectedQuestion = quizQuestions[quizQuestionIndex];

  selectedQuestion.complete = true;
  selectedQuestion.answer = answer;

  var id = quizQuestions[quizQuestionIndex].questionId;
  var studentId = studentInfo[2];
  var getUrl = "api/setQuestion/" + studentId + "/" + currentSurvey + "/" + id;

  if(currentSurvey == 2 && currentSurveyVersion > 1){
    getUrl = "api/setQuestion/" + studentId + "/" + currentSurvey + "-" + currentSurveyVersion + "/" + id;
  }

  $.ajax({
    type: "post",
    url: getUrl,
    data: JSON.stringify(selectedQuestion),
    dataType: "json"
  }).done(function(questionData) {

    if (answer != "optional") {
      $("#nextButton").click();
    }

  });
}

function setUserSettings(studentInfo, userdata) {

  if (userdata !== "N/A") {
    $("#firstNameOutput").empty();
    $("#lastNameOutput").empty();

    $("#firstNameOutput").val(userdata.firstName);
    $("#lastNameOutput").val(userdata.lastName);

    for (var i = 0; i < userdata.major.length; i++) {
      $("#majorOptionInfo").selectivity('add', {
        id: userdata.major[i].id,
        text: userdata.major[i].text
      });
      $("#majorAnswer").selectivity('add', {
        id: userdata.major[i].id,
        text: userdata.major[i].text
      });
    }

    for (var i = 0; i < userdata.minor.length; i++) {
      $("#minorOptionInfo").selectivity('add', {
        id: userdata.minor[i].id,
        text: userdata.minor[i].text
      });
      $("#minorAnswer").selectivity('add', {
        id: userdata.minor[i].id,
        text: userdata.minor[i].text
      });
    }


    $("#birthdayOptionInfo").selectivity('data', userdata.birthday);
    $("#birthdayAnswer").selectivity('data', userdata.birthday);

    if (userdata.consentOption == true) {
      $("#consentOptionCheckbox").prop("checked", true);
    } else {
      $("#consestOptionCheckbox").prop("checked", false);
    }

    if (userdata.emailResponses == true) {
      $("#emailResponsesSwitch").prop("checked", true);
    } else {
      $("#emailResponsesSwitch").prop("checked", false);
    }

    if (userdata.emailReminders == true) {
      $("#emailRemindersSwitch").prop("checked", true);
    } else {
      $("#emailRemindersSwitch").prop("checked", false);
    }

  } else {
    $("#firstNameOutput").empty();
    $("#lastNameOutput").empty();

    $("#firstNameOutput").val(studentInfo[0]);
    $("#lastNameOutput").val(studentInfo[1]);

    $("#consentOptionCheckbox").prop("checked", true);

  }

}

function saveUserSettings(studentInfo, netId) {
  var userdata = {};

  userdata.firstName = studentInfo[0]; // $("#firstNameOutput").val();
  userdata.lastName = studentInfo[1]; //$("#lastNameOutput").val();

  var major = $("#majorOptionInfo").selectivity('data');
  var minor = $("#minorOptionInfo").selectivity('data');

  userdata.major = major;
  userdata.minor = minor;

  userdata.birthday = $("#birthdayOptionInfo").selectivity('data');
  userdata.emailAddress = studentInfo[3]; //$("#userEmailAddress").val();

  if ($("#consentOptionCheckbox").prop("checked")) {
    userdata.consentOption = true;
  } else {
    userdata.consentOption = false;
  }

  if ($("#emailResponsesSwitch").prop("checked")) {
    userdata.emailResponses = true;
  } else {
    userdata.emailResponses = false;
  }

  if ($("#emailRemindersSwitch").prop("checked")) {
    userdata.emailReminders = true;
  } else {
    userdata.emailReminders = false;
  }

  $.ajax({
    type: "post",
    url: "api/setUserPreferences/" + netId,
    data: JSON.stringify(userdata),
    dataType: "json"
  }).done(function(userData) {

    console.log("User Settings Saved!");
    setUserSettings(studentInfo, userdata);
    setUserOptionsAnswer("all");


  });

}

function loadUserSettings(studentInfo, quizQuestionIndex, netId) {

  $.getJSON("json/majors.json", function(data) {

    buttonData = data;

    setUserButtonsData(buttonData, studentInfo, quizQuestionIndex);

  }).done(function() {

    $.ajax({
      url: "api/getUserPreferences/" + netId,
      dataType: "json",
      cache: false
    }).done(function(userdata) {

      setUserSettings(studentInfo, userdata);

    }).fail(function() {
      setUserSettings(studentInfo, "N/A");

    });

  });;
}

function setUserButtonsData(buttonData, studentInfo, quizQuestionIndex) {

  var majorData = buttonData.majors;
  var minorData = buttonData.minors;

  var major = [];
  var minor = [];
  var birthdayData = [];

  var birthdayOptions = "";

  for (var i = 1; i < majorData.length + 1; i++) {
    var majorItem = {};

    majorItem.id = i;
    majorItem.text = majorData[i - 1];

    major.push(majorItem);
  }

  for (var i = 1; i < minorData.length + 1; i++) {
    var minorItem = {};

    minorItem.id = i;
    minorItem.text = minorData[i - 1];

    minor.push(minorItem);
  }

  $('#majorOptionInfo').selectivity({
    items: major,
    multiple: true,
    placeholder: 'Type to search a major'
  });

  $('#minorOptionInfo').selectivity({
    items: minor,
    multiple: true,
    placeholder: 'Type to search a minor'
  });

  $('#majorAnswer').selectivity({
    items: major,
    multiple: true,
    placeholder: 'Type to search a major'
  });

  $('#minorAnswer').selectivity({
    items: minor,
    multiple: true,
    placeholder: 'Type to search a minor'
  });

  for (var i = 0; i < 200; i++) {
    birthdayData.push(new Date().getFullYear() - i);
  }

  $('#birthdayOptionInfo').selectivity({
    items: birthdayData,
    multiple: false,
    placeholder: 'Type to select a year'
  });

  $('#birthdayAnswer').selectivity({
    items: birthdayData,
    multiple: false,
    placeholder: 'Type to select a year'
  });

  initPDF(1);

}

function setFollowups(currentQuestion, choice, quizQuestionIndex) {
  var needsFollowup = false;
  var needsToBePushed = 0;

  for (var i = 0; i < currentQuestion.followups.length; i++) {

    var questionFollowups = [];
    questionFollowups = currentQuestion.followups[i].dependant;

    for (var k = 0; k < questionFollowups.length; k++) {
      if (questionFollowups[k] == choice) {

        // currentQuestion.followups[i].questionId = quizQuestions[quizQuestionIndex].questionId + "_" + currentQuestion.followups[i].questionId;

        needsToBePushed++;

        quizQuestions.splice(quizQuestionIndex + needsToBePushed, 0, currentQuestion.followups[i]);
        break;
      }
    }
  }
}

function setHover(hoverText) {
  $("#hoverText").html("<span>" + hoverText + "</span>");
}

function showHover(quizQuestionIndex, e) {
  if (quizQuestions[quizQuestionIndex].hover != false && e.pageX > ($('body').width() / 2) + (($('body').width() * 0.10)) && e.pageX + $("#hoverText").width() < ($('body').width() * 0.95)) {

    $("#hoverText").offset({
      left: e.pageX + 8,
      top: e.pageY + 8
    });

    $("#hoverText").css("display", "block");

  } else if (quizQuestions[quizQuestionIndex].hover != false && e.pageX < ($('body').width() / 2) + (($('body').width() * 0.10)) && e.pageX - $("#hoverText").width() > ($('body').width() * 0.20)) {

    $("#hoverText").offset({
      left: e.pageX - $("#hoverText").width(),
      top: e.pageY + 8
    });
    $("#hoverText").css("display", "block");

  } else {

    $("#hoverText").css("display", "none");

  }
}

function setQuestion(quizQuestionIndex, studentInfo) {
  clearFields();

  var currentQuestion = quizQuestions[quizQuestionIndex];

  showRequired(currentQuestion);

  if (currentQuestion.complete == false) {
    $("#sideButtonDown").addClass("stopButton");
  }else{
    $("#sideButtonDown").removeClass("stopButton");
  }

  if (currentQuestion.multi != false) {

    for (var i = 0; i < currentQuestion.multi.length; i++) {
      var currentMulti = currentQuestion.multi[i];

      currentMulti.questionId = quizQuestions[quizQuestionIndex + i].questionId + "_" + currentMulti.questionId;
      quizQuestions.splice(quizQuestionIndex + i, 0, currentMulti);
    }
    quizQuestions.splice(quizQuestionIndex + currentQuestion.multi.length, 1);
    currentQuestion = quizQuestions[quizQuestionIndex];

    loadAnswer(quizQuestionIndex, studentInfo);
  }

  if (currentQuestion.followups != false && currentQuestion.complete == true) {
    setFollowups(currentQuestion, currentQuestion.answer, quizQuestionIndex);
  }

  if (studentInfo.indexOf(currentQuestion.questionId + ".json")) {
    // console.log(currentQuestion.questionId + ".json", "(" + currentQuestion.type + ")");
  }

  $("#questionsText").html("<span id='questionsTextSpan'>" + currentQuestion.text + "</span>");

  if (currentQuestion.hover != false) {
    setHover(currentQuestion.hover);
    $("#questionsHeaderText").append("<sup style='font-size: 0.9rem;'>ⓘ</sup>");
  }

  switch (currentQuestion.type) {
    case "ok":
      setButtons(currentQuestion, quizQuestionIndex, studentInfo);
      $("#answermc").removeClass("hide");
      break;
    case "mc":
      setButtons(currentQuestion, quizQuestionIndex, studentInfo);
      $("#answermc").removeClass("hide");
      $("#answermc").addClass("flex");
      break;
    case "mcfill":
      setButtons(currentQuestion, quizQuestionIndex, studentInfo);
      $("#answermc").removeClass("hide");
      break;
    case "fill":
      updateTextBar(quizQuestionIndex);
      $("#answerfill").removeClass("hide");
      break;
    case "intfill":
      $("#answerintfill").removeClass("hide");
      break;
    case "slider":
      $("#leftExtremes").html(currentQuestion.extremes[0]);
      $("#rightExtremes").html(currentQuestion.extremes[1]);
      $("#answerslider").removeClass("hide");
      $("#valueShower").html(sliderOutput.value + "%");
      break;
    case "list":
      $('#listAnswer').selectivity({
        items: currentQuestion.choices,
        multiple: false,
        placeholder: 'Type to select a option'
      });
      $("#answerlist").removeClass("hide");
      break;
    case "birthday":
      setUserOptionsAnswer(currentQuestion.type);
      $("#answerbirthday").removeClass("hide");
      break;
    case "major":
      setUserOptionsAnswer(currentQuestion.type);
      $("#answermajorcontainer").addClass("flex");
      $("#answermajor").removeClass("hide");
      break;
    case "consent":
      setUserOptionsAnswer(currentQuestion.type);
      $("#answerconsent").removeClass("hide");
      break;
    case "name":
      setUserOptionsAnswer(currentQuestion.type);
      $("#answername").removeClass("hide");
      break;
    case "email":
      setUserOptionsAnswer(currentQuestion.type);
      $("#answeremail").removeClass("hide");
      break;
  }

  if (currentQuestion.complete == true) {
    showCompleted(currentQuestion);
  }
}

function showRequiredCompleted(studentInfo, quizQuestionIndex) {
  var currentQuestion = quizQuestions[quizQuestionIndex];

  if (currentQuestion.required == false && currentQuestion.complete == false) {
    console.log("Question " + quizQuestionIndex + " Submitted");
    setCompleted(quizQuestionIndex, "optional", studentInfo);
  }
}

function showRequired(currentQuestion) {
  if (currentQuestion.required == true) {
    $("#questionsHeaderText").html("Question");
  } else {
    $("#questionsHeaderText").html("Optional Question");
  }
}

function setUserOptionsAnswer(questionType) {

  switch (questionType) {
    case "name":
      $("#firstNameAnswer").val($("#firstNameOutput").val());
      $("#lastNameAnswer").val($("#lastNameOutput").val());
      break;

    case "birthday":
      $('#birthdayAnswer').selectivity('data', $('#birthdayOptionInfo').selectivity('data'));
      break;

    case "major":
      $('#majorAnswer').selectivity('data', $('#majorOptionInfo').selectivity('data'));
      $('#minorAnswer').selectivity('data', $('#minorOptionInfo').selectivity('data'));
      break;

    case "consent":
      $("#consentOptionCheckboxAnswer").prop("checked", $("#consentOptionCheckbox").prop("checked"));
      break;

    case "email":

      $("#emailResponsesSwitchAnswer").prop("checked", $("#emailResponsesSwitch").prop("checked"));
      $("#emailRemindersSwitchAnswer").prop("checked", $("#emailRemindersSwitch").prop("checked"));
      break;

    case "all":
      setUserOptionsAnswer("name");
      setUserOptionsAnswer("birthday");
      setUserOptionsAnswer("major");
      setUserOptionsAnswer("consent");
      setUserOptionsAnswer("email");
      break;
  }

}

function setQuestionIndex(change, quizQuestionIndex) {

  var newIndex = change + quizQuestionIndex;
  console.log(newIndex);

  if (newIndex > -1 && newIndex < quizQuestions.length) {
    updateProgressBar(newIndex, quizQuestions.length);
    $("#sideButtonUp").removeClass("stopButton");
    $("#sideButtonDown").removeClass("stopButton");

    if (newIndex == 0) {
      $("#sideButtonUp").addClass("stopButton");
    } else if (newIndex == quizQuestions.length - 1) {

    }

    return newIndex;
  } else {

    updateProgressBar(newIndex, quizQuestions.length);
    if (quizQuestionIndex > quizQuestions.length-1) {

    } else if (quizQuestionIndex < 0) {
      $("#sideButtonUp").addClass("stopButton");
    }

    return quizQuestionIndex;
  }
}

function submitAnswer(quizQuestionIndex, id, studentInfo) {
  var currentQuestion = quizQuestions[quizQuestionIndex];

  if (currentQuestion.followups != false && currentQuestion.complete == false) {
    setFollowups(currentQuestion, id.slice(8), quizQuestionIndex);
  } else if (currentQuestion.followups != false && currentQuestion.complete == true) {
    clearFollowups(quizQuestionIndex);
    setFollowups(currentQuestion, id.slice(8), quizQuestionIndex);
  }

  switch (currentQuestion.type) {
    case "fill":
      var input = $.trim($('#fillOutput').val());

      if (input.length == 0) {
        console.log("No Empty Spaces");
      } else {
        console.log("Question " + quizQuestionIndex + " Submitted");
        setCompleted(quizQuestionIndex, input, studentInfo);
      }
      break;

    case "mc":
      var choice = id.slice(8);

      console.log("Question " + quizQuestionIndex + " Submitted");
      setCompleted(quizQuestionIndex, choice, studentInfo);
      break;

    case "mcfill":
      var input = $.trim($('#fillOutput').val());

      if (input.length == 0) {
        console.log("No Empty Spaces");
      } else {
        console.log("Question " + quizQuestionIndex + " Submitted");
        var answerArray = [];
        answerArray.push(currentQuestion.mcMultiAnswer);
        answerArray.push(input);
        setCompleted(quizQuestionIndex, answerArray, studentInfo);
      }
      break;

    case "intfill":
      var input = $('#intfillOutput').val();

      if (input == 0) {
        console.log("No Empty Numbers");
      } else {
        console.log("Question " + quizQuestionIndex + " Submitted");
        setCompleted(quizQuestionIndex, input, studentInfo);
      }
      break;

    case "slider":
      console.log("Question " + quizQuestionIndex + " Submitted");
      setCompleted(quizQuestionIndex, sliderOutput.value, studentInfo);
      break;

    case "ok":
      console.log("Question " + quizQuestionIndex + " Submitted");
      setCompleted(quizQuestionIndex, 0, studentInfo);
      break;

    case "list":
      console.log("Question " + quizQuestionIndex + " Submitted");
      setCompleted(quizQuestionIndex, $("#listAnswer").selectivity('data'), studentInfo);
      break;

    case "birthday":
      $("#birthdayOptionInfo").selectivity('data', $("#birthdayAnswer").selectivity('data'));
      console.log("Question " + quizQuestionIndex + " Submitted");
      setCompleted(quizQuestionIndex, "user", studentInfo);
      break;

    case "major":
      $('#majorOptionInfo').selectivity('data', $('#majorAnswer').selectivity('data'));
      $('#minorOptionInfo').selectivity('data', $('#minorAnswer').selectivity('data'));
      console.log("Question " + quizQuestionIndex + " Submitted");
      setCompleted(quizQuestionIndex, "user", studentInfo);
      break;

    case "consent":
      $("#consentOptionCheckbox").prop("checked", $("#consentOptionCheckboxAnswer").prop("checked"));
      console.log("Question " + quizQuestionIndex + " Submitted");
      setCompleted(quizQuestionIndex, "user", studentInfo);
      break;

    case "name":
      $("#firstNameOutput").val($("#firstNameAnswer").val());
      $("#lastNameOutput").val($("#lastNameAnswer").val());
      console.log("Question " + quizQuestionIndex + " Submitted");
      setCompleted(quizQuestionIndex, "user", studentInfo);
      break;

    case "email":
      $("#emailResponsesSwitch").prop("checked", $("#emailResponsesSwitchAnswer").prop("checked"));
      $("#emailRemindersSwitch").prop("checked", $("#emailRemindersSwitchAnswer").prop("checked"));
      console.log("Question " + quizQuestionIndex + " Submitted");
      setCompleted(quizQuestionIndex, "user", studentInfo);
      break;

  }

}

function updateProgressBar(index, questionArrayLength) {

  $(".progressPoints").removeClass("complete");
  $(".progressPoints").removeClass("incomplete");

  var numProgressDots = $('.progressPoints').length;

  for (var i = 0; i < numProgressDots; i++) {

    var percentageStep = 1 / numProgressDots;
    var percentageNeeded = i * percentageStep * questionArrayLength;
    var percentage = Math.round(i * percentageStep * 100);

    if (index > percentageNeeded) {
      $("#progress" + percentage).addClass("complete");
    } else {
      $("#progress" + percentage).addClass("incomplete");
    }
  }
}

function updateTextBar(quizQuestionIndex) {
  var input = $('#fillOutput').val().length;

  var min;

  switch (quizQuestions[quizQuestionIndex].type) {
    case "name":
      min = 1;
      break;

    case "major":
      min = 3;
      break;

    case "fill":
      min = 100;
      break;
  }

  if (input > min) {
    $("#completedBarCheck").removeClass("hide");
    $("#characterCount").css("color", "#51b848");
    $("#characterCount").html("Characters Til Maximum: " + (400 - input) + " chars");
  } else {
    $("#completedBarCheck").addClass("hide");
    $("#characterCount").css("color", "#FF3B3F");
    $("#characterCount").html("Characters Til Minimum: " + (min - input) + " chars");
  }

  var percentage = (input / 400) * 90;

  $(".cursor").css("left", percentage + "%");

}

function WIPE(netId) {
  $.ajax({
    url: "api/wipeQuestions/" + netId
  }).done(function() {
    location.reload();
  });
}

function completedSurvey(){
  var studentId = studentInfo[2];
  var getUrl = "api/setCompleted/" + studentId + "/" + currentSurvey

  if(currentSurvey == 2 && currentSurveyVersion > 1){
    getUrl = "api/setCompleted/" + studentId + "/" + currentSurvey + "-" + currentSurveyVersion + "/" + id;
  }

  $.ajax({
    url: getUrl,
  }).done(function() {

    $("#sideButtonUp").addClass("stopButton");
    $("#sideButtonDown").addClass("stopButton");
    $("#questionsText").html("<span id='questionsTextSpan'>Your answers have been submitted.<br>Thank you! For help with any of your writing needs, visit the <a href='http://www.stonybrook.edu/commcms/writingcenter/' target='_blank'>SBU Writing Center</a>.</span>");
    $("#questionsHeaderText").html("You are done!");

  });
  clearFields();
}
