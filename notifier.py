import smtplib

SMTP_SERVER     = r"mail.gmx.com"
SMTP_PORT       = 587
MAIL_ACCOUNT    = r"sep.seven@gmx.com"
MAIL_PW         = r"Password123!"

def notify_by_mail(mail_target, subject, message):
    """Sends an email to the 'mail_target' (e.g. bob@gmail.com) with a subject and a message"""
    smtpobj = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    smtpobj.ehlo()
    smtpobj.starttls()
    smtpobj.login(MAIL_ACCOUNT, MAIL_PW)
    smtpobj.sendmail(MAIL_ACCOUNT, mail_target, 
        "From: SEP Group 7\r\n" + "Subject: " + subject + "\r\n" + message + "\r\n")
    smtpobj.quit()
    print ("Mail sent to " + mail_target)    