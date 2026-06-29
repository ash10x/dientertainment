import nodemailer from "nodemailer";

function esc(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: process.env.SMTP_SECURE !== "false",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface ContactEmailData {
  fullName: string;
  email: string;
  phone: string;
  socialHandle?: string | null;
  companyName?: string | null;
  service: string;
  budget?: string | null;
  packageName?: string | null;
  packagePrice?: string | null;
  packageDeposit?: string | null;
  message: string;
}

function buildPackageRow(data: ContactEmailData): string {
  if (!data.packageName) return "";
  const deposit = data.packageDeposit ? ` (Deposit: ${esc(data.packageDeposit)})` : "";
  const price = esc(data.packagePrice ?? "");
  return `<tr><td style="padding:8px 0;color:#999;">Package</td><td style="padding:8px 0;">${esc(data.packageName)} — ${price}${deposit}</td></tr>`;
}

export async function sendContactNotification(data: ContactEmailData) {
  const subject = data.packageName
    ? `New Booking Request — ${data.packageName}`
    : `New Contact Inquiry — ${data.service}`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#111;color:#f5f5f5;padding:32px;border-radius:8px;">
      <h2 style="color:#E50019;margin-top:0;">New ${data.packageName ? "Booking" : "Contact"} Request</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#999;width:160px;">Name</td><td style="padding:8px 0;">${esc(data.fullName)}</td></tr>
        <tr><td style="padding:8px 0;color:#999;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(data.email)}" style="color:#E50019;">${esc(data.email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#999;">Phone</td><td style="padding:8px 0;">${esc(data.phone)}</td></tr>
        ${data.socialHandle ? `<tr><td style="padding:8px 0;color:#999;">Social</td><td style="padding:8px 0;">${esc(data.socialHandle)}</td></tr>` : ""}
        ${data.companyName ? `<tr><td style="padding:8px 0;color:#999;">Company</td><td style="padding:8px 0;">${esc(data.companyName)}</td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#999;">Service</td><td style="padding:8px 0;">${esc(data.service)}</td></tr>
        ${data.budget ? `<tr><td style="padding:8px 0;color:#999;">Budget</td><td style="padding:8px 0;">${esc(data.budget)}</td></tr>` : ""}
        ${buildPackageRow(data)}
      </table>
      <hr style="border:none;border-top:1px solid #333;margin:20px 0;" />
      <p style="color:#999;font-size:13px;margin-bottom:6px;">Message</p>
      <p style="white-space:pre-wrap;font-size:14px;line-height:1.6;">${esc(data.message)}</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"DI Entertainment" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    replyTo: data.email,
    subject,
    html,
  });
}

export async function sendContactReply({
  to,
  toName,
  subject,
  message,
  adminName,
}: {
  to: string;
  toName: string;
  subject: string;
  message: string;
  adminName: string;
}) {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#111;color:#f5f5f5;padding:32px;border-radius:8px;">
      <div style="margin-bottom:24px;">
        <span style="font-size:22px;font-weight:700;letter-spacing:0.08em;color:#E50019;">di</span><span style="font-size:22px;font-weight:700;letter-spacing:0.08em;">ENTERTAINMENT</span>
      </div>
      <p style="font-size:15px;color:#ccc;margin-bottom:4px;">Hi ${esc(toName)},</p>
      <div style="margin:20px 0;padding:20px;background:#1a1a1a;border-radius:8px;border-left:3px solid #E50019;">
        <p style="white-space:pre-wrap;font-size:14px;line-height:1.7;color:#f0f0f0;margin:0;">${esc(message)}</p>
      </div>
      <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
      <p style="font-size:12px;color:#666;margin:0;">${esc(adminName)} — DI Entertainment Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"DI Entertainment" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

export async function sendBookingConfirmation(_opts: {
  to: string;
  toName: string;
  bookingRef: string;
  packageName: string | null;
  service: string;
}): Promise<void> {
  // Stub — full implementation in Task 9
}

export async function sendMeetingConfirmation(_opts: {
  to: string;
  toName: string;
  bookingRef: string;
  meetingDate: string;
  meetingEndDate: string;
  timezone: string;
  meetingType: string;
  durationMinutes: number;
  meetingUrl: string | null;
  meetingId: number;
}): Promise<void> {
  // Stub — full implementation in Task 9
}
