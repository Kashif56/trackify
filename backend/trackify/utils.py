import re
import requests
from django.conf import settings
from dotenv import load_dotenv
import os

load_dotenv()
EMAILIT_API_KEY = os.getenv('EMAILIT_API')

def send_email(to_email, subject, text_content=''):
    """
    Send an email using the EmailIt API.

    Parameters:
    - to_email (str): Recipient(s) email address.
    - subject (str): The subject of the email.
    - text_content (str, optional): The plain text content of the email.
    """

    url = "https://api.emailit.com/v1/emails"
    req_headers = {
        "Authorization": f"Bearer {EMAILIT_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    from_email = "Trackify <noreply@trackify.com>"

    data = {
        "from": from_email,
        "to": to_email,
        "subject": subject,
        "text": text_content
    }

    if settings.DEBUG == False:
        try:
            response = requests.post(url, json=data, headers=req_headers)

            if response.status_code in [200, 201]:
                return {"success": True, "response": response.json()}
            else:
                print(response.text)

        except requests.exceptions.RequestException as e:
            print(f"Failed to send email: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "status_code": getattr(e.response, "status_code", None),
                "response_text": getattr(e.response, "text", None)
        }

    else:
        return {"success": True, "response": "Email not sent in debug mode"}