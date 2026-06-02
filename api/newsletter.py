import json
import os
import re
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from urllib.parse import quote, parseaddr


EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def is_valid_email(value: str) -> bool:
    return bool(EMAIL_PATTERN.match(value))


def env_truthy(value: str) -> bool:
    return str(value).strip().lower() not in {"", "0", "false", "no", "off"}


def send_confirmation_email(
    smtp_host: str,
    smtp_port: int,
    smtp_username: str,
    smtp_password: str,
    smtp_use_tls: bool,
    from_email: str,
    reply_to_email: str,
    subscriber_email: str,
    site_url: str,
) -> bool:
    message = MIMEMultipart("alternative")
    message["Subject"] = "You are subscribed to AIToolsCenter updates"
    message["From"] = from_email
    message["To"] = subscriber_email

    envelope_from_email = parseaddr(from_email)[1] or from_email

    if reply_to_email:
        message["Reply-To"] = reply_to_email

    html = f"""
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#111827;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
      <h1 style="font-size:24px;margin:0 0 16px;color:#0f172a;">✓ Thanks for subscribing!</h1>
      <p style="margin:0 0 12px;color:#111827;">You are now subscribed to <strong>weekly AI tool updates</strong> from AIToolsCenter.</p>
      <p style="margin:0 0 12px;color:#111827;">📬 Every Monday, we'll send you:</p>
      <ul style="margin:0 0 16px;padding-left:20px;color:#111827;">
        <li>Top 5 trending AI tools of the week</li>
        <li>Latest product launches & updates</li>
        <li>Practical tool comparisons</li>
        <li>Curated AI news & insights</li>
      </ul>
      <p style="margin:0 0 20px;color:#111827;"><strong>🌐 Visit the site:</strong> <a href="{site_url}" style="color:#2563eb;text-decoration:none;">{site_url}</a></p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
      <p style="margin:12px 0;color:#6b7280;font-size:13px;">📧 You're receiving this email because you subscribed to our newsletter.</p>
      <p style="margin:0;color:#6b7280;font-size:13px;">💬 Questions? Reply to this email or contact <a href="mailto:support@aitoolscenter.in" style="color:#2563eb;text-decoration:none;">support@aitoolscenter.in</a></p>
      <p style="margin:12px 0 0;color:#6b7280;font-size:12px;">— AIToolsCenter Team</p>
      <p style="margin:12px 0 0;padding-top:12px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;"><a href="https://www.aitoolscenter.in/api/unsubscribe?email={quote(subscriber_email, safe='')}" style="color:#9ca3af;text-decoration:underline;">Unsubscribe</a> | <a href="{site_url}#contact" style="color:#9ca3af;text-decoration:underline;">Manage preferences</a></p>
    </div>
    """

    message.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
            if smtp_use_tls:
                server.starttls(context=ssl.create_default_context())

            if smtp_username and smtp_password:
                server.login(smtp_username, smtp_password)

            server.sendmail(envelope_from_email, [subscriber_email], message.as_string())

        return True
    except Exception:
        return False


def handler(request):
    """Vercel serverless function handler for newsletter subscription."""
    try:
        # Only accept POST and OPTIONS
        if request.method == "OPTIONS":
            return {
                "statusCode": 204,
                "headers": {"Allow": "POST, OPTIONS"},
            }

        if request.method != "POST":
            return {
                "statusCode": 405,
                "headers": {"Allow": "POST, OPTIONS", "Content-Type": "application/json"},
                "body": json.dumps({"error": "Method not allowed. Use POST to subscribe."}),
            }

        # Load environment variables
        supabase_url = os.environ.get("SUPABASE_URL", "").strip()
        supabase_service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()

        smtp_host = os.environ.get("SMTP_HOST", "").strip()
        _smtp_port_str = os.environ.get("SMTP_PORT", "587").strip()
        smtp_port = int(_smtp_port_str) if _smtp_port_str.isdigit() else 587
        smtp_username = os.environ.get("SMTP_USERNAME", "").strip()
        smtp_password = os.environ.get("SMTP_PASSWORD", "").strip()
        smtp_use_tls = env_truthy(os.environ.get("SMTP_USE_TLS", "true"))
        newsletter_from_email = os.environ.get("NEWSLETTER_FROM_EMAIL", "").strip()
        newsletter_reply_to_email = os.environ.get("NEWSLETTER_REPLY_TO_EMAIL", "").strip()
        site_url = os.environ.get("SITE_URL", "https://aitoolscenter.in").strip()

        if not supabase_url or not supabase_service_role_key:
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Server is not configured for newsletter submissions."}),
            }

        # Parse request body
        try:
            if isinstance(request.body, str):
                payload = json.loads(request.body) if request.body else {}
            else:
                payload = json.loads(request.body.decode("utf-8")) if request.body else {}
        except Exception:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Invalid request payload."}),
            }

        # Extract and validate email
        email = str(payload.get("email", "")).strip()
        if not email or not is_valid_email(email):
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "A valid email is required."}),
            }

        # Check if email already exists
        encoded_email = quote(email, safe="")
        check_url = f"{supabase_url}/rest/v1/newsletter_submissions?email=eq.{encoded_email}&select=id,active"

        check_request = Request(
            check_url,
            method="GET",
            headers={
                "apikey": supabase_service_role_key,
                "Authorization": f"Bearer {supabase_service_role_key}",
                "Content-Type": "application/json",
            },
        )

        existing_record = None
        try:
            with urlopen(check_request, timeout=20) as response:
                response_text = response.read().decode("utf-8")
                existing = json.loads(response_text) if response_text else []

                if existing and len(existing) > 0:
                    existing_record = existing[0]
                    # Check if already active
                    if existing_record.get("active", False):
                        return {
                            "statusCode": 409,
                            "headers": {"Content-Type": "application/json"},
                            "body": json.dumps({"error": "This email is already subscribed to our newsletter."}),
                        }
        except HTTPError as e:
            if e.code != 404:
                return {
                    "statusCode": 502,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps({"error": "Failed to check email subscription status."}),
                }
        except URLError:
            return {
                "statusCode": 502,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Failed to check email subscription status."}),
            }

        # Insert or update subscription
        if existing_record:
            # Reactivate inactive subscription
            update_request = Request(
                f"{supabase_url}/rest/v1/newsletter_submissions?email=eq.{encoded_email}",
                data=json.dumps({"active": True}).encode("utf-8"),
                method="PATCH",
                headers={
                    "apikey": supabase_service_role_key,
                    "Authorization": f"Bearer {supabase_service_role_key}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal",
                },
            )

            try:
                with urlopen(update_request, timeout=20) as response:
                    status = response.status if hasattr(response, "status") else 200
                    if status < 200 or status >= 300:
                        return {
                            "statusCode": 502,
                            "headers": {"Content-Type": "application/json"},
                            "body": json.dumps({"error": "Failed to reactivate subscription."}),
                        }
            except HTTPError:
                return {
                    "statusCode": 502,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps({"error": "Failed to reactivate subscription."}),
                }
        else:
            # Insert new subscription
            request_body = json.dumps(
                [
                    {
                        "email": email,
                        "active": True,
                        "source": "aitoolscenter-newsletter",
                    }
                ]
            ).encode("utf-8")

            insert_request = Request(
                f"{supabase_url}/rest/v1/newsletter_submissions",
                data=request_body,
                method="POST",
                headers={
                    "apikey": supabase_service_role_key,
                    "Authorization": f"Bearer {supabase_service_role_key}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal",
                },
            )

            try:
                with urlopen(insert_request, timeout=20) as response:
                    status = response.status if hasattr(response, "status") else 200
                    if status < 200 or status >= 300:
                        return {
                            "statusCode": 502,
                            "headers": {"Content-Type": "application/json"},
                            "body": json.dumps({"error": "Failed to save newsletter subscription."}),
                        }
            except HTTPError as e:
                error_body = ""
                try:
                    if e.fp:
                        error_body = e.read().decode("utf-8")
                except Exception:
                    pass

                if e.code == 409 or "duplicate" in error_body.lower() or "23505" in error_body.lower():
                    return {
                        "statusCode": 409,
                        "headers": {"Content-Type": "application/json"},
                        "body": json.dumps({"error": "This email is already subscribed to our newsletter."}),
                    }
                else:
                    return {
                        "statusCode": 502,
                        "headers": {"Content-Type": "application/json"},
                        "body": json.dumps({"error": "Failed to save newsletter subscription."}),
                    }
            except URLError:
                return {
                    "statusCode": 502,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps({"error": "Failed to save newsletter subscription."}),
                }

        # Send confirmation email
        confirmation_sent = False
        if smtp_host:
            from_email = newsletter_from_email or smtp_username
            if from_email:
                confirmation_sent = send_confirmation_email(
                    smtp_host=smtp_host,
                    smtp_port=smtp_port,
                    smtp_username=smtp_username,
                    smtp_password=smtp_password,
                    smtp_use_tls=smtp_use_tls,
                    from_email=from_email,
                    reply_to_email=newsletter_reply_to_email,
                    subscriber_email=email,
                    site_url=site_url,
                )

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"ok": True, "confirmationSent": confirmation_sent}),
        }

    except Exception as e:
        import traceback

        error_details = traceback.format_exc()
        print(f"POST /api/newsletter error: {error_details}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Internal server error. Check logs.", "details": str(e)[:200]}),
        }
