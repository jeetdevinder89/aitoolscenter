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
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#111827;max-width:600px;margin:0 auto;padding:24px;">
      <h1 style="font-size:24px;margin:0 0 16px;">Thanks for subscribing</h1>
      <p style="margin:0 0 12px;">You are now subscribed to weekly AI tool updates from AIToolsCenter.</p>
      <p style="margin:0 0 12px;">We will send concise updates on useful AI tools, product launches, and practical comparisons.</p>
      <p style="margin:0 0 20px;">You can visit the site anytime at <a href=\"{site_url}\" style=\"color:#2563eb;\">{site_url}</a>.</p>
      <p style="margin:0;color:#6b7280;font-size:14px;">AIToolsCenter</p>
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

        request_body = json.dumps([
            {
                "email": email,
                "source": "aitoolscenter-newsletter",
            }
        ]).encode("utf-8")

        request = Request(
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
            with urlopen(request, timeout=20) as response:
                status = getattr(response, "status", 200)
                if status < 200 or status >= 300:
                    self._write_json(502, {"error": "Failed to save newsletter subscription."})
                    return
        except (HTTPError, URLError):
            self._write_json(502, {"error": "Failed to save newsletter subscription."})
            return

        confirmation_sent = False

        if smtp_host and newsletter_from_email:
            confirmation_sent = send_confirmation_email(
                smtp_host=smtp_host,
                smtp_port=smtp_port,
                smtp_username=smtp_username,
                smtp_password=smtp_password,
                smtp_use_tls=smtp_use_tls,
                from_email=newsletter_from_email,
                reply_to_email=newsletter_reply_to_email,
                subscriber_email=email,
                site_url=site_url,
            )

        self._write_json(200, {"ok": True, "confirmationSent": confirmation_sent})

    def do_GET(self):
        self.send_response(405)
        self.send_header("Allow", "POST")
        self.end_headers()
