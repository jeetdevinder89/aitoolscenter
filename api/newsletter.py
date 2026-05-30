import json
import os
import re
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from http.server import BaseHTTPRequestHandler
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from urllib.parse import quote


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

            server.sendmail(from_email, [subscriber_email], message.as_string())

        return True
    except Exception:
        return False


class handler(BaseHTTPRequestHandler):
    def _write_json(self, status_code: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Allow", "POST, OPTIONS")
        self.end_headers()

    def do_POST(self):
        supabase_url = os.environ.get("SUPABASE_URL", "")
        supabase_service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

        smtp_host = os.environ.get("SMTP_HOST", "")
        smtp_port = int(os.environ.get("SMTP_PORT", "587"))
        smtp_username = os.environ.get("SMTP_USERNAME", "")
        smtp_password = os.environ.get("SMTP_PASSWORD", "")
        smtp_use_tls = env_truthy(os.environ.get("SMTP_USE_TLS", "true"))
        newsletter_from_email = os.environ.get("NEWSLETTER_FROM_EMAIL", "")
        newsletter_reply_to_email = os.environ.get("NEWSLETTER_REPLY_TO_EMAIL", "")
        site_url = os.environ.get("SITE_URL", "https://aitoolscenter.in")

        if not supabase_url or not supabase_service_role_key:
            self._write_json(500, {"error": "Server is not configured for newsletter submissions."})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length) if content_length > 0 else b"{}"
            payload = json.loads(raw_body.decode("utf-8") or "{}")
        except Exception:
            self._write_json(400, {"error": "Invalid request payload."})
            return

        email = str(payload.get("email", "")).strip()

        if not email or not is_valid_email(email):
            self._write_json(400, {"error": "A valid email is required."})
            return

        # First check if email already exists (with proper URL encoding)
        encoded_email = quote(email, safe='')
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
                        self._write_json(409, {"error": "This email is already subscribed to our newsletter."})
                        return
                    # If inactive, we'll reactivate it below
        except HTTPError as e:
            if e.code == 404:
                pass  # Email not found, will insert new
            else:
                self._write_json(502, {"error": "Failed to check email subscription status."})
                return
        except URLError as e:
            self._write_json(502, {"error": "Failed to check email subscription status."})
            return
        except Exception as e:
            self._write_json(502, {"error": "Failed to check email subscription status."})
            return

        # If record exists but inactive, update it. Otherwise insert new.
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
                    status = getattr(response, "status", 200)
                    if status < 200 or status >= 300:
                        self._write_json(502, {"error": "Failed to reactivate subscription."})
                        return
            except HTTPError as e:
                self._write_json(502, {"error": "Failed to reactivate subscription."})
                return
        else:
            # Insert new subscription
            request_body = json.dumps([
                {
                    "email": email,
                    "active": True,
                    "source": "aitoolscenter-newsletter",
                }
            ]).encode("utf-8")

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
                    status = getattr(response, "status", 200)
                    if status < 200 or status >= 300:
                        self._write_json(502, {"error": "Failed to save newsletter subscription."})
                        return
            except HTTPError as e:
                error_body = e.read().decode("utf-8") if e.fp else ""
                # Check for duplicate key errors (23505 is PostgreSQL unique violation)
                if e.code == 409 or "duplicate" in error_body.lower() or "23505" in error_body.lower():
                    self._write_json(409, {"error": "This email is already subscribed to our newsletter."})
                else:
                    error_msg = f"HTTP {e.code}: {error_body[:200]}" if error_body else f"HTTP {e.code}"
                    print(f"Insert error: {error_msg}")
                    self._write_json(502, {"error": "Failed to save newsletter subscription."})
                return
            except URLError:
                self._write_json(502, {"error": "Failed to save newsletter subscription."})
                return

        confirmation_sent = False

        if smtp_host:
            # Use newsletter email if configured, otherwise fall back to SMTP username
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

        self._write_json(200, {"ok": True, "confirmationSent": confirmation_sent})

    def do_GET(self):
        self.send_response(405)
        self.send_header("Allow", "POST")
        self.end_headers()
