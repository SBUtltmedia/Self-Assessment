import smtplib
#from os.path import basename
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate

def send_mail(send_from, send_to, subject, text, attachments=None, server="127.0.0.1"):
	fileName = subject + ".ics"
	assert isinstance(send_to, list)

	msg = MIMEMultipart('alternative')	#alternative needed for HTML
	msg['From'] = send_from
	msg['To'] = COMMASPACE.join(send_to)
	msg['Date'] = formatdate(localtime=True)
	msg['Subject'] = subject

	msg.attach(MIMEText(text, "html"))

	for attachment in attachments or []:
		part = MIMEApplication(
			attachment,
			Name=fileName
		)
		part['Content-Disposition'] = 'attachment; filename="%s"' % fileName
		msg.attach(part)

	smtp = smtplib.SMTP(server)
	smtp.sendmail(send_from, send_to, msg.as_string())
	smtp.close()
