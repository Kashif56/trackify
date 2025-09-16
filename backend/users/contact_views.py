from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from trackify.utils import send_email


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_form(request):
    """
    Handle contact form submissions and send email directly
    """
    name = request.data.get('name')
    email = request.data.get('email')
    subject = request.data.get('subject')
    message = request.data.get('message')
    
    # Validate required fields
    if not all([name, email, subject, message]):
        return Response({
            'error': 'All fields are required: name, email, subject, message'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Format the email message
    email_subject = f"Contact Form: {subject}"
    email_message = f"""Contact Form Submission

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
"""
    
    # Send email to admin
    try:
        send_email('kashifmehmood926@gmail.com', email_subject, email_message)
        
        # Send confirmation email to the user
        confirmation_subject = "Thank you for contacting Trackify"
        confirmation_message = f"""Dear {name},

Thank you for contacting Trackify. We have received your message and will get back to you as soon as possible.

Your message details:
Subject: {subject}

Best regards,
The Trackify Team
"""
        
        send_email(email, confirmation_subject, confirmation_message)
        
        return Response({
            'success': True,
            'message': 'Your message has been sent successfully. We will get back to you soon.'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error sending contact form email: {e}")
        return Response({
            'error': 'Failed to send message. Please try again later.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
