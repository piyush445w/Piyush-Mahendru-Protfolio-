"""
M5 — Contact Form Route (§3.3, §7)
====================================
- POST /contact with CSRF protection (Flask-WTF)
- Server-side validation (required fields, email format)
- Honeypot field for spam bots
- Flask-Limiter rate limiting: 3 POST /contact per minute per IP
- Flask-Mail to forward the message to the site owner
- Returns JSON for AJAX consumption (no page reload)
"""

from flask import Blueprint, current_app, jsonify, request
from flask_mail import Message
from markupsafe import escape
from extensions import limiter

contact_bp = Blueprint('contact', __name__)


def _validate_contact(data):
    """Server-side validation. Returns (is_valid, error_message_or_None)."""
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    message = (data.get('message') or '').strip()

    errors = {}

    if not name:
        errors['name'] = 'Name is required.'
    if not email:
        errors['email'] = 'Email is required.'
    elif '@' not in email or '.' not in email.split('@')[-1]:
        errors['email'] = 'Please enter a valid email address.'
    if not message:
        errors['message'] = 'Message is required.'
    elif len(message) < 10:
        errors['message'] = 'Message must be at least 10 characters.'

    return (len(errors) == 0, errors, {'name': name, 'email': email, 'message': message})


@contact_bp.route('/contact', methods=['POST'])
@limiter.limit('3 per minute')
def contact_submit():
    """Handle contact form submission via AJAX."""
    # ── Honeypot check: a real browser never fills this hidden field ──
    honeypot = request.form.get('website', '').strip()
    if honeypot:
        # Silently "succeed" to trick bots, but don't process
        return jsonify({'status': 'success', 'message': 'Message sent successfully!'}), 200

    # ── Validate ──
    is_valid, errors, cleaned = _validate_contact(request.form)

    if not is_valid:
        return jsonify({'status': 'error', 'errors': errors}), 422

    # ── Send email via Flask-Mail (skip if SMTP not configured) ──
    smtp_server = current_app.config.get('MAIL_SERVER')
    if not smtp_server:
        current_app.logger.info(
            'CONTACT FORM (no SMTP configured — set MAIL_SERVER env var):\n'
            f'  From: {cleaned["name"]} <{cleaned["email"]}>\n'
            f'  Message: {cleaned["message"]}'
        )
        return jsonify({
            'status': 'error',
            'errors': {'_form': 'Mail is not configured on the server. Set MAIL_SERVER in the .env file, or email me directly.'}
        }), 500

    try:
        mail = current_app.extensions.get('mail')
        if mail is None:
            current_app.logger.warning('Mail extension not initialized.')
            return jsonify({
                'status': 'error',
                'errors': {'_form': 'Mail extension not available.'}
            }), 500

        msg = Message(
            subject=f'Portfolio Contact: {escape(cleaned["name"])}',
            recipients=[current_app.config.get('MAIL_DEFAULT_RECIPIENT')
                       or current_app.config.get('MAIL_USERNAME')
                       or 'you@example.com'],
            reply_to=cleaned['email'],
            body=(
                f'Name: {cleaned["name"]}\n'
                f'Email: {cleaned["email"]}\n\n'
                f'Message:\n{cleaned["message"]}'
            ),
        )
        mail.send(msg)
    except Exception as e:
        current_app.logger.error(f'Mail send failed: {e}')
        return jsonify({
            'status': 'error',
            'errors': {'_form': 'Failed to send message. Please try again later or email directly.'}
        }), 500

    return jsonify({'status': 'success', 'message': 'Message sent successfully! I\'ll get back to you soon.'}), 200

