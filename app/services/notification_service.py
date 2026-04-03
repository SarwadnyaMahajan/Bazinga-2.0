"""
Notification Service
Sends email + Telegram notifications for:
- AUTO_APPROVE → claimant (settlement details)
- MANUAL_REVIEW → reviewer (queue alert) + claimant (pending notice)
- REJECT → claimant (rejection reason)
- REVIEWER_DECISION → claimant (final outcome after manual review)
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


# ─── Email ────────────────────────────────────────────────────────────────────

def send_email(to: str, subject: str, body: str):
    if not settings.smtp_user or not settings.smtp_password:
        logger.warning("Email credentials not configured — skipping email.")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.email_from
        msg["To"] = to
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.email_from, to, msg.as_string())

        logger.info(f"Email sent to {to}: {subject}")

    except Exception as e:
        logger.error(f"Email send failed to {to}: {e}")


# ─── Telegram ─────────────────────────────────────────────────────────────────

def send_telegram(chat_id: str, message: str):
    if not settings.telegram_bot_token or not chat_id:
        logger.warning("Telegram not configured or no chat_id — skipping.")
        return

    try:
        url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
        payload = {"chat_id": chat_id, "text": message, "parse_mode": "HTML"}
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        logger.info(f"Telegram message sent to {chat_id}")

    except Exception as e:
        logger.error(f"Telegram send failed to {chat_id}: {e}")


# ─── Notification Templates ───────────────────────────────────────────────────

def notify_auto_approve(claim_id: str, claimant_name: str, claimant_email: str,
                         telegram_id: str, transaction_id: str, amount: float, settled_at: str):
    subject = f"✅ Claim #{claim_id} Approved & Settled"
    body = f"""
    <h2>Your Claim Has Been Approved!</h2>
    <p>Dear <strong>{claimant_name}</strong>,</p>
    <p>We're pleased to inform you that your insurance claim has been <strong>automatically approved and settled</strong>.</p>
    <table>
      <tr><td><b>Claim ID</b></td><td>{claim_id}</td></tr>
      <tr><td><b>Transaction ID</b></td><td>{transaction_id}</td></tr>
      <tr><td><b>Settlement Amount</b></td><td>₹{amount:,.2f}</td></tr>
      <tr><td><b>Settled At</b></td><td>{settled_at}</td></tr>
    </table>
    <p>The amount will reflect in your account within 2-3 business days.</p>
    <p>Thank you for choosing us.</p>
    """
    send_email(claimant_email, subject, body)

    tg_msg = (
        f"✅ <b>Claim Approved!</b>\n"
        f"Claim ID: #{claim_id}\n"
        f"Transaction: {transaction_id}\n"
        f"Amount: ₹{amount:,.2f}\n"
        f"Settled: {settled_at}"
    )
    if telegram_id:
        send_telegram(telegram_id, tg_msg)


def notify_manual_review(claim_id: str, claimant_name: str, claimant_email: str,
                          telegram_id: str, score: float):
    # Notify claimant
    subject = f"⏳ Claim #{claim_id} Under Review"
    body = f"""
    <h2>Your Claim is Under Review</h2>
    <p>Dear <strong>{claimant_name}</strong>,</p>
    <p>Your claim has been received and is currently under <strong>manual review</strong> by our team.</p>
    <p>Claim ID: <strong>#{claim_id}</strong></p>
    <p>You will receive a notification once the review is complete (typically within 24–48 hours).</p>
    """
    send_email(claimant_email, subject, body)
    if telegram_id:
        send_telegram(telegram_id,
            f"⏳ <b>Claim Under Review</b>\nClaim ID: #{claim_id}\nOur team will review it within 24-48 hours.")

    # Notify reviewer
    reviewer_msg = (
        f"🔍 <b>New Claim for Manual Review</b>\n"
        f"Claim ID: #{claim_id}\n"
        f"Claimant: {claimant_name}\n"
        f"Score: {score:.2f}\n"
        f"Action required: /review/{claim_id}"
    )
    send_telegram(settings.telegram_reviewer_chat_id, reviewer_msg)


def notify_reject(claim_id: str, claimant_name: str, claimant_email: str,
                   telegram_id: str, reason: str):
    subject = f"❌ Claim #{claim_id} Could Not Be Processed"
    body = f"""
    <h2>Claim Could Not Be Processed</h2>
    <p>Dear <strong>{claimant_name}</strong>,</p>
    <p>Unfortunately, your claim could not be approved at this time.</p>
    <p><b>Reason:</b> {reason}</p>
    <p>Claim ID: <strong>#{claim_id}</strong></p>
    <p>If you believe this is an error, please contact our support team with your Claim ID.</p>
    """
    send_email(claimant_email, subject, body)
    if telegram_id:
        send_telegram(telegram_id,
            f"❌ <b>Claim #{claim_id} Not Approved</b>\nReason: {reason}")


def notify_reviewer_decision(claim_id: str, claimant_name: str, claimant_email: str,
                              telegram_id: str, approved: bool,
                              transaction_id: str = None, amount: float = None,
                              notes: str = None):
    if approved:
        subject = f"✅ Claim #{claim_id} Approved After Review"
        body = f"""
        <h2>Claim Approved</h2>
        <p>Dear <strong>{claimant_name}</strong>,</p>
        <p>After manual review, your claim <strong>#{claim_id}</strong> has been <strong>approved</strong>.</p>
        <p>Transaction ID: <strong>{transaction_id}</strong></p>
        <p>Settlement Amount: <strong>₹{amount:,.2f}</strong></p>
        {'<p>Reviewer notes: ' + notes + '</p>' if notes else ''}
        """
        send_email(claimant_email, subject, body)
        if telegram_id:
            send_telegram(telegram_id,
                f"✅ <b>Claim #{claim_id} Approved!</b>\nTxn: {transaction_id}\nAmount: ₹{amount:,.2f}")
    else:
        subject = f"❌ Claim #{claim_id} Rejected After Review"
        body = f"""
        <h2>Claim Rejected</h2>
        <p>Dear <strong>{claimant_name}</strong>,</p>
        <p>After manual review, your claim <strong>#{claim_id}</strong> has been <strong>rejected</strong>.</p>
        {'<p>Reason: ' + notes + '</p>' if notes else ''}
        <p>Contact support if you have questions.</p>
        """
        send_email(claimant_email, subject, body)
        if telegram_id:
            send_telegram(telegram_id, f"❌ <b>Claim #{claim_id} Rejected</b>\n{notes or ''}")
