# Self-Assessment Quiz
  This project is a quiz taking web application made for Stony Brook Students. The program is for teachers who want to customize their own quizzes they can give to students. 

## Quiz Features

### Getting Started

Create Json file with name "SurveyQuestions". Start Json file for questions like this:

```JS

{"questions": [{
  (Questions)
 }]
}

```

### Different Question Types

Mulitple Choice (mc):

![mc example](https://github.com/SBUtltmedia/Self-Assessment/blob/master/README%20media/mc.png?raw=true)

```JS 
{
  "type": "mc",
  "text": "(Question Text)",
  "choices": ["Choice 1", "Choice 2" , "Choice ETC"],
  "questionId": "sec_#"
}

```

Okay Choice (ok):

![ok example](https://github.com/SBUtltmedia/Self-Assessment/blob/master/README%20media/ok.png?raw=true)

```JS 
{
  "type": "ok", 
  "text": "(Question Text)",
  "questionId": "sec_#"
}

``` 

Number Fill-In (intfill):

![intfill example](https://github.com/SBUtltmedia/Self-Assessment/blob/master/README%20media/intfill.png?raw=true)

```JS 
{
  "type": "intfill",
  "text": "(Question Text)",
  "questionId": "sec_#"
}

```

Text Fill-In (fill):

![fill example](https://github.com/SBUtltmedia/Self-Assessment/blob/master/README%20media/fill.png?raw=true)

```JS 
{
  "type": "fill",
  "text": "(Question Text)",
  "questionId": "sec_#"
}

```

Multiple Choice/Fill In (mcfill):

```JS 
{
  "type": "mcfill",
  "text": "(Question Text)",
  "choices": ["Choice 1", "Choice 2" , "Choice ETC"],
  "questionId": "sec_#"
}

```

Slider Ranges (slider):

![slider example](https://github.com/SBUtltmedia/Self-Assessment/blob/master/README%20media/slider.png?raw=true)

```JS 
{
  "type": "slider",
  "text": "(Question Text)",
  "extremes": ["Extreme (Variable)", "Not at all (Variable)"],
  "questionId": "sec_#"
}

```

Dropdwon Choices (list):

![list example](https://github.com/SBUtltmedia/Self-Assessment/blob/master/README%20media/list.png?raw=true)

```JS 
{
  "type": "list",
  "text": "(Question Text)",
  "choices": ["Choice 1", "Choice 2" , "Choice ETC"],
  "questionId": "sec_#"
}

```

### User Setting Questions
Birthday Question (birthday):

![birthday example](https://github.com/SBUtltmedia/Self-Assessment/blob/master/README%20media/birthday.png?raw=true)

```JS 
{
  "type": "birthday",
  "text": "(Question Text)",
  "questionId": "sec_#"
}

```

Major and Minor Question (major):

![major example](https://github.com/SBUtltmedia/Self-Assessment/blob/master/README%20media/major.png?raw=true)

```JS 
{
  "type": "major",
  "text": "(Question Text)",
  "questionId": "sec_#"
}

```

Consent Release Question (consent):

![consent example](https://github.com/SBUtltmedia/Self-Assessment/blob/master/README%20media/consent.png?raw=true)

```JS 
{
  "type": "consent",
  "text": "(Question Text)",
  "questionId": "sec_#"
}

```

Name Question (name):

![name example](https://github.com/SBUtltmedia/Self-Assessment/blob/master/README%20media/name.png?raw=true)

```JS 
{
  "type": "name",
  "text": "(Question Text)",
  "questionId": "sec_#"
}

```

Emailing Options Question (email):

![email example](https://github.com/SBUtltmedia/Self-Assessment/blob/master/README%20media/email.png?raw=true)

```JS 
{
  "type": "email",
  "text": "(Question Text)",
  "questionId": "sec_#"
}

```


### Question Features

Multiple Questions (multi):

  ```JS 
{
	"type": "(Question Type)",
	"text": "(Question Text *add "{{MULTI}}" to area where you want text to be replaced*)",
	"multi": true,
	"parts": [{
		"text": "Expression #1",
		"questionId": "parts0"
	}, {
		"text": "Expression #2",
		"questionId": "parts1"
	}, {
		"text": "Expression #3",
		"questionId": "parts2"
	}],
	"questionId": "sec_#"
}
```

Followup Questions (followups):

```JS 
{
  "type": "mc",
  "text": "(Question Text)",
  "followups": [{
  "choice": [#],
    "question": {
      "type": "(Question Type)",
      "text": "(Question Text)",
      "questionId": "followups#"
      }
    }],
  "questionId": "sec_#"
}

```

Hovering Text (hover):

```JS 
{
  "type": "(Question Type)",
  "text": "(Question Text)",
  "hover": "(Hover Text)",
  "questionId": "sec_#"
}

```

Optional Questions (required):

```JS 
{
  "type": "(Question Type)",
  "text": "(Question Text)",
  "required": true/false,
  "questionId": "sec_#"
}

```

## Author:
Created by [Rahul Sondhi](https://github.com/RahulSondhi) at TLL(Teaching Learning Lab) in Stony Brook University
