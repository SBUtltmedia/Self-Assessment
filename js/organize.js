function initFollowups(qd) {
  var followups = [];

  for (var i = 0; i < qd.followups.length; i++) {
    var question = {};
    var currentQd = qd.followups[i];

    currentQd.question.questionId = qd.questionId + "_" + currentQd.question.questionId;
    question = setQuizQuestions(currentQd.question);

    question.dependant = currentQd.choice;
    question.followupPart = true;


    followups.push(question);
  }

  return followups;
}

function initQuizQuestionsMulti(qd) {
  var multi = [];

  for (var i = 0; i < qd.parts.length; i++) {
    var multiQuestion = setQuizQuestionMulti(qd, qd.parts[i]);
    multi.push(multiQuestion);
  }
  return multi;
}

function setExtremes(qd){
  if (qd.extremes[1].indexOf("Not") !== -1) {
    qd.extremes.splice(0,0,qd.extremes[1]);
    qd.extremes.splice(2,1);
  }
}

function setQuizQuestions(qd) {
  var question = {};

  question.type = qd.type;
  question.text = qd.text;
  question.questionId = qd.questionId;
  question.followupPart = false;

  if (qd.type == "mc" || qd.type == "mcfill" || qd.type == "list") {
    question.choices = qd.choices;
  } else {
    question.choices = false;
  }

  if (qd.type == "slider") {
    setExtremes(qd);
    question.extremes = qd.extremes;
  } else {
    question.extremes = false;
  }

  if (qd.hover != null) {
    question.hover = qd.hover;
  } else {
    question.hover = false;
  }

  if (qd.multi != null) {
    var multi = new initQuizQuestionsMulti(qd);
    question.multi = multi;
  } else {
    question.multi = false;
  }

  if (qd.followups != null) {
    var followups = initFollowups(qd);
    question.followups = followups;
  } else {
    question.followups = false;
  }

  question.complete = false;
  question.answer = false;

  return question;
}

function setQuizQuestionMulti(origQd, partQd) {
  var question = {};

  question.type = origQd.type;
  question.text = origQd.text.substring(0, origQd.text.indexOf('{{MULTI}}')) + partQd.text + origQd.text.substring(origQd.text.indexOf('{{MULTI}}') + 9, origQd.text.length);
  question.questionId = partQd.questionId;
  question.followupPart = false;

  if (partQd.hover != null) {
    question.hover = partQd.hover;
  } else {
    if (origQd.hover != null) {
      question.hover = origQd.hover;
    } else {
      question.hover = false;
    }
  }

  if (origQd.type == "mc" || origQd.type == "mcfill" || origQd.type == "list") {
    question.choices = origQd.choices;
  } else {
    question.choices = false;
  }

  if (origQd.type == "slider") {
    question.extremes = origQd.extremes;
  } else {
    question.extremes = false;
  }

  if (partQd.multi != null) {
    var multi = new initQuizQuestionsMulti(partQd);
    question.multi = multi;
  } else {
    if (partQd.multi != null) {
      var multi = new initQuizQuestionsMulti(origQd);
      question.multi = multi;
    } else {
      question.multi = false;
    }
  }

  if (partQd.followups != null) {
    var followups = initFollowups(partQd);
    question.followups = followups;
  } else {
    if (origQd.followups != null) {
      var followups = initFollowups(origQd);
      question.followups = followups;
    } else {
      question.followups = false;
    }

    question.complete = false;
    question.answer = false;

    return question;

  }
}

function unify(text) {
  return text.toLowerCase();
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
