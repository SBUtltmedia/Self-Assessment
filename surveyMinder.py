#!/usr/bin/python
import fnmatch
import os
import json
import datetime
from send_mail import send_mail
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

now = datetime.datetime.now()
matches = []
for root, dirnames, filenames in os.walk('surveys'):
    for filename in fnmatch.filter(filenames, 'settings.json'):
        matches.append(os.path.join(root, filename))
for i in matches:
    with open(i) as x: settings = x.read()
    dates = json.loads(settings)["dates"]
    var = 0
    survey = 0

    print '                              '
    print '##############################'
    print i

    for j in dates:
        surveyDate= datetime.datetime.strptime(j, '%m/%d/%Y')
        if((surveyDate.date() == (now+datetime.timedelta(7)).date())):
            userSettings=[]
            users=[]
            for root, dirnames, filenames in os.walk('surveys/'+i.split("/")[1]+"/"+i.split("/")[2]+'/data'):
                for filename in fnmatch.filter(filenames, 'userInfo.json'):
                    userSettings.append(os.path.join(root, filename))

            for y in userSettings:
                with open(y) as z: info = z.read()
                users.append(json.loads(info)["mail"])

            print users
            send_mail('tltmedialab@connect.stonybrook.edu',users,'Writing and Transfer Tool (WATT) Assignment due by '+str(surveyDate.date())+' for '+i.split("/")[2],'This is a reminder to complete an installment of the Writing and Transfer Tool (WATT) due by '+str(surveyDate.date())+'.<br><br>You have either elected or been assigned to use WATT to improve your writing.  This tool works by helping you to apply former skills as well as new awareness to your current or upcoming written work.<br>Please go to <a href="https://apps.tlt.stonybrook.edu/watt/surveys/'+i.split("/")[1]+"/"+i.split("/")[2]+'">https://apps.tlt.stonybrook.edu/watt/surveys/'+i.split("/")[1]+"/"+i.split("/")[2]+'</a> to complete this assigment. <br><br>To disable these reminder alerts, go to the Settings function in the WATT app.<br>')
            print 'Sent for ' + surveyDate.strftime("%m-%d-%Y")
        else:
            print 'Not Sent for ' + surveyDate.strftime("%m-%d-%Y")
        if((now.date()) >= surveyDate.date()):
            if(var == 0):
                survey = 1
            else:
                if(var == (len(dates)-2)):
                    survey = 2

        var = var + 1
    print 'Current Survey: ' + str(survey)
    print '##############################'
    print '                              '
