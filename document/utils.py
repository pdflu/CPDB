from django.core.mail import send_mail

from document.models import RequestEmail


def send_document_notification(allegation, document):
    send_document_notification_by_crid_and_link(allegation.crid, document.published_url)


def send_document_notification_by_crid_and_link(crid, link):
    request_emails = RequestEmail.objects.filter(crid=crid)
    if not request_emails.count():
        return

    emails = request_emails.values_list('email', flat=True)
    recipient_list = list(emails)

    subject = "[CPDB] Requested document for CR {crid} is now available".format(crid=crid)
    message = """Hi,

    Your requested document for CR {crid} is now available on Document Cloud. You read it at this link {link}.

    Best regards,
    The Citizens' Police Database
"""
    message = message.format(
        crid=crid,
        link=link
    )
    from_email = None

    send_mail(
        subject=subject,
        message=message,
        from_email=from_email,
        recipient_list=recipient_list
    )
