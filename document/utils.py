from django.core.mail import send_mail

from cpdb.celery import app
from document.models import RequestEmail
from api.models import Setting


def send_document_notification(allegation, document):
    send_document_notification_by_crid_and_link(
        allegation.crid, document.published_url)


@app.task
def send_document_notification_by_crid_and_link(crid, link):
    request_emails = RequestEmail.objects.filter(crid=crid)
    if not request_emails.count():
        return

    emails = request_emails.values_list('email', flat=True)
    recipient_list = list(emails)

    setting = Setting.objects.all().first()
    subject = setting.requested_document_email_subject.format(crid=crid)
    message = setting.requested_document_email_text\
        .format(crid=crid, link=link)
    from_email = None

    send_mail(
        subject=subject,
        message=message,
        from_email=from_email,
        recipient_list=recipient_list
    )
    send_document_notification_by_crid_and_link.called = True
